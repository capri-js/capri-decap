import type { CmsField, CmsCollection } from "decap-cms-core";
import { ObjectField } from "./types";

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

export function collections<const C extends CmsCollection[]>(
  ...collections: C
): DeepMutable<C> {
  return collections as any;
}

export function blocks<const B extends ObjectField[]>(
  ...blocks: B
): DeepMutable<B> {
  return blocks as any;
}
