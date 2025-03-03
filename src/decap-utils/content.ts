import * as fs from "fs/promises";
import * as path from "path";
import * as yaml from "js-yaml";
import matter from "gray-matter";

import {
  Collection,
  FilesCollection,
  FolderCollection,
  isFilesCollection,
  isFolderCollection,
  isNested,
} from "./types";
import { createTransform } from "./transform";
import { getIndexFile, getPathForSlug, matchPath } from "./match";
import { CollectionConfig } from "./field-inference";

export class Content {
  protected collections: CollectionConfig<any>[] = [];

  constructor(opts: { collections: CollectionConfig<any>[] }) {
    this.collections = opts.collections;
  }

  protected async readContent(filePath: string): Promise<any> {
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

  protected findCollectionConfig(name: string) {
    const config = this.collections.find((c) => c.config.name === name);
    if (!config) {
      throw new Error(`Collection '${name}' not found in configuration`);
    }
    return config;
  }

  /**
   * Loads all files from a folder collection
   */
  protected async loadFolderCollection(collection: FolderCollection) {
    const files = await fs.readdir(collection.folder, {
      recursive: isNested(collection),
    });
    const yamlFiles = files.filter(
      (file) => path.extname(file) === `.${collection.extension}`
    );
    return Promise.all(
      yamlFiles.map((file) =>
        this.readContent(path.join(collection.folder, file))
      )
    );
  }

  /**
   * Loads all files from a files collection
   */
  protected async loadFilesCollection(collection: FilesCollection) {
    return Promise.all(collection.files.map((f) => this.readContent(f.file)));
  }

  protected async loadFileOrIndex(collection: FolderCollection, file: string) {
    const indexFile = getIndexFile(collection);
    const filePath = path.join(
      collection.folder,
      `${file || indexFile}.${collection.extension}`
    );
    const data = await this.readContent(filePath);
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
      return this.readContent(filePath);
    }
    return null;
  }

  /**
   * Loads a single entry from a collection
   */
  async load(name: string, file: string, opts: { inlineDocs: boolean }) {
    const c = this.findCollectionConfig(name);
    const transform = createTransform({
      load: (collectionName, slug) => {
        return this.load(collectionName, slug, { inlineDocs: false });
      },
      loadAll: this.loadAll.bind(this),
      inlineDocs: opts.inlineDocs,
      getHref: (collectionName, slug) => {
        const c = this.findCollectionConfig(collectionName);
        return getPathForSlug(c.config, slug);
      },
    });
    if (isFolderCollection(c.config)) {
      const data = await this.loadFileOrIndex(c.config, file);
      return data && transform(data, c.config.fields!);
    } else if (isFilesCollection(c.config)) {
      const fileConfig = c.config.files.find(
        (f) => path.basename(f.file, path.extname(f.file)) === file
      );
      if (!fileConfig) {
        throw new Error(`File '${file}' not found in collection '${name}'`);
      }
      const data = await this.readContent(fileConfig.file);
      return transform(data, fileConfig.fields);
    } else {
      throw new Error(
        `Collection '${name}' is neither a folder nor files collection`
      );
    }
  }

  /**
   * Loads all entries from a collection
   */
  async loadAll(name: string) {
    const c = this.findCollectionConfig(name);

    if (isFolderCollection(c.config)) {
      return this.loadFolderCollection(c.config);
    }

    if (isFilesCollection(c.config)) {
      return this.loadFilesCollection(c.config);
    }

    throw new Error(
      `Collection '${name}' is neither a folder nor files collection`
    );
  }

  async resolve(slug: string) {
    for (const c of this.collections) {
      const match = matchPath(c.config, slug);
      if (match !== null) {
        const data = await this.load(c.config.name, match, {
          inlineDocs: true,
        });
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
}
