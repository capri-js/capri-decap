import { init } from "decaprio/decap";
import IconWidget from "decap-cms-widget-iconify";

import { registry } from "./collections";
import { editorComponents } from "./markdown";
import css from "./main.css?inline";

init({
  css,
  registry,
  editorComponents,
  config: {
    site_url: window.location.origin,
    locale: "en",
    load_config_file: true,
    local_backend: window.location.hostname === "localhost",
    backend: {
      name: "github",
      branch: "main",
      repo: "your-org/repo",
      base_url: "https://example.com",
      auth_endpoint: "/api/auth",
      commit_messages: {
        create: "content: create {{slug}}",
        update: "content: update {{slug}}",
        delete: "content: delete {{slug}}",
        uploadMedia: "content: upload {{path}}",
        deleteMedia: "content: delete {{path}}",
        openAuthoring: "{{message}}",
      },
    },
    media_folder: "public/img",
    public_folder: "/img",
    show_preview_links: true,
    slug: {
      encoding: "unicode",
    },
  },
  setup: async (CMS) => {
    CMS.registerWidget(
      IconWidget.Widget({
        collection: "material-symbols-light",
        filter: /-rounded$/,
      })
    );
  },
});
