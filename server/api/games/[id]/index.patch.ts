
/**
 * Update YAML content
 * PATCH /api/games/:id
 * Body: { yamlContent?, yamlFilename?, name? }
 * Accessible by admin or the owner of the game
 */
defineRouteMeta({
  openAPI: {
    tags: ["games"],
    description: "Update YAML content, filename, or name",
    parameters: [
      { in: "path", name: "id", required: true, schema: { type: "integer" } }
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              yamlContent: { type: "string" },
              yamlFilename: { type: "string" },
              name: { type: "string" }
            }
          }
        }
      }
    },
    responses: {
      200: { description: "Game updated successfully" },
      400: { description: "Invalid input" },
      404: { description: "Game not found" }
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

  const body = await readBody(event);
  const { yamlContent, yamlFilename, name } = body;

  const db = useDrizzle();

  // Check if game exists
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

  // Prepare update values
  const updateValues: any = {
    updatedAt: sql`(unixepoch())`,
  };

  if (yamlContent !== undefined) {
    // Validate YAML format
    try {
      parseYAML(yamlContent);
    } catch (error) {
      throw createError({
        statusCode: 400,
        message: "Invalid YAML format",
      });
    }
    updateValues.yamlContent = yamlContent;
    updateValues.uploadedAt = sql`(unixepoch())`;
  }

  if (yamlFilename !== undefined) {
    updateValues.yamlFilename = yamlFilename;
  }

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "Game name cannot be empty",
      });
    }
    updateValues.name = name.trim();
  }

  // Update the game
  const result = await db
    .update(drizzleSchema.tables.games)
    .set(updateValues)
    .where(eq(drizzleSchema.tables.games.id, gameId))
    .returning();

  const updatedGame = result[0];

  return {
    success: true,
    game: {
      id: updatedGame.id,
      name: updatedGame.name,
      yamlFilename: updatedGame.yamlFilename,
      uploadedAt: updatedGame.uploadedAt,
      updatedAt: updatedGame.updatedAt,
    },
  };
});
