/**
 * Update application settings
 * PATCH /api/admin/settings
 * Body: { allowPlayerSignup?: boolean }
 */
export default defineEventHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);

  // Check if settings exist
  const existingSettings = await db
    .select()
    .from(drizzleSchema.tables.settings)
    .limit(1);

  if (existingSettings.length === 0) {
    // Create initial settings
    await db.insert(drizzleSchema.tables.settings).values({
      allowPlayerSignup: body.allowPlayerSignup ?? false,
    });
  } else {
    // Update existing settings
    await db
      .update(drizzleSchema.tables.settings)
      .set({
        allowPlayerSignup: body.allowPlayerSignup,
        updatedAt: sql`(unixepoch())`,
      })
      .where(eq(drizzleSchema.tables.settings.id, existingSettings[0].id));
  }

  // Return updated settings
  const updatedSettings = await db
    .select()
    .from(drizzleSchema.tables.settings)
    .limit(1);

  return {
    success: true,
    allowPlayerSignup: updatedSettings[0].allowPlayerSignup,
  };
});
