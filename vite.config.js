import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = env.TMDB_BEARER_TOKEN || env.VITE_TMDB_BEARER_TOKEN || "";

  return {
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          movie: resolve(__dirname, "movie.html"),
          search: resolve(__dirname, "search.html")
        }
      }
    },
    server: token
      ? {
          proxy: {
            "/api/tmdb": {
              target: "https://api.themoviedb.org/3",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/tmdb/, ""),
              configure: (proxy) => {
                proxy.on("proxyReq", (proxyReq) => {
                  proxyReq.setHeader("Accept", "application/json");
                  proxyReq.setHeader("Authorization", `Bearer ${token}`);
                });
              }
            }
          }
        }
      : undefined
  };
});
