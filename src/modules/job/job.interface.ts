import { JobStatus, JobType } from '../../../prisma/generated/enums';

// ── Create Job ─────────────────────────────────────────────────────────────────
export interface ICreateJobPayload {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salaryRange?: string;
  location?: string;
  type?: JobType;
  companyId: string;
}

// ── Update Job ─────────────────────────────────────────────────────────────────
export interface IUpdateJobPayload {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  salaryRange?: string;
  location?: string;
  type?: JobType;
}

// ── Filter Options (Public) ────────────────────────────────────────────────────
export interface IJobFilterOptions {
  search?: string;
  type?: JobType;
  location?: string;
}

// ── Admin Filter Options ───────────────────────────────────────────────────────
export interface IJobAdminFilterOptions {
  search?: string;
  status?: JobStatus;
}
