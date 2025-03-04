import * as fs from "fs/promises";
import * as path from "path";

import { getPathForSlug } from "./match";
import { CmsCollection, isFolderCollection, isNested } from "./types";

export async function listAllPaths(collections: CmsCollection[]) {
  const paths = [];
  for (const collection of collections) {
    if (isFolderCollection(collection)) {
      if (collection.editor?.preview !== false) {
        const ext = collection.extension ?? "yml";
        const files = await fs.readdir(collection.folder, {
          recursive: isNested(collection),
        });
        paths.push(
          ...files
            .filter((file) => path.extname(file) === `.${ext}`)
            .map((file) => file.slice(0, -ext.length - 1))
            .map((file) => getPathForSlug(collection, file))
        );
      }
    }
  }
  return paths;
}
