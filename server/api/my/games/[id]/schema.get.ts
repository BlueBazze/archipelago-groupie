/**
 * Get parsed YAML structure for form generation
 * GET /api/my/games/:id/schema
 * Internally calls /api/games/:id/schema
 */
defineRouteMeta({
  openAPI: {
    tags: ["my-games"],
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
      }
    }
  }
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const gameId = getRouterParam(event, "id");

  // Call the games endpoint internally using event.$fetch
  return event.$fetch(`/api/games/${gameId}/schema`);
});
