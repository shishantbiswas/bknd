import path from "node:path";
import { type RuntimeUserbaseConfig, createRuntimeApp } from "userbase/adapter";
import { registerLocalMediaAdapter } from ".";
import { config, type App } from "userbase";
import { serveStatic } from "hono/bun";

type BunEnv = Bun.Env;
export type BunUserbaseConfig<Env = BunEnv> = RuntimeUserbaseConfig<Env> &
   Omit<Bun.Serve.Options<undefined, string>, "fetch">;

export async function createApp<Env = BunEnv>(
   { distPath, serveStatic: _serveStatic, ...config }: BunUserbaseConfig<Env> = {},
   args: Env = Bun.env as Env,
) {
   const root = path.resolve(distPath ?? "./node_modules/userbase/dist", "static");
   registerLocalMediaAdapter();

   return await createRuntimeApp(
      {
         serveStatic:
            _serveStatic ??
            serveStatic({
               root,
            }),
         ...config,
      },
      args,
   );
}

export function createHandler<Env = BunEnv>(
   config: BunUserbaseConfig<Env> = {},
   args: Env = Bun.env as Env,
) {
   let app: App | undefined;
   return async (req: Request) => {
      if (!app) {
         app = await createApp(config, args);
      }
      return app.fetch(req);
   };
}

export function serve<Env = BunEnv>(
   {
      app,
      distPath,
      connection,
      config: _config,
      options,
      port = config.server.default_port,
      onBuilt,
      buildConfig,
      adminOptions,
      serveStatic,
      beforeBuild,
      ...serveOptions
   }: BunUserbaseConfig<Env> = {},
   args: Env = Bun.env as Env,
) {
   Bun.serve({
      ...(serveOptions as any),
      port,
      fetch: createHandler(
         {
            app,
            connection,
            config: _config,
            options,
            onBuilt,
            buildConfig,
            adminOptions,
            distPath,
            serveStatic,
            beforeBuild,
         },
         args,
      ),
   });

   console.info(`Server is running on http://localhost:${port}`);
}
