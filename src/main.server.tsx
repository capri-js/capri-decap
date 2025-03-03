import { prerenderToNodeStream } from "react-dom/static";
import { content } from "./collections";
import "./main.css";

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
