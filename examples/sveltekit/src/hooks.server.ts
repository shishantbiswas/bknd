import type { Handle } from "@sveltejs/kit";
import { serve } from "userbase/adapter/sveltekit";
import { env } from "$env/dynamic/private";
import config from "../userbase.config";

const userbaseHandler = serve(config, env);

export const handle: Handle = async ({ event, resolve }) => {
  // Handle userbase API requests
  const pathname = event.url.pathname;
  if (pathname.startsWith("/api/") || pathname.startsWith("/admin")) {
    const res = await userbaseHandler(event);
    if (res.status !== 404) {
      return res;
    }
  }

  return resolve(event);
};
