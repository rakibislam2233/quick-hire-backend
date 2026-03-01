// ── Simple auth status check ────────────────────────────────────────────────────
// For Quick Hire, the only gate is email verification.
// Companies and users can log in once email is verified.
export const getAuthStatus = (user: { isEmailVerified: boolean }) => {
  if (!user.isEmailVerified) {
    return {
      message: 'Email not verified. Please verify your email.',
      status: { isEmailVerified: false },
    };
  }

  return null; // All clear — proceed to login
};
