/**
 * Get a specific game/YAML for current user
 * GET /api/my/games/:id
 * Internally calls /api/games/:id
 */
defineRouteMeta({
  openAPI: {
    tags: ["my-games"],
    description: "Get a specific game/YAML for current user",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "integer" } }
    ],
    responses: {
      200: {
        description: "Game details",
        content: {
          "application/json": {
            schema: {
              type: "object"
            }
          }
        }
      }
    }
  }
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const gameId = getRouterParam(event, "id");

  // Call the games endpoint internally using event.$fetch
  return event.$fetch(`/api/games/${gameId}`);
});
