import { eq } from "drizzle-orm";
import type { H3Event } from "h3";

/**
 * Check if an admin user exists in the database
 * Used to determine if onboarding is needed
 */
export async function hasAdmin(): Promise<boolean> {
  const db = useDrizzle();
  const adminUsers = await db
    .select()
    .from(drizzleSchema.tables.players)
    .where(eq(drizzleSchema.tables.players.role, "admin"))
    .limit(1);

  return adminUsers.length > 0;
}

/**
 * Get the current user from session
 */
export async function getCurrentUser(event: H3Event) {
  const session = await getUserSession(event);
  return session.user || null;
}

/**
 * Require authentication - throws error if not logged in
 */
export async function requireAuth(event: H3Event) {
  const user = await getCurrentUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized - Please log in",
    });
  }
  return user;
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event);
  if ((user as any).role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden - Admin access required",
    });
  }
  return user;
}

/**
 * Require player role (or admin) - throws error if not authenticated
 */
export async function requirePlayer(event: H3Event) {
  const user = await requireAuth(event);
  if ((user as any).role !== "player" && (user as any).role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden - Player access required",
    });
  }
  return user;
}

/**
 * Require admin OR the current user (matches playerId)
 * Used for player-specific endpoints that should be accessible by the player themselves or admin
 */
export async function requireAdminOrCurrentUser(
  event: H3Event,
  playerId: number
) {
  const user = await requireAuth(event);
  const userId = (user as any).id;
  const userRole = (user as any).role;

  if (userRole !== "admin" && userId !== playerId) {
    throw createError({
      statusCode: 403,
      message: "Forbidden - You can only access your own resources",
    });
  }

  return user;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  const db = useDrizzle();
  const results = await db
    .select()
    .from(drizzleSchema.tables.players)
    .where(eq(drizzleSchema.tables.players.username, username))
    .limit(1);

  return results[0] || null;
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const db = useDrizzle();
  const results = await db
    .select()
    .from(drizzleSchema.tables.players)
    .where(eq(drizzleSchema.tables.players.id, id))
    .limit(1);

  return results[0] || null;
}
