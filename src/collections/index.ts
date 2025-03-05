import posts from "./posts";
import pages from "./pages";
import settings from "./settings";
import {
  CmsCollection,
  collections,
  InferDoc,
  InferProps,
  ObjectField,
} from "../decaprio";

const c = collections(posts, pages, settings);

export type LayoutProps<T extends CmsCollection> = InferDoc<T, typeof c>;
export type BlockProps<T extends ObjectField> = InferProps<T, typeof c>;

export default c;
