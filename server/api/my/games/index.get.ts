/**
 * List current user's games/YAMLs
 * GET /api/my/games
 * Internally calls /api/player/:playerId/games
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const playerId = (user as any).id;

  // Call the player endpoint internally using event.$fetch
  return event.$fetch(`/api/player/${playerId}/games`);
});
