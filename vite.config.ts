import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    server: {
      host: true,
      port: parseInt(process.env.VITE_DOCKER_PORT),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
        app: path.resolve(__dirname, "./src/app/"),
        _Auth: path.resolve(__dirname, "./src/_Auth"),
        shared: path.resolve(__dirname, "./src/app/shared"),
        layout: path.resolve(__dirname, "./src/app/Layout"),
        assets: path.resolve(__dirname, "./src/assets/"),
        context: path.resolve(__dirname, "./src/app/Context"),
        containers: path.resolve(__dirname, "./src/app/containers"),
        services: path.resolve(__dirname, "./src/services"),
        router: path.resolve(__dirname, "./src/Router"),
        static: path.resolve(__dirname, "./src/static"),
        store: path.resolve(__dirname, "./src/store"),
        utils: path.resolve(__dirname, "./src/utils"),
        hooks: path.resolve(__dirname, "./src/Hooks"),
        renderProps: path.resolve(__dirname, "./src/app/RenderProps"),
        middleware: path.resolve(__dirname, "./src/middleware"),
      },
    },
  };
});
