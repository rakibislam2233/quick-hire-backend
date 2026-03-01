import { z } from 'zod';

// ── Update My Profile ────────────────────────────────────────────────────────
const updateMyProfile = z.object({
  body: z.object({
    fullName: z.string({ error: 'Full name must be a string' }).optional(),
    phoneNumber: z.string({ error: 'Phone number must be a string' }).optional(),
    bio: z.string({ error: 'Bio must be a string' }).optional(),
    profileImage: z.string({ error: 'Profile image must be a string' }).optional(),
  }),
});

export const UserValidations = {
  updateMyProfile,
};
