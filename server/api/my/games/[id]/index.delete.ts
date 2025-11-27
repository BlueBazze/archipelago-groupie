/**
 * Delete current user's game/YAML
 * DELETE /api/my/games/:id
 * Internally calls /api/games/:id
 */
defineRouteMeta({
  openAPI: {
    tags: ["my-games"],
    description: "Delete current user's game/YAML",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "integer" } }
    ],
    responses: {
      200: { description: "Game deleted successfully" }
    }
  }
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const gameId = getRouterParam(event, "id");

  // Call the games endpoint internally using event.$fetch
  return event.$fetch(`/api/games/${gameId}`, {
    method: "DELETE",
  });
});
