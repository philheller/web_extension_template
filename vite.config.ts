import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const root = resolve(__dirname, "src", "html");
const outDir = resolve(__dirname, "dist");

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        options: resolve(root, "options", "index.html"),
        popup: resolve(root, "popup", "index.html"),
      },
    },
  },
});
