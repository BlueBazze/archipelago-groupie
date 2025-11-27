/**
 * Logout endpoint
 * POST /api/auth/logout
 */
defineRouteMeta({
  openAPI: {
    tags: ["auth"],
    description: "Logout endpoint",
    responses: {
      200: { description: "Logout successful" }
    }
  }
});

export default defineEventHandler(async (event) => {
  return clearUserSession(event);
});
