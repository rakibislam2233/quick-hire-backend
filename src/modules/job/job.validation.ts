import { z } from 'zod';

// ── Post a Job ────────────────────────────────────────────────────────────────
const createJob = z.object({
  body: z.object({
    title: z.string({ error: 'Job title is required' }).min(1, 'Title is required'),
    description: z.string({ error: 'Description is required' }).min(1, 'Description is required'),
    requirements: z.string().optional(),
    responsibilities: z.string().optional(),
    salaryRange: z.string().optional(),
    location: z.string().optional(),
    type: z
      .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'])
      .default('FULL_TIME'),
    companyId: z.string({ error: 'Company ID is required' }).min(1, 'Company ID is required'),
  }),
});

// ── Update Job ────────────────────────────────────────────────────────────────
const updateJob = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    requirements: z.string().optional(),
    responsibilities: z.string().optional(),
    salaryRange: z.string().optional(),
    location: z.string().optional(),
    type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']).optional(),
  }),
});

// ── Change Job Status (Admin) ─────────────────────────────────────────────────
const updateJobStatus = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'CLOSED'], {
      error: 'Status must be APPROVED, REJECTED, or CLOSED',
    }),
  }),
});

export const JobValidation = {
  createJob,
  updateJob,
  updateJobStatus,
};
