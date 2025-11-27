import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { players } from "./player";

export const games = sqliteTable("games", {
  id: integer().primaryKey({ autoIncrement: true }),
  playerId: integer()
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  name: text().notNull(), // Game name/slot name
  yamlContent: text(), // The YAML file content uploaded by the player
  yamlFilename: text(), // Original filename
  uploadedAt: integer({ mode: "timestamp" }),
  createdAt: integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});
