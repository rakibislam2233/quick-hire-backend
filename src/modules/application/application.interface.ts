import { ApplicationStatus } from '../../../prisma/generated/enums';

// ── Apply to Job ───────────────────────────────────────────────────────────────
export interface IApplyJobPayload {
  coverLetter?: string;
  resumeUrl?: string;
}

// ── Update Application Status ──────────────────────────────────────────────────
export interface IUpdateApplicationStatusPayload {
  status: ApplicationStatus;
}

// ── Schedule Interview ──────────────────────────────────────────────────────────
export interface IScheduleInterviewPayload {
  interviewDate: string;
  interviewLink?: string;
}

// ── Filter Options ─────────────────────────────────────────────────────────────
export interface IApplicationFilterOptions {
  userId?: string;
  jobId?: string;
  status?: ApplicationStatus;
}

// ── Application Response Interfaces ───────────────────────────────────────────────
export interface IApplicationJob {
  id: string;
  title: string;
  company?: IApplicationJobCompany;
}

export interface IApplicationJobCompany {
  id: string;
  name: string;
  logo?: string;
}

export interface IApplicationUser {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

export interface IApplication {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  interviewDate?: Date;
  interviewLink?: string;
  jobId: string;
  userId: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  job?: IApplicationJob;
  user?: IApplicationUser;
}

export interface IApplicationWithJob extends IApplication {
  job: IApplicationJob;
}

export interface IApplicationWithUser extends IApplication {
  user: IApplicationUser;
}

export interface IInterview {
  id: string;
  status: ApplicationStatus;
  interviewDate?: Date;
  interviewLink?: string;
  job: {
    title: string;
    company: {
      name: string;
      logo?: string;
    };
  };
  user?: {
    fullName: string;
    email: string;
    profileImage?: string;
  };
}
