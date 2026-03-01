import { JobStatus } from '../../../prisma/generated/enums';

// ── Create Job ─────────────────────────────────────────────────────────────────
export interface ICreateJobPayload {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salaryRange?: string;
  location?: string;
  type?: string;
  categoryId: string;
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
  type?: string;
  categoryId?: string;
  tags?: string[];
}

// ── Filter Options (Public) ────────────────────────────────────────────────────
export interface IJobFilterOptions {
  search?: string;
  type?: string;
  location?: string;
  categoryId?: string;
}

// ── Admin Filter Options ───────────────────────────────────────────────────────
export interface IJobAdminFilterOptions {
  search?: string;
  status?: JobStatus;
}
