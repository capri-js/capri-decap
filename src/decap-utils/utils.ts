import type { CmsField, CmsCollection } from "decap-cms-core";
import { CollectionConfig, InferDoc } from "./field-inference";
import { FunctionComponent } from "react";

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

export function collection<
  const C extends CmsCollection,
  L extends FunctionComponent<InferDoc<C>>
>(collection: C, layout?: L): CollectionConfig<C> {
  if (collection.files) {
    return {
      config: collection as any,
    };
  }
  const {
    name,
    folder = `content/${name}`,
    create = true,
    slug = "{{slug}}",
    ...props
  } = collection;
  return {
    config: {
      ...props,
      name,
      folder,
      create,
      slug,
    } as any,
    layout,
  };
}
