import { z } from 'zod';

// ── Apply to a Job ────────────────────────────────────────────────────────────
const applyJob = z.object({
  body: z.object({
    coverLetter: z.string().optional(),
    resumeUrl: z.string().url('Invalid resume URL').optional(),
  }),
});

const updateApplicationStatus = z.object({
  body: z.object({
    status: z.enum(['REVIEWING', 'SHORTLISTED', 'SCHEDULED', 'ACCEPTED', 'REJECTED'], {
      error: 'Invalid application status',
    }),
  }),
});

// ── Schedule Interview (Company) ──────────────────────────────────────────────
const scheduleInterview = z.object({
  body: z.object({
    interviewDate: z.string().datetime({ message: 'Invalid interview date-time format' }),
    interviewLink: z.string().url('Invalid interview link').optional(),
  }),
});

export const ApplicationValidation = {
  applyJob,
  updateApplicationStatus,
  scheduleInterview,
};
