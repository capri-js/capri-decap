import { FunctionComponent, memo } from "react";
import { InferProps } from "./field-inference";
import { ObjectField } from "./types";

type Block<F extends ObjectField> = {
  field: F;
  component: FunctionComponent<InferProps<F>>;
};

export function block<const F extends ObjectField>(
  field: F,
  component: FunctionComponent<InferProps<F>>
): Block<F> {
  return {
    field,
    component: memo(component),
  };
}

type ExtractComponent<B> = B extends Block<any> ? B["component"] : never;

type ExtractField<B> = B extends Block<any> ? B["field"] : never;

type BlockName<B> = B extends Block<infer F> ? F["name"] : never;

export function blocks<const B extends Block<any>[]>(...b: B) {
  return {
    components: b.reduce(
      (acc, block) => ({
        ...acc,
        [block.field.name]: block.component,
      }),
      {}
    ) as {
      [K in B[number] as BlockName<K>]: ExtractComponent<K>;
    },
    fields: b.map((b) => b.field) as {
      [K in keyof B]: ExtractField<B[K]>;
    },
  };
}
