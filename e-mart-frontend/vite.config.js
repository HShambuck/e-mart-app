import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@components": path.resolve(import.meta.dirname, "./src/components"),
      "@pages": path.resolve(import.meta.dirname, "./src/pages"),
      "@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
      "@context": path.resolve(import.meta.dirname, "./src/context"),
      "@utils": path.resolve(import.meta.dirname, "./src/utils"),
      "@api": path.resolve(import.meta.dirname, "./src/api"),
      "@assets": path.resolve(import.meta.dirname, "./src/assets"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
