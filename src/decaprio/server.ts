import { prerenderToNodeStream } from "react-dom/static";
import { DefaultDocument } from "./default-document";
import { createElement } from "react";
import { Content } from "./content";
import { CollectionRegistry } from "./utils";

export function createRenderFunction(
  registry: CollectionRegistry,
  document = DefaultDocument
) {
  const content = new Content(registry);
  return async (url: string) => {
    const children = await content.resolve(url);
    if (children) {
      return prerenderToNodeStream(createElement(document, { children }));
    }
  };
}
