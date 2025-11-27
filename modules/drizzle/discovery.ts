import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "pathe";

export async function processSchemaFiles(drizzleDir: string) {
  //Check if directory exists
  if (!existsSync(drizzleDir)) {
    return {};
  }

  const specifics: Record<
    string,
    Array<{ name: string; kind: "table" | "misc" | "enum" }>
  > = {};

  const files = await readdir(drizzleDir, { recursive: true });

  // Get all TypeScript files with exports
  await Promise.all(
    files
      .filter((file) => file.toString().endsWith(".ts"))
      .map(async (file) => {
        const filePath = resolve(drizzleDir, file);
        const fileContent = await readFile(filePath, "utf-8");

        // All named exports
        const exportLines = fileContent.match(/export\s+.*$/gm);

        if (exportLines) {
          if (!specifics[filePath]) {
            specifics[filePath] = [];
          }

          for (const exportLine of exportLines) {
            if (
              exportLine.toLowerCase().match("table") ||
              exportLine.toLowerCase().match("@definetable")
            ) {
              specifics[filePath].push({
                name: exportLine.split(" ")[2]!,
                kind: "table",
              });
            } else if (exportLine.includes("@defineEnum")) {
              specifics[filePath].push({
                name: exportLine.split(" ")[2]!,
                kind: "enum",
              });
            } else {
              specifics[filePath].push({
                name: exportLine.split(" ")[2]!,
                kind: "misc",
              });
            }
          }
        }

        // fileContent.match(/export\s+(?:const|let|var|type|interface|class|enum|function|{[^}]+})/g);
        return {
          hasExport: fileContent.includes("export"),
          file: filePath.replace(".ts", ""),
        };
      })
  );

  return specifics;
}
