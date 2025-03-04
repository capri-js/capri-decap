import { field } from "../../decaprio";

export default field({
  label: "Posts Grid",
  name: "PostsGrid",
  widget: "object",
  fields: [
    {
      label: "Headline",
      name: "headline",
      widget: "string",
      required: false,
    },
    {
      name: "posts",
      widget: "hidden",
      hint: "loadAll(posts)",
    },
  ],
});
