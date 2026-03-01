import { z } from 'zod';

// ── Update My Profile ────────────────────────────────────────────────────────
const updateMyProfile = z.object({
  body: z.object({
    fullName: z.string({ error: 'Full name must be a string' }).optional(),
    phoneNumber: z.string({ error: 'Phone number must be a string' }).optional(),
    bio: z.string({ error: 'Bio must be a string' }).optional(),
    profileImage: z.string({ error: 'Profile image must be a string' }).optional(),
    // Optional company information (for COMPANY role)
    company: z
      .object({
        name: z.string({ error: 'Company name must be a string' }).optional(),
        description: z.string({ error: 'Company description must be a string' }).optional(),
        website: z.string({ error: 'Company website must be a string' }).optional(),
        logo: z.string({ error: 'Company logo must be a string' }).optional(),
        location: z.string({ error: 'Company location must be a string' }).optional(),
        industry: z.string({ error: 'Company industry must be a string' }).optional(),
        contactEmail: z.string({ error: 'Company contact email must be a string' }).optional(),
        contactPhone: z.string({ error: 'Company contact phone must be a string' }).optional(),
        founded: z.string({ error: 'Company founded date must be a string' }).optional(),
        employeeSize: z.string({ error: 'Company employee size must be a string' }).optional(),
      })
      .optional(),
  }),
});

export const UserValidations = {
  updateMyProfile,
};
