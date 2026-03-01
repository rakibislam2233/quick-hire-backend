import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import { uploadFile } from '../../utils/storage.utils';
import { IUpdateMyProfilePayload } from './user.interface';
import { UserRepository } from './user.repository';

// ── Get All Users (Admin) ──────────────────────────────────────────────────────
const getAllUsers = async (filters: any, options: any) => {
  return UserRepository.getAllUsersForAdmin(filters, options);
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

  const updated = await UserRepository.updateUserById(userId, {
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    bio: payload.bio,
    ...(profileImage ? { profileImage } : {}),
  });

  await RedisUtils.deleteCache(USER_CACHE_KEY.PROFILE(userId));

  return updated;
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
  getUserById,
  updateMyProfile,
  updateUserById,
  deleteMyProfile,
  deleteUserById,
};
