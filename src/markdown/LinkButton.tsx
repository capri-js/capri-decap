import { editorComponent } from "decaprio";
import { IconButton } from "../components/Button";

export default editorComponent({
  id: "LinkButton",
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
  toPreview: ({ label, link }) => (
    <IconButton as="a" href={link}>
      {label}
    </IconButton>
  ),
});
