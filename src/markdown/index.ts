import { markdown } from "decaprio";
import linkButton from "./LinkButton";

export const editorComponents = [linkButton];
export const Markdown = markdown(editorComponents);
