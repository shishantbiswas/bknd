import { createRuntimeApp, type RuntimeUserbaseConfig } from "userbase/adapter";

export type NuxtEnv = NodeJS.ProcessEnv;
export type NuxtUserbaseConfig<Env = NuxtEnv> = RuntimeUserbaseConfig<Env>;

/**
 * Get userbase app instance
 * @param config - userbase configuration
 * @param args - environment variables
 */
export async function getApp<Env>(
   config: NuxtUserbaseConfig<Env> = {} as NuxtUserbaseConfig<Env>,
   args: Env,
) {
   return await createRuntimeApp(config, args);
}

/**
 * Create middleware handler for Nuxt
 * @param config - userbase configuration
 * @param args - environment variables
 */
export function serve<Env>(config: NuxtUserbaseConfig<Env> = {} as NuxtUserbaseConfig<Env>, args: Env) {
   return async (request: Request) => {
      return (await getApp(config, args)).fetch(request);
   };
}
