/**
 * Upload new YAML file for a player
 * POST /api/player/:playerId/games
 * Body: { name, yamlContent, yamlFilename }
 * Accessible by admin or the player themselves
 */
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

  const { name, yamlContent, yamlFilename } = await readBody(event);

  // Validate input
  if (!name || typeof name !== "string" || name.trim() === "") {
    throw createError({
      statusCode: 400,
      message: "Game name is required",
    });
  }

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

  // Create the game
  const result = await useDrizzle()
    .insert(drizzleSchema.tables.games)
    .values({
      playerId: playerId,
      name: name.trim(),
      yamlContent: yamlContent,
      yamlFilename: yamlFilename || `${name.trim()}.yaml`,
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
