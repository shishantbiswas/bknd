import { serve } from "userbase/adapter/nuxt";
import config from "../../userbase.config";

export default defineEventHandler(async (event) => {
  const pathname = event.path
  const request = toWebRequest(event);

  if (pathname.startsWith("/api") || pathname !== "/") {
    const res = await serve(config, process.env)(request);

    if (res && res.status !== 404) {
      return res;
    }
  }
});
