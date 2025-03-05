import * as fs from "fs/promises";
import * as path from "path";
import { prerenderToNodeStream } from "react-dom/static";
import { createElement } from "react";
import { Content } from "./content";
import { isFolderCollection, isNested } from "./decap-types";
import { DefaultDocument } from "./default-document";
import { CollectionRegistry } from "./registry";
import { getPathForSlug } from "./match";

export function createRenderFunction(
  registry: CollectionRegistry,
  document = DefaultDocument
) {
  const content = new Content(registry);
  return async (url: string) => {
    const children = await content.resolve(url);
    if (children) {
      return prerenderToNodeStream(createElement(document, { children }));
    }
  };
}

export async function listAllPaths(registry: CollectionRegistry) {
  const paths = [];
  for (const collection of registry.collections) {
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
