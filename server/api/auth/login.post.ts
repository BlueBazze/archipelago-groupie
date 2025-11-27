/**
 * Login endpoint for both admin and players
 * POST /api/auth/login
 * Body: { username, password }
 */
defineRouteMeta({
  openAPI: {
    tags: ["auth"],
    description: "Login endpoint for both admin and players",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["username", "password"],
            properties: {
              username: { type: "string" },
              password: { type: "string" }
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    username: { type: "string" },
                    role: { type: "string" }
                  }
                }
              }
            }
          }
        }
      },
      400: { description: "Username and password are required" },
      401: { description: "Invalid username or password" }
    }
  }
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  // Validate input
  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Username and password are required",
    });
  }

  // Find user
  const user = await getUserByUsername(username.trim());
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Invalid username or password",
    });
  }

  // Verify password
  const isValid = await verifyPassword(user.password, password);
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: "Invalid username or password",
    });
  }

  // Set session
  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
});
