import type { CmsField, CmsCollection } from "decap-cms-core";
import { CollectionOrLayout, CollectionRegistry, Layout } from "./registry";
import { ObjectField } from "./decap-types";
import { Block } from "./blocks";

export type { InferDoc, InferProps } from "./field-inference";

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

export function block<T extends ObjectField>(
  config: T,
  component: any
): Block<T> {
  return {
    config,
    component,
  };
}

export function blocks<const B extends Block[]>(...blocks: B) {
  return {
    types: blocks.map((b) => b.config) as B[number]["config"][],
    Blocks: ({ data }: any) => {
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

export function layout<T extends CmsCollection>(
  collection: T,
  component: any
): Layout<T> {
  return new Layout(collection, component);
}

export function collections<const C extends CollectionOrLayout[]>(
  ...collections: C
) {
  return new CollectionRegistry(collections);
}
