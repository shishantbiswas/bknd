import { getRuntimeApp as getApp } from "bknd/adapter/meta";
import bkndConfig from "../../bknd.config";

export async function getApi({ headers, verify }: { verify?: boolean; headers?: Headers }) {
   const app = await getApp(bkndConfig, process.env);

   if (verify) {
      const api = app.getApi({ headers });
      await api.verifyAuth();
      return api;
   }

   return app.getApi();
}
