import { getApp as getUserbaseApp } from "userbase/adapter/react-router";
import config from "../userbase.config";

export async function getApp() {
   return await getUserbaseApp(config, process.env as any);
}

export async function getApi(args?: { request: Request }, opts?: { verify?: boolean }) {
   const app = await getApp();
   if (opts?.verify) {
      const api = app.getApi({ headers: args?.request.headers });
      await api.verifyAuth();
      return api;
   }

   return app.getApi();
}
