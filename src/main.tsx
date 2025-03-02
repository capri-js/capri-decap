import { init } from "decap-cms-app/init";
import CMS from "decap-cms-core";
import IconWidget from "decap-cms-widget-iconify";

import { content } from "./collections";
import { Preview } from "./Preview";

init({
  config: {
    site_url: window.location.origin,
    locale: "en",
    load_config_file: true,
    local_backend: window.location.hostname === "localhost",
    backend: {
      name: "github",
      branch: "main",
      repo: "Lionizers/lionizers-website-capri",
      base_url: "https://lionizers.com",
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
    collections: content.config,
  },
  setup: async (cms) => {
    for (const c of content.collections) {
      cms.registerPreviewTemplate(c.config.name, (props) => (
        <Preview {...props} layout={c.layout} />
      ));
    }

    cms.registerEditorComponent({
      // Internal id of the component
      id: "link-button",
      label: "Link Button",
      fields: [
        {
          name: "label",
          label: "Label",
          widget: "string",
        },
        {
          name: "link",
          label: "Link",
          widget: "string",
        },
      ],
      // Regex pattern used to search for instances of this block in the markdown document.
      pattern: /^<LinkButton link="(.*?)" label="(.*?)" \/>$/ms,
      fromBlock: function (match) {
        return {
          link: match[1],
          label: match[2],
        };
      },
      toBlock: function (data) {
        return `<LinkButton link="${data.link}" label="${data.label}" />`;
      },
      toPreview: function (data) {
        return <div>LINK:{data.label}</div>;
      },
    });

    CMS.registerWidget(
      IconWidget.Widget({
        collection: "material-symbols-light",
        filter: /-rounded$/,
      })
    );
  },
});
