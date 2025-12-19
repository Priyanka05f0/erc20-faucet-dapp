import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    middlewareMode: false,
    setupMiddlewares(middlewares) {
      middlewares.unshift({
        route: "/health",
        handle(req, res) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("OK");
        },
      });
      return middlewares;
    },
  },
});
