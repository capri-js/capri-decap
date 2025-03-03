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

type ExtractComponent<T> = T extends Block<any> ? T["component"] : never;

type ExtractField<T> = T extends Block<any> ? T["field"] : never;

type BlockName<T> = T extends Block<infer F> ? F["name"] : never;

export function defineBlocks<const T extends Block<any>[]>(blocks: T) {
  return {
    components: blocks.reduce(
      (acc, block) => ({
        ...acc,
        [block.field.name]: block.component,
      }),
      {}
    ) as {
      [K in T[number] as BlockName<K>]: ExtractComponent<K>;
    },
    fields: blocks.map((b) => b.field) as {
      [K in keyof T]: ExtractField<T[K]>;
    },
  };
}
