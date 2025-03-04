import { field } from "../../decaprio";

export default field({
  label: "Teaser-Grid",
  name: "TeaserGrid",
  widget: "object",
  fields: [
    { label: "Headline", name: "headline", widget: "string" },
    {
      label: "Teasers",
      name: "teasers",
      widget: "list",
      fields: [
        { label: "Headline", name: "headline", widget: "string" },
        { label: "Image", name: "image", widget: "image" },
        { label: "Text", name: "text", widget: "text" },
        {
          label: "Link",
          name: "link",
          widget: "relation",
          collection: "pages",
          search_fields: ["title"],
          display_fields: ["title", "path"],
          value_field: "{{slug}}",
          required: false,
        },
        {
          label: "Link Text",
          name: "linkText",
          widget: "string",
          required: false,
        },
      ],
    },
  ],
});
