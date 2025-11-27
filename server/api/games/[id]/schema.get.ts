
/**
 * Get parsed YAML structure for form generation
 * GET /api/games/:id/schema
 * Accessible by admin or the owner of the game
 */
defineRouteMeta({
  openAPI: {
    tags: ["games"],
    description: "Get parsed YAML structure for form generation",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "integer" } }
    ],
    responses: {
      200: {
        description: "Parsed YAML schema",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                gameId: { type: "integer" },
                gameName: { type: "string" },
                schema: { type: "object" }
              }
            }
          }
        }
      },
      400: { description: "Invalid game ID" },
      404: { description: "Game or YAML content not found" },
      500: { description: "Failed to parse YAML content" }
    }
  }
});

export default defineEventHandler(async (event) => {
  const gameIdParam = getRouterParam(event, "id");

  if (!gameIdParam || isNaN(parseInt(gameIdParam))) {
    throw createError({
      statusCode: 400,
      message: "Invalid game ID",
    });
  }

  const gameId = parseInt(gameIdParam);

  const db = useDrizzle();

  // Get the game
  const game = await db
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

  // Require admin or current user (owner of the game)
  await requireAdminOrCurrentUser(event, game.playerId);

  if (!game.yamlContent) {
    throw createError({
      statusCode: 404,
      message: "No YAML content found for this game",
    });
  }

  // Parse YAML
  let parsedYaml;
  try {
    parsedYaml = parseYAML(game.yamlContent);
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to parse YAML content",
    });
  }

  // Return the parsed structure
  // The frontend can use this to generate a dynamic form
  return {
    gameId: game.id,
    gameName: game.name,
    schema: parsedYaml,
  };
});
