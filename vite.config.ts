import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [sveltekit(), tailwindcss()],
    server: {
      allowedHosts: ["eager-weeks-teach.loca.lt"], // testing webhook
    },
    optimizeDeps: {
      include: ["bits-ui"],
    },
    ssr: {
      noExternal: ["bits-ui"],
    },
  };
});
