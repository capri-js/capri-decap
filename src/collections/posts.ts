import { collection } from "../decaprio";

export default collection({
  name: "posts",
  label: "Posts",
  label_singular: "Post",
  slug: "{{year}}-{{month}}-{{day}}-{{title}}",
  preview_path: "/blog/{{slug}}",
  extension: "md",
  format: "frontmatter",
  fields: [
    { label: "Title", name: "title", widget: "string" },
    { label: "Image", name: "image", widget: "image", required: false },
    { label: "Date", name: "date", widget: "datetime" },
    { label: "Body", name: "body", widget: "markdown" },
    {
      label: "Summary",
      name: "summary",
      widget: "markdown",
      buttons: [],
      editor_components: [],
    },
    {
      // This hidden field is used to trigger the transformation and inline all posts here
      name: "posts",
      widget: "hidden",
      hint: "loadAll(posts)",
    },
    {
      name: "settings",
      widget: "hidden",
      hint: "load(settings,settings)",
    },
  ],
});
