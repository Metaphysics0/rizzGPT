import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [sveltekit(), tailwindcss()],
    server: {
      allowedHosts: ["https://crazy-ends-go.loca.lt"],
    },
  };
});
