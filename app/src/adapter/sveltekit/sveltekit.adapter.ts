import { createRuntimeApp, type RuntimeUserbaseConfig } from "userbase/adapter";

type TSvelteKit = {
   request: Request;
};

export type SvelteKitUserbaseConfig<Env> = Pick<RuntimeUserbaseConfig<Env>, "adminOptions">;

/**
 * Get userbase app instance
 * @param config - userbase configuration
 * @param args - environment variables (use $env/dynamic/private for universal runtime support)
 */
export async function getApp<Env>(
   config: SvelteKitUserbaseConfig<Env> = {} as SvelteKitUserbaseConfig<Env>,
   args: Env,
) {
   return await createRuntimeApp(config, args);
}

/**
 * Create request handler for hooks.server.ts
 * @param config - userbase configuration
 * @param args - environment variables (use $env/dynamic/private for universal runtime support)
 */
export function serve<Env>(
   config: SvelteKitUserbaseConfig<Env> = {} as SvelteKitUserbaseConfig<Env>,
   args: Env,
) {
   return async (fnArgs: TSvelteKit) => {
      return (await getApp(config, args)).fetch(fnArgs.request);
   };
}
