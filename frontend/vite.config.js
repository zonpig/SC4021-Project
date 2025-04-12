import  { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/solr": {
        target: "http://localhost:8983",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
            );
          });
        },
      },
    },
  },
  optimizeDeps: {
    include: ["clsx", "tiny-invariant", "fast-equals", "prop-types"],
  },
  resolve: {
    alias: {
      "clsx": path.resolve(__dirname, "node_modules/clsx"),
      "fast-equals": path.resolve(__dirname, "node_modules/fast-equals"),
      "tiny-invariant": path.resolve(__dirname, "node_modules/tiny-invariant"),
      'prop-types': path.resolve(__dirname, 'node_modules/prop-types')
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/], // Include necessary node_modules for CommonJS support
    },
  },
});
