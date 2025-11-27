/**
 * Update YAML content for current user's game
 * PATCH /api/my/games/:id
 * Body: { yamlContent?, yamlFilename?, name? }
 * Internally calls /api/games/:id
 */
defineRouteMeta({
  openAPI: {
    tags: ["my-games"],
    description: "Update YAML content for current user's game",
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
      200: { description: "Game updated successfully" }
    }
  }
});

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const gameId = getRouterParam(event, "id");
  const body = await readBody(event);

  // Call the games endpoint internally using event.$fetch
  return event.$fetch(`/api/games/${gameId}`, {
    method: "PATCH",
    body,
  });
});
