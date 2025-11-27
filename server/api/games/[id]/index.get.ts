/**
 * Get a specific game/YAML
 * GET /api/games/:id
 * Accessible by authenticated users
 */
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
