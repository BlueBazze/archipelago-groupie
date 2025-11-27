/**
 * Get parsed YAML structure for form generation
 * GET /api/my/games/:id/schema
 * Internally calls /api/games/:id/schema
 */
export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const gameId = getRouterParam(event, "id");

  // Call the games endpoint internally using event.$fetch
  return event.$fetch(`/api/games/${gameId}/schema`);
});
