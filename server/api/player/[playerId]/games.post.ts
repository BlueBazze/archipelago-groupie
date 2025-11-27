/**
 * Upload new YAML file for a player
 * POST /api/player/:playerId/games
 * Body: { name, yamlContent, yamlFilename }
 * Accessible by admin or the player themselves
 */
defineRouteMeta({
  openAPI: {
    tags: ["player"],
    description: "Upload new YAML file for a player",
    parameters: [
      {
        in: "path",
        name: "playerId",
        required: true,
        schema: { type: "integer" },
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "yamlContent"],
            properties: {
              yamlContent: { type: "string" },
            },
          },
        },
      },
    },
    responses: {
      200: { description: "YAML file uploaded successfully" },
      400: { description: "Invalid input" },
    },
  },
});

export default defineEventHandler(async (event) => {
  const playerIdParam = getRouterParam(event, "playerId");

  if (!playerIdParam || isNaN(parseInt(playerIdParam))) {
    throw createError({
      statusCode: 400,
      message: "Invalid player ID",
    });
  }

  const playerId = parseInt(playerIdParam);

  // Require admin or current user
  await requireAdminOrCurrentUser(event, playerId);

  const { yamlContent } = await readBody(event);

  // Validate input
  if (
    !yamlContent ||
    typeof yamlContent !== "string" ||
    yamlContent.trim() === ""
  ) {
    throw createError({
      statusCode: 400,
      message: "YAML content is required",
    });
  }

  // Validate YAML format
  try {
    parseYAML(yamlContent);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: "Invalid YAML format",
    });
  }

  const parsedYaml = parseYAML<any>(yamlContent);
  const gameName = parsedYaml.game;
  const yamlFilename = `${playerId}_${gameName}.yaml`;

  // Create the game
  const result = await useDrizzle()
    .insert(drizzleSchema.tables.games)
    .values({
      playerId: playerId,
      name: gameName,
      yamlContent: yamlContent,
      yamlFilename: yamlFilename || `${gameName.trim()}.yaml`,
      uploadedAt: sql`(unixepoch())`,
    })
    .returning();

  const newGame = result[0];

  return {
    success: true,
    game: {
      id: newGame.id,
      name: newGame.name,
      yamlFilename: newGame.yamlFilename,
      uploadedAt: newGame.uploadedAt,
      createdAt: newGame.createdAt,
    },
  };
});
