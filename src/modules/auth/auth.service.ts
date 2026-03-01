import bcrypt from 'bcrypt';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../../../prisma/generated/enums';
import config from '../../config';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import { getAuthStatus } from '../../utils/auth-status';
import { hashPassword } from '../../utils/bcrypt.utils';
import * as jwtHelper from '../../utils/jwt.utils';
import { RedisUtils } from '../../utils/redis.utils';
import { OtpType } from '../otp/otp.interface';
import { OtpService } from '../otp/otp.service';
import { UserRepository } from '../user/user.repository';
import { AUTH_CACHE_KEY, AUTH_CACHE_TTL } from './auth.cache';
import {
  IChangePasswordPayload,
  IForgotPasswordPayload,
  ILoginPayload,
  ILogoutPayload,
  IRefreshTokenPayload,
  IRegisterPayload,
  IResendOtpPayload,
  IResetPasswordPayload,
  IVerifyOtpPayload,
} from './auth.interface';

// ── Register ───────────────────────────────────────────────────────────────────
const register = async (payload: IRegisterPayload) => {
  const { fullName, email, password, phoneNumber, role = UserRole.USER } = payload;

  // 1. Check if user already exists
  const existing = await UserRepository.getUserByEmail(email);
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'User already exists');

  // 2. Validate role — only USER or COMPANY allowed for self-registration
  if (role !== UserRole.USER && role !== UserRole.COMPANY) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Only USER or COMPANY roles are allowed for registration'
    );
  }

  // 3. Hash password
  const hashedPassword = await hashPassword(password);

  // 4. Create user and company in a transaction if role is COMPANY
  const result = await database.$transaction(async tx => {
    // Create user first
    const newUser = await tx.user.create({
      data: {
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
      },
    });

    // Create company if role is COMPANY and companyName provided
    let companyId: string | undefined;
    if (role === UserRole.COMPANY && payload.companyName) {
      const company = await tx.company.create({
        data: {
          name: payload.companyName,
          location: payload.companyLocation,
          industry: payload.companyIndustry,
          owner: {
            connect: { id: newUser.id },
          },
        },
      });
      companyId = company.id;

      // Update user with companyId
      await tx.user.update({
        where: { id: newUser.id },
        data: { companyId },
      });
    }

    return newUser;
  });

  // 5. Create OTP session for email verification
  const sessionId = await OtpService.createOtpSession(result, OtpType.EMAIL_VERIFICATION);

  return {
    message: 'Registration successful! Please verify your email.',
    data: {
      email: result.email,
      sessionId,
      role: result.role,
    },
  };
};

// ── Login ──────────────────────────────────────────────────────────────────────
const login = async (payload: ILoginPayload, req?: Request) => {
  const { email, password } = payload;

  // 1. Check lockout
  const lockKey = AUTH_CACHE_KEY.LOGIN_LOCK(email);
  const attemptKey = AUTH_CACHE_KEY.LOGIN_ATTEMPT(email);

  const isLocked = await RedisUtils.existsCache(lockKey);
  if (isLocked) {
    throw new ApiError(
      StatusCodes.TOO_MANY_REQUESTS,
      'Account locked due to too many failed attempts. Try again in 2 minutes.'
    );
  }

  // 2. Find user
  const user = await database.user.findUnique({ where: { email } });

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid credentials.');

  // 3. Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const attempts = await RedisUtils.incrementCounter(attemptKey);
    if (attempts === 1) await RedisUtils.updateTTL(attemptKey, AUTH_CACHE_TTL.LOGIN_ATTEMPT);
    if (attempts >= 5) {
      await RedisUtils.setCache(lockKey, 'locked', AUTH_CACHE_TTL.LOGIN_LOCK);
      await RedisUtils.deleteCache(attemptKey);
      throw new ApiError(
        StatusCodes.TOO_MANY_REQUESTS,
        `Account locked for ${AUTH_CACHE_TTL.LOGIN_LOCK / 60} minutes.`
      );
    }
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      `Invalid credentials. ${5 - attempts} attempts remaining.`
    );
  }

  // 4. Clear failed attempts
  await RedisUtils.deleteCache(attemptKey);

  // 5. Check auth status (email verification gate)
  const authStatus = getAuthStatus(user);
  if (authStatus) {
    if (!authStatus.status.isEmailVerified) {
      const sessionId = await OtpService.createOtpSession(user, OtpType.EMAIL_VERIFICATION);
      return { message: authStatus.message, data: { ...authStatus.status, sessionId } };
    }
    return { message: authStatus.message, data: authStatus.status };
  }

  // 6. Generate tokens
  const [accessToken, refreshToken] = await Promise.all([
    jwtHelper.generateAccessToken(user.id, user.email, user.role),
    jwtHelper.generateRefreshToken(user.id, user.email, user.role),
  ]);

  // Store refresh token in Redis
  await RedisUtils.setCache(
    AUTH_CACHE_KEY.REFRESH_TOKEN(user.id),
    refreshToken,
    AUTH_CACHE_TTL.REFRESH_TOKEN
  );

  return {
    message: 'Login successful',
    data: {
      user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      tokens: { accessToken, refreshToken },
    },
  };
};

// ── Verify OTP ─────────────────────────────────────────────────────────────────
const verifyOtp = async (payload: IVerifyOtpPayload) => {
  const { sessionId, code } = payload;
  const otpResponse = await OtpService.verifyOtpSession(sessionId, code);

  if (otpResponse.type === OtpType.EMAIL_VERIFICATION) {
    const user = await UserRepository.setUserEmailVerified(otpResponse.email);

    // Generate tokens after email verification
    const [accessToken, refreshToken] = await Promise.all([
      jwtHelper.generateAccessToken(user.id, user.email, user.role),
      jwtHelper.generateRefreshToken(user.id, user.email, user.role),
    ]);

    await RedisUtils.setCache(
      AUTH_CACHE_KEY.REFRESH_TOKEN(user.id),
      refreshToken,
      AUTH_CACHE_TTL.REFRESH_TOKEN
    );

    return {
      message: 'Email verified successfully',
      data: {
        user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
        tokens: { accessToken, refreshToken },
      },
    };
  }

  if (otpResponse.type === OtpType.RESET_PASSWORD) {
    const user = await UserRepository.getUserByEmail(otpResponse.email);
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

    const resetToken = jwtHelper.generateResetPasswordToken(user.id, user.email, user.role);

    return {
      message: 'OTP verified. You can now reset your password.',
      data: { resetToken },
    };
  }

  throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Unknown OTP type');
};

// ── Resend OTP ─────────────────────────────────────────────────────────────────
const resendOtp = async (payload: IResendOtpPayload) => {
  await OtpService.resendOtpSession(payload.sessionId);
  return { message: 'OTP resent successfully' };
};

// ── Forgot Password ────────────────────────────────────────────────────────────
const forgotPassword = async (payload: IForgotPasswordPayload) => {
  const user = await UserRepository.getUserByEmail(payload.email);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'No user found with this email');

  const sessionId = await OtpService.createOtpSession(user, OtpType.RESET_PASSWORD);

  return { message: 'Password reset OTP sent to your email.', data: { sessionId } };
};

// ── Reset Password ─────────────────────────────────────────────────────────────
const resetPassword = async (payload: IResetPasswordPayload) => {
  const { resetPasswordToken, password } = payload;
  const decoded = jwtHelper.verifyResetPasswordToken(resetPasswordToken);

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

  await database.user.update({ where: { id: decoded.userId }, data: { password: hashedPassword } });

  return { message: 'Password reset successful. You can now login.' };
};

// ── Refresh Token ──────────────────────────────────────────────────────────────
const refreshToken = async (payload: IRefreshTokenPayload) => {
  const decoded = jwtHelper.verifyRefreshToken(payload.refreshToken);

  const savedToken = await RedisUtils.getCache(AUTH_CACHE_KEY.REFRESH_TOKEN(decoded.userId));
  if (savedToken !== payload.refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }

  const user = await UserRepository.getUserById(decoded.userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const accessToken = jwtHelper.generateAccessToken(user.id, user.email, user.role);
  const newRefreshToken = jwtHelper.generateRefreshToken(user.id, user.email, user.role);

  return { message: 'Token refreshed', data: { accessToken, refreshToken: newRefreshToken } };
};

// ── Logout ─────────────────────────────────────────────────────────────────────
const logout = async (payload: ILogoutPayload, req?: Request) => {
  const decoded = jwtHelper.verifyRefreshToken(payload.refreshToken);
  await RedisUtils.deleteCache(AUTH_CACHE_KEY.REFRESH_TOKEN(decoded.userId));
  return { message: 'Logged out successfully' };
};

// ── Change Password ────────────────────────────────────────────────────────────
const changePassword = async (userId: string, payload: IChangePasswordPayload, req?: Request) => {
  const { oldPassword, newPassword } = payload;

  const user = await UserRepository.getUserById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Old password is incorrect');

  const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
  await database.user.update({ where: { id: userId }, data: { password: hashedPassword } });

  return { message: 'Password changed successfully' };
};

export const AuthService = {
  register,
  login,
  verifyOtp,
  forgotPassword,
  resendOtp,
  resetPassword,
  refreshToken,
  logout,
  changePassword,
};
