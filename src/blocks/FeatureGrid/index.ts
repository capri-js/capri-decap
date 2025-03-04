import { field } from "../../decaprio";

export default field({
  label: "Feature-Grid",
  name: "FeatureGrid",
  widget: "object",
  fields: [
    { label: "Headline", name: "headline", widget: "string" },
    {
      label: "Text",
      name: "text",
      widget: "markdown",
      buttons: ["bold"],
      editor_components: [],
      required: false,
    },
    {
      label: "Features",
      name: "features",
      widget: "list",
      fields: [
        {
          label: "Icon",
          name: "icon",
          widget: "icon",
          required: true,
          index_file: "",
          meta: false,
        },
        { label: "Headline", name: "headline", widget: "string" },
        {
          label: "Text",
          name: "text",
          widget: "text",
        },
      ],
    },
  ],
});
