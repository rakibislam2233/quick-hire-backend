import { database } from '../../config/database.config';
import { sendWelcomeEmail } from '../../utils/emailTemplates';
import {
  createPaginationQuery,
  createPaginationResult,
  PaginationResult,
  parsePaginationOptions,
} from '../../utils/pagination.utils';
import { ICreateAccountPayload } from './user.interface';

// ── Create User Account ────────────────────────────────────────────────────────
const createAccount = async (payload: ICreateAccountPayload) => {
  return database.user.create({
    data: {
      fullName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      password: payload.password,
      role: payload.role,
    },
  });
};

// ── Get User by ID ─────────────────────────────────────────────────────────────
const getUserById = async (id: string) => {
  return database.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      profileImage: true,
      bio: true,
      password: true,
      isEmailVerified: true,
      status: true,
      role: true,
      companyId: true,
      isDeleted: true,
      createdAt: true,
    },
  });
};

// ── Get User by Email ──────────────────────────────────────────────────────────
const getUserByEmail = async (email: string) => {
  return database.user.findFirst({ where: { email, isDeleted: false } });
};

// ── Update User by ID ──────────────────────────────────────────────────────────
const updateUserById = async (id: string, data: Record<string, unknown>) => {
  return database.user.update({ where: { id }, data });
};

// ── Get All Users (Admin) ──────────────────────────────────────────────────────
const getAllUsersForAdmin = async (filters: any, options: any): Promise<PaginationResult<any>> => {
  const pagination = parsePaginationOptions(options);
  const { skip, take, orderBy } = createPaginationQuery(pagination);

  const where: any = { isDeleted: false, role: { not: 'ADMIN' } };

  if (filters.fullName) where.fullName = { contains: filters.fullName, mode: 'insensitive' };
  if (filters.email) where.email = { contains: filters.email, mode: 'insensitive' };
  if (filters.phoneNumber)
    where.phoneNumber = { contains: filters.phoneNumber, mode: 'insensitive' };
  if (filters.status) where.status = filters.status;
  if (filters.role) where.role = filters.role;
  if (filters.isEmailVerified !== undefined) {
    where.isEmailVerified = filters.isEmailVerified === 'true' || filters.isEmailVerified === true;
  }
  if (filters.search) {
    where.OR = [
      { fullName: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { phoneNumber: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    database.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        isEmailVerified: true,
        status: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
      skip,
      take,
      orderBy,
    }),
    database.user.count({ where }),
  ]);

  return createPaginationResult(users, total, pagination);
};

// ── Delete User (Soft Delete) ──────────────────────────────────────────────────
const deleteUserById = async (id: string) => {
  return database.user.update({
    where: { id },
    data: { isDeleted: true, status: 'DELETED' },
  });
};

// ── Email Helpers ──────────────────────────────────────────────────────────────
const isEmailExists = async (email: string) => {
  const user = await database.user.findUnique({ where: { email }, select: { id: true } });
  return !!user;
};

const setUserEmailVerified = async (email: string) => {
  const user = await database.user.update({ where: { email }, data: { isEmailVerified: true } });

  // Send welcome email after verification
  if (user) {
    await sendWelcomeEmail(user.email, user.fullName);
  }

  return user;
};

export const UserRepository = {
  createAccount,
  getUserByEmail,
  isEmailExists,
  getUserById,
  setUserEmailVerified,
  updateUserById,
  getAllUsersForAdmin,
  deleteUserById,
};
