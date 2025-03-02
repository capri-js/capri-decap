import * as fs from "fs/promises";
import * as path from "path";
import * as yaml from "js-yaml";
import matter from "gray-matter";

import {
  DeepMutable,
  FilesCollection,
  FolderCollection,
  isFilesCollection,
  isFolderCollection,
  isNested,
} from "./types";
import { createTransform } from "./transform";
import { getIndexFile, getPathForSlug, matchPath } from "./match";
import { CollectionConfig } from "./field-inference";

export function contentCollections<
  const C extends CollectionConfig<any>[]
>(opts: {
  collections: C;
  paginate?: (slug: string, page: string | number) => string;
}) {
  const { collections, paginate = (slug, page) => `${slug}-${page}-` } = opts;

  const pattern = paginate("(.+)", "(\\d+)");
  const re = new RegExp(`^${pattern}$`);

  async function readContent(filePath: string): Promise<any> {
    try {
      await fs.access(filePath);
    } catch (err: any) {
      return null;
    }
    const fileContent = await fs.readFile(filePath, "utf8");
    const slug = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".md" || ext === ".mdx") {
      const { data, content } = matter(fileContent);
      return {
        slug,
        ...data,
        content,
      };
    } else if (ext === ".yml" || ext === ".yaml") {
      return {
        slug,
        ...(yaml.load(fileContent) ?? {}),
      };
    }
    return null;
  }

  function findCollectionConfig(name: string) {
    const config = collections.find((c) => c.config.name === name);
    if (!config) {
      throw new Error(`Collection '${name}' not found in configuration`);
    }
    return config;
  }

  /**
   * Loads all files from a folder collection
   */
  async function loadFolderCollection(collection: FolderCollection) {
    const files = await fs.readdir(collection.folder, {
      recursive: isNested(collection),
    });
    const yamlFiles = files.filter(
      (file) => path.extname(file) === `.${collection.extension}`
    );
    return Promise.all(
      yamlFiles.map((file) => readContent(path.join(collection.folder, file)))
    );
  }

  /**
   * Loads all files from a files collection
   */
  async function loadFilesCollection(collection: FilesCollection) {
    return Promise.all(collection.files.map((f) => readContent(f.file)));
  }

  /**
   * Loads all entries from a collection
   */
  async function loadAll(name: string) {
    const c = findCollectionConfig(name);

    if (isFolderCollection(c.config)) {
      return loadFolderCollection(c.config);
    }

    if (isFilesCollection(c.config)) {
      return loadFilesCollection(c.config);
    }

    throw new Error(
      `Collection '${name}' is neither a folder nor files collection`
    );
  }

  async function resolve(slug: string) {
    for (const c of collections) {
      const match = matchPath(c.config, slug);
      if (match !== null) {
        const data = await load(c.config.name, match, { inlineDocs: true });
        if (data) {
          if (c.layout) {
            return {
              collection: c.config.name,
              data,
              Layout: c.layout,
            };
          }
          throw new Error(`Collection '${c.config.name}' has no layout.`);
        }
      }
    }
  }

  async function loadFileOrIndex(collection: FolderCollection, file: string) {
    const indexFile = getIndexFile(collection);
    const filePath = path.join(
      collection.folder,
      `${file || indexFile}.${collection.extension}`
    );
    const data = await readContent(filePath);
    if (data !== null) {
      return data;
    }
    if (file) {
      // Try index file inside folder
      const filePath = path.join(
        collection.folder,
        file,
        `${indexFile}.${collection.extension}`
      );
      return readContent(filePath);
    }
    return null;
  }

  /**
   * Loads a single entry from a collection
   */
  async function load(
    name: string,
    file: string,
    opts: { inlineDocs: boolean }
  ) {
    const c = findCollectionConfig(name);
    const transform = createTransform({
      load: (collectionName, slug) => {
        return load(collectionName, slug, { inlineDocs: false });
      },
      loadAll,
      inlineDocs: opts.inlineDocs,
      getHref: (collectionName, slug) => {
        const c = findCollectionConfig(collectionName);
        return getPathForSlug(c.config, slug);
      },
    });
    if (isFolderCollection(c.config)) {
      const data = await loadFileOrIndex(c.config, file);
      return data && transform(data, c.config.fields!);
    } else if (isFilesCollection(c.config)) {
      const fileConfig = c.config.files.find(
        (f) => path.basename(f.file, path.extname(f.file)) === file
      );
      if (!fileConfig) {
        throw new Error(`File '${file}' not found in collection '${name}'`);
      }
      const data = await readContent(fileConfig.file);
      return transform(data, fileConfig.fields);
    } else {
      throw new Error(
        `Collection '${name}' is neither a folder nor files collection`
      );
    }
  }

  async function listAllPaths() {
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

  return {
    collections,
    config: collections.map((c) => c.config) as DeepMutable<
      C[number]["config"]
    >[],
    load: (name: string, file: string) =>
      load(name, file, { inlineDocs: true }),
    loadAll,
    listAllPaths,
    resolve,
  };
}

export interface Config {
  collections: CollectionConfig<any>[];
}

type C = Config["collections"][number]["config"];

export type Collections = {
  [K in C["name"]]: Extract<C, { name: K }>;
};
