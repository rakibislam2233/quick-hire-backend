import { UserRole } from '../../../prisma/generated/enums';

// ── Create User Account ────────────────────────────────────────────────────────
export interface ICreateAccountPayload {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role?: UserRole;
}

// ── User Filter Options ────────────────────────────────────────────────────────
export interface IUserFilterOptions {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  role?: string;
  isEmailVerified?: boolean;
  search?: string;
}

// ── Update My Profile ──────────────────────────────────────────────────────────
export interface IUpdateMyProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  profileImage?: string;
  bio?: string;
  company?: {
    name?: string;
    description?: string;
    website?: string;
    logo?: string;
    location?: string;
    industry?: string;
    contactEmail?: string;
    contactPhone?: string;
    founded?: string;
    employeeSize?: string;
  };
}
