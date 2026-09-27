import { getApp as getUserbaseApp } from "userbase/adapter/nextjs";
import { headers } from "next/headers";
import config from "../userbase.config";

export { config };

export async function getApp() {
   return await getUserbaseApp(config, process.env);
}

export async function getApi(opts?: { verify?: boolean }) {
   const app = await getApp();
   if (opts?.verify) {
      const api = app.getApi({ headers: await headers() });
      await api.verifyAuth();
      return api;
   }

   return app.getApi();
}
