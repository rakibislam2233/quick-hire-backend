import { UserRole } from '../../../prisma/generated/enums';

// ── For Self-Registration (User/Company sign up) ───────────────────────────────
export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: UserRole;
  companyName?: string;
  companyLocation?: string;
  companyIndustry?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
  fcmToken?: string;
  webPushToken?: string;
}

export interface IVerifyOtpPayload {
  sessionId: string;
  code: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResendOtpPayload {
  sessionId: string;
}

export interface IResetPasswordPayload {
  resetPasswordToken: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
}

export interface ILogoutPayload {
  refreshToken: string;
}
