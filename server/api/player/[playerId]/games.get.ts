/**
 * List a player's games/YAMLs
 * GET /api/player/:playerId/games
 * Accessible by authenticated users
 */
defineRouteMeta({
  openAPI: {
    tags: ["player"],
    description: "List a player's games/YAMLs",
    parameters: [
      {
        in: "path",
        name: "playerId",
        required: true,
        schema: { type: "integer" },
      },
    ],
    responses: {
      200: {
        description: "List of player's games",
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
      400: { description: "Invalid player ID" },
    },
  },
});

export default defineEventHandler(async (event) => {
  // Require authenticated user
  await requireAuth(event);

  const playerIdParam = getRouterParam(event, "playerId");

  if (!playerIdParam || isNaN(parseInt(playerIdParam))) {
    throw createError({
      statusCode: 400,
      message: "Invalid player ID",
    });
  }

  const playerId = parseInt(playerIdParam);

  const db = useDrizzle();

  // Get all games for the specified player
  const games = await db
    .select({
      id: drizzleSchema.tables.games.id,
      name: drizzleSchema.tables.games.name,
      yamlFilename: drizzleSchema.tables.games.yamlFilename,
      uploadedAt: drizzleSchema.tables.games.uploadedAt,
      createdAt: drizzleSchema.tables.games.createdAt,
    })
    .from(drizzleSchema.tables.games)
    .where(eq(drizzleSchema.tables.games.playerId, playerId))
    .all();

  return games;
});
