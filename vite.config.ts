import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [sveltekit(), tailwindcss()],
    server: {
      allowedHosts: ["fast-ants-vanish.loca.lt"],
    },
  };
});
