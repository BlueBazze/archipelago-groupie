/**
 * Check if onboarding is needed (no admin exists)
 * GET /api/auth/check-onboarding
 */
export default defineEventHandler(async () => {
  const adminExists = await hasAdmin();

  return {
    needsOnboarding: !adminExists,
    adminExists,
  };
});
