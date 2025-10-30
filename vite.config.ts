import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://13.62.48.80:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://13.62.48.80:5000",
        changeOrigin: true,
      },
    },
  },
});
