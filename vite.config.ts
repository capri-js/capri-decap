import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { decaprio } from "decaprio/vite";

import { registry } from "./src/collections";

export default defineConfig({
  plugins: [
    tailwindcss(),
    decaprio({
      registry,
    }),
  ],
});
