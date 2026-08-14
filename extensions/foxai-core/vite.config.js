import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  root: "newtab",
  plugins: [react()],
  build: {
    outDir: "../dist-newtab",
    emptyOutDir: true,
    assetsDir: "assets",
  },
});
