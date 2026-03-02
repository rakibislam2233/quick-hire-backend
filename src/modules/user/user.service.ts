import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { database } from '../../config/database.config';
import ApiError from '../../utils/ApiError';
import { RedisUtils } from '../../utils/redis.utils';
import { uploadFile } from '../../utils/storage.utils';
import { USER_CACHE_KEY, USER_CACHE_TTL } from './user.cache';
import { IUpdateMyProfilePayload } from './user.interface';
import { UserRepository } from './user.repository';

// ── Get All Users (Admin) ──────────────────────────────────────────────────────
const getAllUsers = async (filters: any, options: any) => {
  return UserRepository.getAllUsersForAdmin(filters, options);
};

// ── Get User Profile with Role-based Data ───────────────────────────────────────
const getUserProfile = async (userId: string) => {
  const cacheKey = USER_CACHE_KEY.PROFILE(userId);
  const cachedUser = await RedisUtils.getCache<any>(cacheKey);

  if (cachedUser) {
    const { password, ...userWithoutPassword } = cachedUser;

    // If user is COMPANY role, include company details
    if (userWithoutPassword.role === 'COMPANY' && userWithoutPassword.companyId) {
      const company = await database.company.findUnique({
        where: { id: userWithoutPassword.companyId },
        select: {
          id: true,
          name: true,
          description: true,
          website: true,
          logo: true,
          location: true,
          industry: true,
          size: true,
          foundedYear: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return { ...userWithoutPassword, company };
    }

    return userWithoutPassword;
  }

  const user = await UserRepository.getUserById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  await RedisUtils.setCache(cacheKey, user, USER_CACHE_TTL.PROFILE);

  const { password, ...userWithoutPassword } = user;

  // If user is COMPANY role, include company details
  if (userWithoutPassword.role === 'COMPANY' && userWithoutPassword.companyId) {
    const company = await database.company.findUnique({
      where: { id: userWithoutPassword.companyId },
      select: {
        id: true,
        name: true,
        description: true,
        website: true,
        logo: true,
        location: true,
        industry: true,
        size: true,
        foundedYear: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { ...userWithoutPassword, company };
  }

  return userWithoutPassword;
};

// ── Get User by ID ─────────────────────────────────────────────────────────────
const getUserById = async (id: string) => {
  const cacheKey = USER_CACHE_KEY.PROFILE(id);
  const cachedUser = await RedisUtils.getCache<any>(cacheKey);

  if (cachedUser) {
    const { password, ...userWithoutPassword } = cachedUser;
    return userWithoutPassword;
  }

  const user = await UserRepository.getUserById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  await RedisUtils.setCache(cacheKey, user, USER_CACHE_TTL.PROFILE);

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// ── Update My Profile ──────────────────────────────────────────────────────────
const updateMyProfile = async (
  userId: string,
  payload: IUpdateMyProfilePayload,
  file?: Express.Multer.File,
  req?: Request
) => {
  const existingUser = await UserRepository.getUserById(userId);
  if (!existingUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  let profileImage: string | undefined;
  if (file) {
    const uploadResult = await uploadFile(
      file.buffer,
      'quick-hire/profile-images',
      `profile_${userId}_${Date.now()}`
    );
    profileImage = uploadResult.secure_url;
  }

  // Update user information
  const updatedUser = await UserRepository.updateUserById(userId, {
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    bio: payload.bio,
    ...(profileImage ? { profileImage } : {}),
  });

  // Update company information if user is COMPANY role and company data is provided
  if (existingUser.role === 'COMPANY' && payload.company && existingUser.companyId) {
    // Filter out undefined values
    const companyUpdateData = Object.fromEntries(
      Object.entries(payload.company).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(companyUpdateData).length > 0) {
      await database.company.update({
        where: { id: existingUser.companyId },
        data: companyUpdateData,
      });
    }
  }

  // Clear cache
  await RedisUtils.deleteCache(USER_CACHE_KEY.PROFILE(userId));

  return updatedUser;
};

// ── Update User by ID (Admin) ──────────────────────────────────────────────────
const updateUserById = async (id: string, data: Record<string, unknown>) => {
  const user = await UserRepository.getUserById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  const result = await UserRepository.updateUserById(id, data);
  await RedisUtils.deleteCache(USER_CACHE_KEY.PROFILE(id));
  return result;
};

// ── Delete My Profile ──────────────────────────────────────────────────────────
const deleteMyProfile = async (userId: string) => {
  const user = await UserRepository.getUserById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  const result = await UserRepository.deleteUserById(userId);
  await RedisUtils.deleteCache(USER_CACHE_KEY.PROFILE(userId));
  return result;
};

// ── Delete User by ID (Admin) ──────────────────────────────────────────────────
const deleteUserById = async (id: string) => {
  const user = await UserRepository.getUserById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  const result = await UserRepository.deleteUserById(id);
  await RedisUtils.deleteCache(USER_CACHE_KEY.PROFILE(id));
  return result;
};

export const UserService = {
  getAllUsers,
  getUserProfile,
  getUserById,
  updateMyProfile,
  updateUserById,
  deleteMyProfile,
  deleteUserById,
};
