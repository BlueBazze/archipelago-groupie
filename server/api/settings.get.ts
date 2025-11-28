/**
 * Get application settings
 * GET /api/admin/settings
 */
defineRouteMeta({
  openAPI: {
    tags: ["admin"],
    description: "Get application settings",
    responses: {
      200: {
        description: "Application settings",
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
    },
  },
});

export default defineEventHandler(async (event) => {
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
