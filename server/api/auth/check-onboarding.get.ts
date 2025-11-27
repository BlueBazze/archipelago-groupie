/**
 * Check if onboarding is needed (no admin exists)
 * GET /api/auth/check-onboarding
 */
defineRouteMeta({
  openAPI: {
    tags: ["auth"],
    description: "Check if onboarding is needed (no admin exists)",
    responses: {
      200: {
        description: "Onboarding status",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                needsOnboarding: { type: "boolean" },
                adminExists: { type: "boolean" }
              }
            }
          }
        }
      }
    }
  }
});

export default defineEventHandler(async () => {
  const adminExists = await hasAdmin();

  return {
    needsOnboarding: !adminExists,
    adminExists,
  };
});
