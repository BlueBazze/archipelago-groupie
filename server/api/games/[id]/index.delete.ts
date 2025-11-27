
/**
 * Delete a specific game/YAML
 * DELETE /api/games/:id
 * Accessible by admin or the owner of the game
 */
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

  // Delete game
  await db
    .delete(drizzleSchema.tables.games)
    .where(eq(drizzleSchema.tables.games.id, gameId));

  return {
    success: true,
    message: "Game deleted successfully",
  };
});
