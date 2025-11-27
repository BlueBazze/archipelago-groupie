import { createResolver } from "nuxt/kit";

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/hints", "@nuxt/ui", "nuxt-auth-utils", "@nuxthub/core"],

  css: [resolve("./app/assets/css/main.css")],

  imports: {
    dirs: [resolve("./shared/types/**"), resolve("./shared/utils/**")],
  },
  nitro: {
    imports: {
      dirs: [resolve("./shared/types/**"), resolve("./shared/utils/**")],
    },
  },

  hub: {
    database: true,
    databaseMigrationsDirs: [resolve("./server/drizzle/migrations")],
  },
});
