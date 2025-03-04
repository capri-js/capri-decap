import { field } from "../../decaprio";

export default field({
  name: "FactsAndFigures",
  label: "Facts & Figures",
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
      label: "Facts",
      name: "facts",
      widget: "list",
      fields: [
        { label: "Label", name: "label", widget: "string" },
        {
          label: "Prefix",
          name: "prefix",
          widget: "string",
          required: false,
        },
        { label: "Number", name: "number", widget: "number" },
        { label: "Unit", name: "unit", widget: "string", required: false },
      ],
    },
  ],
});
