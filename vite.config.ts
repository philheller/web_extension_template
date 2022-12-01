import { defineConfig } from "vite";
// plugins
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
// extension details
import manifest from "./manifest.config";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        welcome: resolve(__dirname, "src", "welcome", "index.html"),
        popup: resolve(__dirname, "src", "popup", "index.html"),
      },
    },
  },
});
