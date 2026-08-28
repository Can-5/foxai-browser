import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./",
  root: path.resolve(__dirname, "newtab"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "newtab/src"),
    },
  },
  build: {
    outDir: "../dist-newtab",
    emptyOutDir: true,
    assetsDir: "assets",
    minify: "esbuild",
    target: "es2020",
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "newtab/index.html"),
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    esbuild: {
      drop: ["console", "debugger"],
      pure: ["console.log", "console.debug", "console.info"],
      legalComments: "none",
    },
  },
  esbuild: {
    logLevel: "silent",
  },
});
