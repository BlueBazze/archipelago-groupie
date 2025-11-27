/**
 * Update YAML content for current user's game
 * PATCH /api/my/games/:id
 * Body: { yamlContent?, yamlFilename?, name? }
 * Internally calls /api/games/:id
 */
export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const gameId = getRouterParam(event, "id");
  const body = await readBody(event);

  // Call the games endpoint internally using event.$fetch
  return event.$fetch(`/api/games/${gameId}`, {
    method: "PATCH",
    body,
  });
});
