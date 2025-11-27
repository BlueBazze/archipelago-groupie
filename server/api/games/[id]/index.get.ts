/**
 * Get a specific game/YAML
 * GET /api/games/:id
 * Accessible by authenticated users
 */
defineRouteMeta({
  openAPI: {
    tags: ["games"],
    description: "Get a specific game/YAML by ID",
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
      },
      400: { description: "Invalid game ID" },
      404: { description: "Game not found" }
    }
  }
});

export default defineEventHandler(async (event) => {
  // Require authenticated user
  await requireAuth(event);

  const gameIdParam = getRouterParam(event, "id");

  if (!gameIdParam || isNaN(parseInt(gameIdParam))) {
    throw createError({
      statusCode: 400,
      message: "Invalid game ID",
    });
  }

  const gameId = parseInt(gameIdParam);

  // Get the game
  const game = await useDrizzle()
    .select()
    .from(drizzleSchema.tables.games)
    .where(eq(drizzleSchema.tables.games.id, gameId))
    .get();

  if (!game) {
    throw createError({
      statusCode: 404,
      message: "Game not found",
    });
  }

  return game;
});
