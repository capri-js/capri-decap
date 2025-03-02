import type { CmsField, CmsCollection } from "decap-cms-core";
import type { DeepMutable } from "./types";
import { CollectionConfig, InferDoc } from "./field-inference";
import { FunctionComponent } from "react";

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
  L extends FunctionComponent<{ data: InferDoc<C>; settings: any }>
>(collection: C, layout?: L): CollectionConfig<C> {
  /* if (collection.files) {
    return collection as any;
  } */
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
