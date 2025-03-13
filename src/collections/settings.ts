import { collection } from "decaprio";

export default collection({
  name: "settings",
  label: "Settings",
  extension: "yml",
  editor: {
    preview: false,
  },
  files: [
    {
      name: "settings",
      label: "Settings",
      file: "content/settings/settings.yml",
      fields: [
        {
          name: "mainNav",
          label: "Navigation",
          widget: "list",
          field: {
            name: "link",
            widget: "relation",
            collection: "pages",
            search_fields: ["title"],
            display_fields: ["title"],
            value_field: "{{slug}}",
          },
        },
        {
          name: "copyright",
          label: "Copyright",
          widget: "string",
        },
        {
          name: "email",
          label: "Email",
          widget: "string",
        },
      ],
    },
  ],
});
