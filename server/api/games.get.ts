/**
 * Get all games (all player YAMLs) with player information
 * GET /api/games
 */
defineRouteMeta({
  openAPI: {
    tags: ["games"],
    description: "Get all games with player information",
    responses: {
      200: {
        description: "List of all games",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object"
              }
            }
          }
        }
      }
    }
  }
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  // Get all games with player information
  const gamesWithPlayers = await useDrizzle()
    .select({
      id: drizzleSchema.tables.games.id,
      name: drizzleSchema.tables.games.name,
      yamlFilename: drizzleSchema.tables.games.yamlFilename,
      uploadedAt: drizzleSchema.tables.games.uploadedAt,
      playerId: drizzleSchema.tables.games.playerId,
      playerUsername: drizzleSchema.tables.players.username,
    })
    .from(drizzleSchema.tables.games)
    .innerJoin(
      drizzleSchema.tables.players,
      eq(drizzleSchema.tables.games.playerId, drizzleSchema.tables.players.id)
    )
    .all();

  return gamesWithPlayers;
});
