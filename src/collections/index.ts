import { collections, InferCollection, InferBlock } from "decaprio";

import posts from "./posts";
import pages from "./pages";
import settings from "./settings";

export const registry = collections(posts, pages, settings);

export type CollectionProps<T> = InferCollection<T, typeof registry>;
export type BlockProps<T> = InferBlock<T, typeof registry>;
