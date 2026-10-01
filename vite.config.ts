import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "process.env": JSON.stringify(env),
      "process.env.MONGODB_API_KEY": JSON.stringify(env.MONGODB_API_KEY),
      "process.env.MONGODB_API_URL": JSON.stringify(env.MONGODB_API_URL),
      "process.env.MONGODB_DATABASE": JSON.stringify(env.MONGODB_DATABASE),
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
    server: {
      port: 5173,
      strictPort: false,
      allowedHosts: true,
      middlewareMode: false,
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 5173,
        overlay: false // disable overlay if dev errors are too noisy
      }
    },
    build: {
      target: "ES2020",
      chunkSizeWarningLimit: 5000,
      rollupOptions: {
        external: ["hono"],
      },
    },
    ssr: {
      external: ["hono"],
    },
  };
});