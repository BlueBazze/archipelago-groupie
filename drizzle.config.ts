import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/drizzle/schema/*.ts",
  out: "./server/drizzle/migrations",
  dialect: "sqlite",
  driver: "d1-http",
});
