import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const players = sqliteTable("players", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  password: text().notNull(),
  role: text().notNull().default("player"), // 'admin' or 'player'
  createdAt: integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});
