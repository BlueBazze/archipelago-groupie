/**
 * Logout endpoint
 * POST /api/auth/logout
 */
export default defineEventHandler(async (event) => {
  return clearUserSession(event);
});
