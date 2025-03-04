import { field } from "../../decaprio";

export default field({
  label: "Text & Image",
  name: "TextAndImage",
  widget: "object",
  fields: [
    {
      label: "Headline",
      name: "headline",
      widget: "string",
      required: false,
    },
    {
      label: "Content",
      name: "content",
      widget: "markdown",
      buttons: ["bold", "italic", "bulleted-list", "numbered-list", "link"],
      editor_components: ["link-button"],
    },
    { label: "Image", name: "image", widget: "image", required: false },
  ],
});
