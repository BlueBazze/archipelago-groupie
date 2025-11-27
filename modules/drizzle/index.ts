import {
  addImports,
  addImportsDir,
  addServerImports,
  addServerImportsDir,
  addServerScanDir,
  addTemplate,
  addTypeTemplate,
  defineNuxtModule,
  getLayerDirectories,
  updateTemplates,
} from "@nuxt/kit";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "pathe";
import { processSchemaFiles } from "./discovery";
export default defineNuxtModule({
  meta: {
    name: "drizzle-schema",
    configKey: "drizzle",
  },
  defaults: {
    drizzleDir: `drizzle/schema`,
    multiFileSchema: true,
  },
  async setup(options, nuxt) {
    const layerDirs = getLayerDirectories();

    nuxt.options.watch = nuxt.options.watch || [];

    let drizzleDirs = [];
    for (const [index, layer] of layerDirs.entries()) {
      const drizzleDir = resolve(layer.server, options.drizzleDir);
      nuxt.options.watch.push(drizzleDir);
      drizzleDirs.push(drizzleDir);
      addServerScanDir(drizzleDir);
    }

    nuxt.hook("builder:watch", async (event, relativePath) => {
      if (event === "change") {
        return;
      }

      const path = resolve(nuxt.options.serverDir, relativePath);
      if (drizzleDirs.some((drizzleDir) => path.startsWith(drizzleDir))) {
        await updateTemplates({
          filter: (template) => {
            console.log(template.filename);
            return template.filename === "nuxt-drizzle/server/schema.ts";
          },
        });
      }
    });

    addTemplate({
      filename: "nuxt-drizzle/schema.ts",
      write: true,
      async getContents() {
        let specifics: Record<
          string,
          Array<{ name: string; kind: "table" | "misc" | "enum" }>
        > = await Promise.all(
          drizzleDirs.map(async (dir) => await processSchemaFiles(dir))
        ).then((dirs) => dirs.reduce((acc, curr) => ({ ...acc, ...curr }), {}));

        const imports = Object.entries(specifics)
          .map(
            ([file, exports]) =>
              `import { ${exports
                .map(({ name }) => name)
                .join(", ")} } from '${file.replace(".ts", "")}'`
          )
          .join("\n");

        const all = `schema: {${Object.values(specifics)
          .map((exports) => exports.map(({ name }) => name).join(", "))
          .join(", ")}}`;

        const tables = `tables: {${Object.values(specifics)
          .map((exports) =>
            exports
              .filter(({ kind }) => kind === "table")
              .map(({ name }) => name)
              .join(", ")
          )
          .join(", ")}}`;

        const enums = `export {${Object.values(specifics)
          .map((exports) =>
            exports
              .filter(({ kind }) => kind === "enum")
              .map(({ name }) => name)
              .join(", ")
          )
          .join(", ")}}`;

        return `${imports}\n
export const drizzleSchema = {
  ${all},
  ${tables},
}

`;
      },
    });

    //       addTypeTemplate({
    //         filename: "nuxt-drizzle/types.d.ts",
    //         write: true,
    //         async getContents() {
    //           const inferredTable = `
    // import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
    // export type InferTableSelectType<T extends keyof typeof import("./schema.ts").tables> = InferSelectModel<typeof import("./schema.ts").tables[T]>;
    // export type InferTableInsertType<T extends keyof typeof import("./schema.ts").tables> = InferInsertModel<typeof import("./schema.ts").tables[T]>;
    //           `;

    //           return inferredTable;
    //         },
    //       });

    addServerImportsDir(resolve(nuxt.options.buildDir, "nuxt-drizzle"));

    addTemplate({
      filename: "nuxt-drizzle/client/enums.ts",
      write: true,
      async getContents() {
        let specifics: Record<
          string,
          Array<{ name: string; kind: "table" | "misc" | "enum" }>
        > = await Promise.all(
          drizzleDirs.map(async (dir) => await processSchemaFiles(dir))
        ).then((dirs) => dirs.reduce((acc, curr) => ({ ...acc, ...curr }), {}));

        const imports = Object.entries(specifics)
          .map(
            ([file, exports]) =>
              `import { ${exports
                .filter(({ kind }) => kind === "enum")
                .map(({ name }) => name)
                .join(", ")} } from '${file.replace(".ts", "")}'`
          )
          .join("\n");

        const enums = `export  {${Object.values(specifics)
          .map((exports) =>
            exports
              .filter(({ kind }) => kind === "enum")
              .map(({ name }) => name)
              .join(", ")
          )
          .join(", ")}}`;

        return `${imports}\n

${enums}`;
      },
    });

    // addImports({
    //   from: resolve(nuxt.options.buildDir, "nuxt-drizzle/client/enums.ts"),
    //   name: "*",
    //   priority: 1000,
    // });

    // addServerImports([
    //   {
    //     from: resolve(nuxt.options.buildDir, "nuxt-drizzle/schema.ts"),
    //     // name: "*",
    //   },
    //   // {
    //   //   from: resolve(nuxt.options.buildDir, "nuxt-drizzle/schema.ts"),
    //   //   name: "enums",
    //   // },
    // ]);
    // addImportsDir(resolve(nuxt.options.buildDir, "nuxt-drizzle/client"));
  },
});
