import { prerenderToNodeStream } from "react-dom/static";
import { DefaultDocument } from "./default-document";
import { Decaprio } from "./decaprio";
import { createElement } from "react";
import { Content } from "./content";

export function createRenderFunction(
  decaprio: Decaprio<any, any>,
  document = DefaultDocument
) {
  const content = new Content(decaprio);
  return async (url: string) => {
    const children = await content.resolve(url);
    if (children) {
      return prerenderToNodeStream(createElement(document, { children }));
    }
  };
}
