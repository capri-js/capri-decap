import { Collection } from "./types";
import { CollectionConfig } from "./field-inference";

export function defineCollections(
  collections: CollectionConfig<any>[],
  opts: {
    paginate?: (slug: string, page: string | number) => string;
  } = {}
) {
  const { paginate = (slug, page) => `${slug}-${page}-` } = opts;

  const pattern = paginate("(.+)", "(\\d+)");
  const re = new RegExp(`^${pattern}$`);

  return {
    collections,
    config: collections.map((c) => c.config) as Collection[],
  };
}
