import { type NuxtUserbaseConfig, getApp as getNuxtApp } from "userbase/adapter/nuxt";
import userbaseConfig from "../../userbase.config";

export async function getApp<Env = NodeJS.ProcessEnv>(
   config: NuxtUserbaseConfig<Env>,
   args: Env = process.env as Env,
) {
   return await getNuxtApp(config, args);
}

export async function getApi({ headers, verify }: { verify?: boolean; headers?: Headers }) {
   const app = await getApp(userbaseConfig, process.env);

   if (verify) {
      const api = app.getApi({ headers });
      await api.verifyAuth();
      return api;
   }

   return app.getApi();
}
