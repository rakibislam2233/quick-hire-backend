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

// ── Filter Options ─────────────────────────────────────────────────────────────
export interface IApplicationFilterOptions {
  userId?: string;
  jobId?: string;
  status?: ApplicationStatus;
}
