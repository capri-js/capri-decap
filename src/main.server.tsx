import { decaprio } from "./content";
import { createRenderFunction } from "./decaprio/server";
import "./main.css";

export const render = createRenderFunction(decaprio);
