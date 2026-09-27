import { serveStatic } from "@hono/node-server/serve-static";
import { type DevServerOptions, default as honoViteDevServer } from "@hono/vite-dev-server";
import type { App } from "userbase";
import { type RuntimeUserbaseConfig, createRuntimeApp } from "userbase/adapter";
import { registerLocalMediaAdapter } from "userbase/adapter/node";
import { devServerConfig } from "./dev-server-config";
import type { MiddlewareHandler } from "hono";

export type ViteEnv = NodeJS.ProcessEnv;
export type ViteUserbaseConfig<Env = ViteEnv> = RuntimeUserbaseConfig<Env> & {
   serveStatic?: false | MiddlewareHandler;
};

export function addViteScript(html: string, addUserbaseContext: boolean = true) {
   return html.replace(
      "</head>",
      `<script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="/@vite/client"></script>
${addUserbaseContext ? "<!-- BKND_CONTEXT -->" : ""}
</head>`,
   );
}

async function createApp<ViteEnv>(
   config: ViteUserbaseConfig<ViteEnv> = {},
   env: ViteEnv = {} as ViteEnv,
): Promise<App> {
   registerLocalMediaAdapter();
   return await createRuntimeApp(
      {
         ...config,
         adminOptions: config.adminOptions ?? {
            forceDev: {
               mainPath: "/src/main.tsx",
            },
         },
         serveStatic: config.serveStatic || [
            "/assets/*",
            serveStatic({ root: config.distPath ?? "./" }),
         ],
      },
      env,
   );
}

export function serve<ViteEnv>(config: ViteUserbaseConfig<ViteEnv> = {}, args?: ViteEnv) {
   return {
      async fetch(request: Request, env: any, ctx: ExecutionContext) {
         const app = await createApp(config, env);
         return app.fetch(request, env, ctx);
      },
   };
}

export function devServer(options: DevServerOptions) {
   return honoViteDevServer({
      ...devServerConfig,
      ...options,
   });
}
