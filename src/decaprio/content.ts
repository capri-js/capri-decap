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

  /**
   * Loads a single entry from a collection
   */
  async load(name: string, file: string, opts: { inlineDocs: boolean }) {
    const c = this.registry.getCollection(name);
    const transform = createTransform({
      load: (collectionName, slug) => {
        return this.load(collectionName, slug, { inlineDocs: false });
      },
      loadAll: this.loadAll.bind(this),
      inlineDocs: opts.inlineDocs,
      getHref: (collectionName, slug) => {
        const c = this.registry.getCollection(collectionName);
        return getPathForSlug(c, slug);
      },
    });
    if (isFolderCollection(c)) {
      const data = await this.loadFileOrIndex(c, file);
      return data && transform(data, c.fields!);
    } else if (isFilesCollection(c)) {
      const fileConfig = c.files.find(
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
        const data = await this.load(c.name, match, {
          inlineDocs: true,
        });
        if (data) {
          const Layout = this.registry.getLayout(c.name);
          return createElement(Layout, data);
        }
      }
    }
  }
}
