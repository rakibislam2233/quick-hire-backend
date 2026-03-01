import { Request, Response } from 'express';
import httpStatus, { StatusCodes } from 'http-status-codes';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick.utils';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

// ── Get All Users (Admin) ──────────────────────────────────────────────────────
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'fullName',
    'email',
    'phoneNumber',
    'status',
    'role',
    'isEmailVerified',
    'search',
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const users = await UserService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    meta: users.pagination,
    data: users.data,
  });
});

// ── Get User By ID (Admin) ─────────────────────────────────────────────────────
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await UserService.getUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: user,
  });
});

// ── Get My Profile ─────────────────────────────────────────────────────────────
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');

  const userProfile = await UserService.getUserProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile fetched successfully',
    data: userProfile,
  });
});

// ── Update My Profile ──────────────────────────────────────────────────────────
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');

  const result = await UserService.updateMyProfile(userId, req.body, req.file, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

// ── Update User (Admin) ────────────────────────────────────────────────────────
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await UserService.updateUserById(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

// ── Delete User (Admin) ────────────────────────────────────────────────────────
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await UserService.deleteUserById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
  });
});

// ── Delete My Profile ──────────────────────────────────────────────────────────
const deleteMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, 'User not authenticated');

  await UserService.deleteMyProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile deleted successfully',
  });
});

export const UserController = {
  getAllUsers,
  getUserById,
  getUserProfile,
  updateMyProfile,
  updateUser,
  deleteUser,
  deleteMyProfile,
};
