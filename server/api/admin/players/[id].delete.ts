/**
 * Delete a player (admin only)
 * DELETE /api/admin/players/:id
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const playerId = getRouterParam(event, "id");

  if (!playerId || isNaN(parseInt(playerId))) {
    throw createError({
      statusCode: 400,
      message: "Invalid player ID",
    });
  }

  const playerIdInt = parseInt(playerId);

  const db = useDrizzle();

  // Check if player exists
  const player = await db
    .select()
    .from(drizzleSchema.tables.players)
    .where(eq(drizzleSchema.tables.players.id, playerIdInt))
    .get();

  if (!player) {
    throw createError({
      statusCode: 404,
      message: "Player not found",
    });
  }

  // Prevent admin from deleting themselves
  const currentUser = await getCurrentUser(event);
  if (currentUser && (currentUser as any).id === playerIdInt) {
    throw createError({
      statusCode: 400,
      message: "Cannot delete your own account",
    });
  }

  // Delete player (cascade will handle related games)
  await db
    .delete(drizzleSchema.tables.players)
    .where(eq(drizzleSchema.tables.players.id, playerIdInt));

  return {
    success: true,
    message: "Player deleted successfully",
  };
});
