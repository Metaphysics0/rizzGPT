import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/lib/paraglide",
        strategy: ["url", "cookie", "baseLocale"],
      }),
      sveltekit(),
      tailwindcss(),
    ],
    server: {
      allowedHosts: [
        "bitter-oranges-taste.loca.lt", // replace with your localtunnel domain
      ],
    },
    optimizeDeps: {
      include: ["bits-ui"],
    },
    ssr: {
      noExternal: ["bits-ui"],
    },
  };
});
