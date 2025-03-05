import type { CmsField, CmsCollection } from "decap-cms-core";
import { ObjectField } from "./types";
import { ComponentType } from "react";

type DeepMutable<T> = T extends unknown
  ? {
      -readonly [P in keyof T]: DeepMutable<T[P]>;
    }
  : never;

export function field<const F extends CmsField>(field: F): DeepMutable<F> {
  return field as any;
}

export function fields<const F extends CmsField[]>(
  ...fields: F
): DeepMutable<F> {
  return fields as any;
}

export function collection<const C extends CmsCollection>(
  collection: C
): DeepMutable<C> {
  if (collection.files) {
    return collection as any;
  }
  const {
    name,
    folder = `content/${name}`,
    create = true,
    format = "yaml",
    extension = "yml",
    slug = "{{slug}}",
    ...props
  } = collection;
  return {
    ...props,
    name,
    folder,
    create,
    format,
    extension,
    slug,
  } as any;
}

export class Layout<T extends CmsCollection> {
  constructor(public readonly collection: T, public readonly component: any) {}
}

export type CollectionOrLayout<T extends CmsCollection = any> = T | Layout<T>;

export type ExtractCollection<T extends CollectionOrLayout> = T extends Layout<
  infer C
>
  ? C
  : T;

export function layout<T extends CmsCollection>(
  collection: T,
  component: any
): Layout<T> {
  return new Layout(collection, component);
}

export class CollectionRegistry<const T extends CollectionOrLayout[] = any> {
  readonly collections: ExtractCollection<T[number]>[];
  readonly layouts: Record<string, ComponentType<any>> = {};
  constructor(collections: T) {
    this.collections = collections.map((c) =>
      c instanceof Layout ? c.collection : c
    );
    for (const c of collections) {
      if (c instanceof Layout) {
        this.layouts[c.collection.name] = c.component;
      }
    }
  }

  getCollection(name: string) {
    const collection = this.collections.find((c) => c.name === name);
    if (!collection) {
      throw new Error(`Collection '${name}' not found`);
    }
    return collection;
  }

  getLayout(name: string) {
    const layout = this.layouts[name];
    if (!layout) {
      throw new Error(`Layout '${name}' not found`);
    }
    return layout;
  }
}

export function collections<const C extends CollectionOrLayout[]>(
  ...collections: C
) {
  return new CollectionRegistry(collections);
}

export type Block<T extends ObjectField = any> = {
  config: T;
  component: any;
};

export function blocks<const B extends Block[]>(...blocks: B) {
  return {
    types: blocks.map((b) => b.config) as B[number]["config"][],
    Blocks: (data: any[]) => {
      /* {sections?.map((section, i) => {
        let Section: any; //TODO
        return Section ? (
          <Section key={i} {...(section as any)} />
        ) : (
          <div key={i} className="container mx-auto px-4 py-24">
            Unknown section type: {section.type}
          </div>
        );
      })} */
      return null;
    },
  };
}

export function block<T extends ObjectField>(
  config: T,
  component: any
): Block<T> {
  return {
    config,
    component,
  };
}
