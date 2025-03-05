import registry from "./collections";
import { createRenderFunction } from "./decaprio/server";
import "./main.css";

export const render = createRenderFunction(registry);
