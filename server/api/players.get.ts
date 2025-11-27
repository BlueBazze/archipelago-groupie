/**
 * Get all players
 * GET /api/players
 */
defineRouteMeta({
  openAPI: {
    tags: ["players"],
    description: "Get all players",
    responses: {
      200: {
        description: "List of all players",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  username: { type: "string" },
                  role: { type: "string" },
                  createdAt: { type: "integer" }
                }
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
