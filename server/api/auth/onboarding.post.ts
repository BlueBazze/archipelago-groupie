/**
 * Create the first admin account during onboarding
 * POST /api/auth/onboarding
 * Body: { username, password }
 */
export default defineEventHandler(async (event) => {
  // Check if admin already exists
  const adminExists = await hasAdmin();
  if (adminExists) {
    throw createError({
      statusCode: 400,
      message: "Admin already exists. Onboarding is not available.",
    });
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

  // Hash password and create admin
  const hashedPassword = await hashPassword(password);
  const db = useDrizzle();

  const newAdmin = await db
    .insert(drizzleSchema.tables.players)
    .values({
      username: username.trim(),
      password: hashedPassword,
      role: "admin",
    })
    .returning();

  // Log in the new admin
  await setUserSession(event, {
    user: {
      id: newAdmin[0].id,
      username: newAdmin[0].username,
      role: newAdmin[0].role,
    },
  });

  return {
    success: true,
    user: {
      id: newAdmin[0].id,
      username: newAdmin[0].username,
      role: newAdmin[0].role,
    },
  };
});
