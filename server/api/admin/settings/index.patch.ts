/**
 * Update application settings
 * PATCH /api/admin/settings
 * Body: { allowPlayerSignup?: boolean }
 */
defineRouteMeta({
  openAPI: {
    tags: ["admin"],
    description: "Update application settings (Admin only)",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              allowPlayerSignup: { type: "boolean" },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Settings updated successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean" },
                allowPlayerSignup: { type: "boolean" },
              },
            },
          },
        },
      },
    },
  },
});

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
