/**
 * Get all players
 * GET /api/players
 */
export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const db = useDrizzle();

  // Get all players
  const players = await db
    .select({
      id: drizzleSchema.tables.players.id,
      username: drizzleSchema.tables.players.username,
      role: drizzleSchema.tables.players.role,
      createdAt: drizzleSchema.tables.players.createdAt,
    })
    .from(drizzleSchema.tables.players)
    .all();

  return players;
});
