import type { App } from "userbase";
import { handle } from "hono/aws-lambda";
import { serveStatic } from "@hono/node-server/serve-static";
import { type RuntimeUserbaseConfig, createRuntimeApp } from "userbase/adapter";

type AwsLambdaEnv = object;
export type AwsLambdaUserbaseConfig<Env extends AwsLambdaEnv = AwsLambdaEnv> =
   RuntimeUserbaseConfig<Env> & {
      assets?:
         | {
              mode: "local";
              root: string;
           }
         | {
              mode: "url";
              url: string;
           };
   };

export async function createApp<Env extends AwsLambdaEnv = AwsLambdaEnv>(
   { adminOptions = false, assets, ...config }: AwsLambdaUserbaseConfig<Env> = {},
   args: Env = {} as Env,
): Promise<App> {
   let additional: Partial<RuntimeUserbaseConfig> = {
      adminOptions,
   };

   if (assets?.mode) {
      switch (assets.mode) {
         case "local":
            // @todo: serve static outside app context
            additional = {
               adminOptions: adminOptions === false ? undefined : adminOptions,
               serveStatic: serveStatic({
                  root: assets.root,
                  onFound: (path, c) => {
                     c.res.headers.set("Cache-Control", "public, max-age=31536000");
                  },
               }),
            };
            break;
         case "url":
            additional.adminOptions = {
               ...(typeof adminOptions === "object" ? adminOptions : {}),
               assetsPath: assets.url,
            };
            break;
         default:
            throw new Error("Invalid assets mode");
      }
   }

   return await createRuntimeApp(
      {
         ...config,
         ...additional,
      },
      args ?? process.env,
   );
}

export function serve<Env extends AwsLambdaEnv = AwsLambdaEnv>(
   config: AwsLambdaUserbaseConfig<Env> = {},
   args: Env = {} as Env,
) {
   return async (event) => {
      const app = await createApp(config, args);
      return await handle(app.server)(event);
   };
}

// compatibility with old code
export const serveLambda = serve;
