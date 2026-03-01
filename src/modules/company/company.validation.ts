import { z } from 'zod';

// ── Create Company ────────────────────────────────────────────────────────────
const createCompany = z.object({
  body: z.object({
    name: z.string({ error: 'Company name is required' }).min(1, 'Company name is required'),
    description: z.string().optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    logo: z.string().optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    contactEmail: z.string().email('Invalid contact email').optional().or(z.literal('')),
    contactPhone: z.string().optional(),
  }),
});

// ── Update Company ────────────────────────────────────────────────────────────
const updateCompany = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    logo: z.string().optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    contactEmail: z.string().email('Invalid contact email').optional().or(z.literal('')),
    contactPhone: z.string().optional(),
  }),
});

export const CompanyValidation = {
  createCompany,
  updateCompany,
};
