import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const API =
    env.VITE_API_URL || "http://localhost:5000";

  return {
    plugins: [
      react(),
      tailwindcss(),
      basicSsl(),
    ],

    server: {
      host: "0.0.0.0",
      port: 5173,

      proxy: {
        "/api": {
          target: API,
          changeOrigin: true,
        },

        "/socket.io": {
          target: API,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
});