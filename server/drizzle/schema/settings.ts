import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const settings = sqliteTable("settings", {
  id: integer().primaryKey({ autoIncrement: true }),
  allowPlayerSignup: integer({ mode: "boolean" }).default(false).notNull(),
  updatedAt: integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});
