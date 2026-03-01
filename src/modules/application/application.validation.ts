import { z } from 'zod';

// ── Apply to a Job ────────────────────────────────────────────────────────────
const applyJob = z.object({
  body: z.object({
    coverLetter: z.string().optional(),
    resumeUrl: z.string().url('Invalid resume URL').optional(),
  }),
});

// ── Update Application Status (Company) ──────────────────────────────────────
const updateApplicationStatus = z.object({
  body: z.object({
    status: z.enum(['REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'], {
      error: 'Invalid application status',
    }),
  }),
});

export const ApplicationValidation = {
  applyJob,
  updateApplicationStatus,
};
