import { defineConfig } from "vite";
import capri from "@capri-js/react";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";

import { registry } from "./src/collections";
import { listAllPaths } from "./src/decaprio/server";

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
      prerender: () => listAllPaths(registry),
      spa: "/admin",
    }),
    optimizeLodashImports(),
  ],
});
