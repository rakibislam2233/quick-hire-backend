import { z } from 'zod';

// ── Post a Job ────────────────────────────────────────────────────────────────
const createJob = z.object({
  body: z.object({
    title: z.string({ error: 'Job title is required' }).min(1, 'Title is required'),
    description: z.string({ error: 'Description is required' }).min(1, 'Description is required'),
    requirements: z
      .string({ error: 'Requirements are required' })
      .min(1, 'Requirements are required'),
    responsibilities: z
      .string({ error: 'Responsibilities are required' })
      .min(1, 'Responsibilities are required'),
    salaryRange: z.string({ error: 'Salary range is required' }).min(1, 'Salary range is required'),
    location: z.string({ error: 'Location is required' }).min(1, 'Location is required'),
    deadline: z
      .string({ error: 'Application deadline is required' })
      .min(1, 'Deadline is required'),
    type: z
      .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'])
      .default('FULL_TIME'),
    categoryId: z.string({ error: 'Category ID is required' }).min(1, 'Category ID is required'),
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
    categoryId: z.string().optional(),
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
