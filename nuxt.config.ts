import { createResolver } from "nuxt/kit";

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/hints",
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@nuxthub/core",
    "@vueuse/nuxt",
    "nuxt-monaco-editor",
  ],

  css: [resolve("./app/assets/css/main.css")],

  experimental: {
    typedPages: true,
  },
  imports: {
    dirs: [resolve("./shared/types/**"), resolve("./shared/utils/**")],
  },
  nitro: {
    experimental: {
      openAPI: true,
      asyncContext: true,
    },
    imports: {
      dirs: [resolve("./shared/types/**"), resolve("./shared/utils/**")],
    },
  },

  hub: {
    database: true,
    databaseMigrationsDirs: [resolve("./server/drizzle/migrations")],
  },
});