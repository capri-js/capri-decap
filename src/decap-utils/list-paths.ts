import * as fs from "fs/promises";
import * as path from "path";

import { getPathForSlug } from "./match";
import { isFolderCollection, isNested } from "./types";
import { CollectionConfig } from "./field-inference";

export async function listAllPaths({
  collections,
}: {
  collections: CollectionConfig<any>[];
}) {
  const paths = [];
  for (const c of collections) {
    if (isFolderCollection(c.config)) {
      if (c.config.editor?.preview !== false) {
        const ext = c.config.extension ?? "yml";
        const files = await fs.readdir(c.config.folder, {
          recursive: isNested(c.config),
        });
        paths.push(
          ...files
            .filter((file) => path.extname(file) === `.${ext}`)
            .map((file) => file.slice(0, -ext.length - 1))
            .map((file) => getPathForSlug(c.config, file))
        );
      }
    }
  }
  return paths;
}
