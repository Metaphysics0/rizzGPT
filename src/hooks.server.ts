import { type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (isChromeDevToolsRequest(event.url)) {
    return new Response(null, { status: 204 });
  }

  return await resolve(event);
};

function isChromeDevToolsRequest(url: URL) {
  return url.pathname.startsWith(
    "/.well-known/appspecific/com.chrome.devtools"
  );
}

