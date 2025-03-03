import posts from "./posts";
import pages from "./pages";
import settings from "./settings";
import { defineCollections } from "../decap-utils";

export const collections = defineCollections([posts, pages, settings]);

declare module "../decap-utils" {
  interface Config {
    collections: typeof collections;
  }
}
