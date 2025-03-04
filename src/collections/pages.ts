import { collection } from "../decaprio";
import blocks from "../blocks";

export default collection({
  name: "pages",
  label: "Pages",
  label_singular: "Page",
  preview_path: "{{slug}}",
  extension: "yml",
  editor: {
    visualEditing: true,
  },
  /* nested: {
    depth: 100,
    subfolders: false,
  }, */
  //meta: { path: { widget: "string", label: "Path", index_file: "index" } },
  fields: [
    { label: "Title", name: "title", widget: "string" },
    {
      label: "Meta Description",
      name: "description",
      widget: "text",
      required: false,
      hint: "If empty, the first paragraph of the intro text will be used.",
    },
    {
      label: "Overline",
      name: "overline",
      widget: "string",
      required: false,
    },
    {
      label: "Headline",
      name: "headline",
      widget: "string",
      required: false,
    },
    {
      label: "Intro",
      name: "intro",
      widget: "markdown",
      buttons: ["bold", "italic", "bulleted-list", "numbered-list"],
      editor_components: [],
      required: false,
    },
    { label: "Image", name: "image", widget: "image", required: false },
    {
      name: "sections",
      label: "Sections",
      label_singular: "Section",
      widget: "list",
      types: blocks,
    },
    {
      name: "settings",
      widget: "hidden",
      hint: "load(settings,settings)",
    },
  ],
});
