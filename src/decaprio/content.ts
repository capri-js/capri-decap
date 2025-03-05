import * as fs from "fs/promises";
import * as path from "path";
import * as yaml from "js-yaml";
import matter from "gray-matter";

import {
  FilesCollection,
  FolderCollection,
  isFilesCollection,
  isFolderCollection,
  isNested,
} from "./decap-types";
import { createTransform } from "./transform";
import { getIndexFile, getPathForSlug, matchPath } from "./match";
import { createElement } from "react";
import { CollectionRegistry } from "./registry";

export class Content {
  constructor(private registry: CollectionRegistry) {}

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

  async getContentAndFields(name: string, file: string) {
    const c = this.registry.getCollection(name);
    if (isFolderCollection(c)) {
      return {
        data: await this.loadFileOrIndex(c, file),
        fields: c.fields!,
      };
    } else if (isFilesCollection(c)) {
      const fileConfig = c.files.find(
        (f) => path.basename(f.file, path.extname(f.file)) === file
      );
      if (!fileConfig) {
        throw new Error(`File '${file}' not found in collection '${name}'`);
      }
      return {
        data: await this.readContent(fileConfig.file),
        fields: fileConfig.fields,
      };
    } else {
      throw new Error(
        `Collection '${name}' is neither a folder nor files collection`
      );
    }
  }

  /**
   * Loads a single entry from a collection
   */
  async loadAndTransform(name: string, file: string) {
    const { data, fields } = await this.getContentAndFields(name, file);
    if (data) {
      const transform = createTransform({
        load: async (name: string, file: string) => {
          const { data } = await this.getContentAndFields(name, file);
          return data;
        },
        loadAll: async (name: string) => {
          return this.loadAll(name);
        },
        getCollection: (name: string) => {
          return this.registry.getCollection(name);
        },
      });
      return transform(data, fields);
    }
  }

  /**
   * Loads all entries from a collection
   */
  async loadAll(name: string) {
    const c = this.registry.getCollection(name);

    if (isFolderCollection(c)) {
      return this.loadFolderCollection(c);
    }

    if (isFilesCollection(c)) {
      return this.loadFilesCollection(c);
    }

    throw new Error(
      `Collection '${name}' is neither a folder nor files collection`
    );
  }

  async resolve(slug: string) {
    for (const c of this.registry.collections) {
      const match = matchPath(c, slug);
      if (match !== null) {
        const data = await this.loadAndTransform(c.name, match);
        if (data) {
          const Layout = this.registry.getLayout(c.name);
          return createElement(Layout, data);
        }
      }
    }
  }
}
