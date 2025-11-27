import JSZip from "jszip";

/**
 * Create a ZIP file containing multiple YAML files
 * @param files Array of { filename: string, content: string }
 * @returns Buffer containing the ZIP file
 */
export async function createYamlZip(
  files: Array<{ filename: string; content: string }>
): Promise<Buffer> {
  const zip = new JSZip();

  // Add each file to the zip
  for (const file of files) {
    zip.file(file.filename, file.content);
  }

  // Generate the zip as a buffer
  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  return zipBuffer;
}
