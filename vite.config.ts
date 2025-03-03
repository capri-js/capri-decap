import { defineConfig } from "vite";
import capri from "@capri-js/react";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";

import { collections } from "./src/collections/index.js";
import { listAllPaths } from "./src/decap-utils";

export default defineConfig({
  resolve: {
    alias: {
      "lodash-es": "lodash",
      "lodash-es/(.*)": "lodash/$1",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    capri({
      createIndexFiles: false,
      inlineCss: true,
      prerender: () => listAllPaths(collections),
      spa: "/admin",
    }),
    optimizeLodashImports(),
  ],
});
