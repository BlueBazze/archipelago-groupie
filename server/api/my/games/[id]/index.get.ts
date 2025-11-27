/**
 * Get a specific game/YAML for current user
 * GET /api/my/games/:id
 * Internally calls /api/games/:id
 */
export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const gameId = getRouterParam(event, "id");

  // Call the games endpoint internally using event.$fetch
  return event.$fetch(`/api/games/${gameId}`);
});
