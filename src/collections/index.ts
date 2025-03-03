import posts from "./posts";
import pages from "./pages";
import settings from "./settings";
import { contentCollections } from "../decap-utils";

export const content = contentCollections({
  collections: [posts, pages, settings],
});

declare module "../decap-utils" {
  interface Config {
    content: typeof content;
  }
}
