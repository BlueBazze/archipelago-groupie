/**
 * List current user's games/YAMLs
 * GET /api/my/games
 */
defineRouteMeta({
  openAPI: {
    tags: ["my-games"],
    description: "List current user's games/YAMLs",
    responses: {
      200: {
        description: "List of games",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
              },
            },
          },
        },
      },
    },
  },
});

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const playerId = (user as any).id;

  // Call the player endpoint internally using event.$fetch
  return event.$fetch(`/api/player/${playerId}/games`);
});
