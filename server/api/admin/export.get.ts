/**
 * Export all player YAMLs as a ZIP file
 * GET /api/admin/export
 * Admin only
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  // Get all games with player information
  const games = await useDrizzle()
    .select({
      id: drizzleSchema.tables.games.id,
      name: drizzleSchema.tables.games.name,
      yamlContent: drizzleSchema.tables.games.yamlContent,
      yamlFilename: drizzleSchema.tables.games.yamlFilename,
      playerId: drizzleSchema.tables.games.playerId,
      playerUsername: drizzleSchema.tables.players.username,
    })
    .from(drizzleSchema.tables.games)
    .innerJoin(
      drizzleSchema.tables.players,
      eq(drizzleSchema.tables.games.playerId, drizzleSchema.tables.players.id)
    )
    .all();

  // Check if there are any games to export
  if (games.length === 0) {
    throw createError({
      statusCode: 404,
      message: "No games found to export",
    });
  }

  // Prepare files for ZIP
  const files = games.map((game) => {
    // Use original filename if available, otherwise create one
    const filename =
      game.yamlFilename || `${game.playerUsername}_${game.name}.yaml`;
    const content = game.yamlContent || "";

    return {
      filename,
      content,
    };
  });

  // Create ZIP
  const zipBuffer = await createYamlZip(files);

  // Set response headers for file download
  setHeader(event, "Content-Type", "application/zip");
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename="archipelago-yamls-${Date.now()}.zip"`
  );
  setHeader(event, "Content-Length", zipBuffer.length);

  return zipBuffer;
});
