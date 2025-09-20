import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    csrf: {
      checkOrigin: process.env.NODE_ENV === "development" ? false : true,
      trustedOrigins: [
        "https://gumroad.com",
        "https://api.gumroad.com",
        "https://webhooks.gumroad.com",
        "https://eager-weeks-teach.loca.lt",
      ],
    },
  },
};

export default config;
