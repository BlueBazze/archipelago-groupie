import { count } from "drizzle-orm";

/**
 * Player self-signup endpoint (only works if globally enabled by admin)
 * POST /api/auth/signup
 * Body: { username, password }
 */
export default defineEventHandler(async (event) => {
  const db = useDrizzle();

  // If there are no players in the database, then this is the first user during onboarding
  // And we want to allow them to sign up, and automatically assign them the admin role
  const playerCount = await db
    .select({ count: count() })
    .from(drizzleSchema.tables.players);

  if (playerCount[0].count > 0) {
    // Check if player signup is enabled
    const appSettings = await db
      .select()
      .from(drizzleSchema.tables.settings)
      .limit(1);
    const allowPlayerSignup = appSettings[0]?.allowPlayerSignup ?? false;

    if (!allowPlayerSignup) {
      throw createError({
        statusCode: 403,
        message:
          "Player self-signup is currently disabled. Please contact the admin.",
      });
    }
  }

  const body = await readBody(event);
  const { username, password } = body;

  // Validate input
  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Username and password are required",
    });
  }

  if (username.length < 3) {
    throw createError({
      statusCode: 400,
      message: "Username must be at least 3 characters long",
    });
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      message: "Password must be at least 8 characters long",
    });
  }

  // Check if username already exists
  const existingUser = await getUserByUsername(username.trim());
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: "Username already taken",
    });
  }

  // Hash password and create player
  const hashedPassword = await hashPassword(password);

  const newPlayer = await db
    .insert(drizzleSchema.tables.players)
    .values({
      username: username.trim(),
      password: hashedPassword,
      role: playerCount[0].count > 0 ? "player" : "admin",
    })
    .returning();

  // Log in the new player
  await setUserSession(event, {
    user: {
      id: newPlayer[0].id,
      username: newPlayer[0].username,
      role: newPlayer[0].role,
    },
  });

  return {
    success: true,
    user: {
      id: newPlayer[0].id,
      username: newPlayer[0].username,
      role: newPlayer[0].role,
    },
  };
});
