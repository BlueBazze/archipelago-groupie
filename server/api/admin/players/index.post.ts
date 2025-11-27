/**
 * Create a new player (admin only)
 * POST /api/admin/players
 * Body: { username } - password will be auto-generated
 */
defineRouteMeta({
  openAPI: {
    tags: ["admin"],
    description: "Create a new player (Admin only) - password will be auto-generated",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["username"],
            properties: {
              username: { type: "string" }
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: "Player created successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean" },
                player: { type: "object" },
                generatedPassword: { type: "string" }
              }
            }
          }
        }
      },
      400: { description: "Invalid input" },
      409: { description: "Username already exists" }
    }
  }
});

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const body = await readBody(event);
  const { username } = body;

  // Validate input
  if (!username || typeof username !== "string" || username.trim() === "") {
    throw createError({
      statusCode: 400,
      message: "Username is required",
    });
  }

  const trimmedUsername = username.trim();

  // Check if username already exists
  const existingUser = await getUserByUsername(trimmedUsername);
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: "Username already exists",
    });
  }

  // Generate secure password
  const generatedPassword = generateSecurePassword();

  // Hash the password
  const hashedPassword = await hashPassword(generatedPassword);

  // Create the player
  const db = useDrizzle();
  const result = await db
    .insert(drizzleSchema.tables.players)
    .values({
      username: trimmedUsername,
      password: hashedPassword,
      role: "player",
    })
    .returning();

  const newPlayer = result[0];

  return {
    success: true,
    player: {
      id: newPlayer.id,
      username: newPlayer.username,
      role: newPlayer.role,
      createdAt: newPlayer.createdAt,
    },
    // Return plaintext password so admin can share it
    generatedPassword,
  };
});
