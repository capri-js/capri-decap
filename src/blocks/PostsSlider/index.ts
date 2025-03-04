import { field } from "../../decaprio";

export default field({
  label: "Posts Slider",
  name: "PostsSlider",
  widget: "object",
  fields: [
    { label: "Headline", name: "headline", widget: "string" },
    {
      // This hidden field is used to trigger the transformation and inline all projects here
      name: "posts",
      widget: "hidden",
      hint: "loadAll(posts)",
    },
  ],
});
