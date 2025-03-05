import posts from "./posts";
import pages from "./pages";
import settings from "./settings";
import { collections, InferDoc, InferProps } from "../decaprio";

export const registry = collections(posts, pages, settings);

export type LayoutProps<T> = InferDoc<T, typeof registry>;
export type BlockProps<T> = InferProps<T, typeof registry>;
