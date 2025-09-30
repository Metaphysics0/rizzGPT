import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    csrf: {
      trustedOrigins: [
        "https://gumroad.com",
        "https://api.gumroad.com",
        "https://webhooks.gumroad.com",
        "https://bitter-olives-wave.loca.lt", // replace with your localtunnel domain (for gumroad webook testing)
      ],
    },
  },
};

export default config;
