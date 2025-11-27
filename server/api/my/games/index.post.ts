/**
 * Upload new YAML file for current user
 * POST /api/my/games
 * Body: { name, yamlContent, yamlFilename }
 * Internally calls /api/player/:playerId/games
 */
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const playerId = (user as any).id;

  const body = await readBody(event);

  // Call the player endpoint internally using event.$fetch
  return event.$fetch(`/api/player/${playerId}/games`, {
    method: "POST",
    body,
  });
});
