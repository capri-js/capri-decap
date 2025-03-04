import { InferDoc, InferProps } from "./field-inference";
import { CmsCollection, ObjectField } from "./types";

export class Decaprio<
  Collections extends CmsCollection[] = any,
  Blocks extends ObjectField[] = any
> {
  readonly collections: Collections;
  private blocks: Blocks;

  private layouts: Record<string, React.ComponentType<any>> = {};

  constructor(opts: { collections: Collections; blocks: Blocks }) {
    this.collections = opts.collections;
    this.blocks = opts.blocks;
  }

  getCollection(name: string) {
    const collection = this.collections.find((c) => c.name === name);
    if (!collection) {
      throw new Error(`Collection '${name}' not found`);
    }
    return collection;
  }

  registerLayout<C extends CmsCollection>(
    collection: C,
    component: React.ComponentType<InferDoc<C, Collections>>
  ) {
    this.layouts[collection.name] = component;
  }

  getLayout(name: string) {
    const layout = this.layouts[name];
    if (!layout) {
      throw new Error(`Layout '${name}' not found`);
    }
    return layout;
  }

  registerBlock<F extends ObjectField>(
    field: F,
    component: React.ComponentType<InferProps<F, Collections>>
  ) {}
}
