import type { AstroGlobal } from "astro";
import { getApp as getUserbaseApp } from "userbase/adapter/astro";
import config from "../userbase.config";

export { config };

export async function getApp() {
   return await getUserbaseApp(config);
}

export async function getApi(
   astro: AstroGlobal,
   opts?: { mode: "static" } | { mode?: "dynamic"; verify?: boolean },
) {
   const app = await getApp();
   if (opts?.mode !== "static" && opts?.verify) {
      const api = app.getApi({ headers: astro.request.headers });
      await api.verifyAuth();
      return api;
   }

   return app.getApi();
}
