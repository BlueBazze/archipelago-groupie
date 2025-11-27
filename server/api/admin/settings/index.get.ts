/**
 * Get application settings
 * GET /api/admin/settings
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const db = useDrizzle();
  const appSettings = await db
    .select()
    .from(drizzleSchema.tables.settings)
    .limit(1);

  // If no settings exist, return defaults
  if (appSettings.length === 0) {
    return {
      allowPlayerSignup: false,
    };
  }

  return {
    allowPlayerSignup: appSettings[0].allowPlayerSignup,
  };
});
