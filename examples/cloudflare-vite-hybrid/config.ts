/// <reference types="./worker-configuration.d.ts" />

import { devFsWrite, type CloudflareUserbaseConfig } from "userbase/adapter/cloudflare";
import { hybrid } from "userbase/modes";

export default hybrid<CloudflareUserbaseConfig>({
   // normally you would use e.g. `readFile` from `node:fs/promises`, however, cloudflare using vite plugin removes all Node APIs, therefore we need to use the module system to import the config file
   reader: async () => {
      return (await import("./userbase-config.json").then((module) => module.default)) as any;
   },
   // a writer is required to sync the types and config. We're using a vite plugin that proxies writing files (since Node APIs are not available)
   writer: devFsWrite,
   // the generated types are loaded using our tsconfig, and is automatically available in all userbase APIs
   typesFilePath: "./userbase-types.d.ts",
   // on every change, this config file is updated. When it's time to deploy, this will be inlined into your worker
   configFilePath: "./userbase-config.json",
   // secrets will always be extracted from the configuration, we're writing an example env file to know which secrets we need to provide prior to deploying
   syncSecrets: {
      enabled: true,
      outFile: ".env.example",
      format: "env",
   } as const,
   app: (env) => ({
      // we need to disable the admin controller using the vite plugin, since we want to render our own app
      adminOptions: false,
      // this is important to determine whether configuration should be read-only, or if the database should be automatically synced
      isProduction: env.ENVIRONMENT === "production",
      // we need to inject the secrets that gets merged into the configuration
      secrets: env,
      options: {
         // the seed option is only executed if the database was empty
         seed: async (ctx) => {
            // create some entries
            await ctx.em.mutator("todos").insertMany([
               { title: "Learn userbase", done: true },
               { title: "Build something cool", done: false },
            ]);

            // and create a user
            await ctx.app.module.auth.createUser({
               email: "test@userbase.io",
               password: "12345678",
            });
         },
      },
   }),
});
