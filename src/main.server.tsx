import { prerenderToNodeStream } from "react-dom/static";
import { Content } from "./decap-utils";
import { collections } from "./collections";
import "./main.css";

const content = new Content(collections);

export async function render(url: string) {
  const entry = await content.resolve(url);
  if (entry) {
    const { Layout, data } = entry;
    return prerenderToNodeStream(
      <html>
        <head></head>
        <body>
          <Layout {...data} />
        </body>
      </html>
    );
  }
}
