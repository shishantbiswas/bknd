import {
   createFrameworkApp,
   createRuntimeApp,
   type FrameworkBkndConfig,
   type RuntimeBkndConfig,
} from "bknd/adapter";

type MetaEnv = NodeJS.ProcessEnv;

export type MetaFrameworkConfig<Env = MetaEnv> = FrameworkBkndConfig<Env>;

/**
 * Get bknd app instance,
 * used for frameworks like nextjs, sveltekit, etc.
 * @param config - bknd configuration
 * @param args - environment variables
 */
export async function getFrameworkApp<Env = MetaEnv>(
   config: MetaFrameworkConfig<Env>,
   args: Env = process.env as Env,
) {
   return await createFrameworkApp(config, args);
};

export type MetaRuntimeConfig<Env = MetaEnv> = RuntimeBkndConfig<Env>;

/**
 * Get bknd app instance,
 * used to create API with Admin UI
 * @param config - bknd configuration
 * @param args - environment variables
 */
export async function getRuntimeApp<Env = MetaEnv>(
   config: MetaRuntimeConfig<Env>,
   args: Env = process.env as Env,
) {
   return await createRuntimeApp(config, args);
};

/**
 * Create request handler for frameworks
 * using getFrameworkApp
 * @param config - bknd configuration
 * @param args - environment variables
 */
export function serveFramework<Env = MetaEnv>(
   config: MetaFrameworkConfig<Env> = {},
   args: Env = process.env as Env,
) {
   return async (req: Request) => {
      const app = (await getFrameworkApp(config, args));
      return app.fetch(req);
   };
}

/**
 * Create request handler for runtime app
 * using getRuntimeApp
 * @param config - bknd configuration
 * @param args - environment variables
 */
export function serveRuntime<Env = MetaEnv>(
   config: MetaRuntimeConfig<Env> = {},
   args: Env = process.env as Env,
) {
   return async (req: Request) => {
      const app = (await getRuntimeApp(config, args));
      return app.fetch(req);
   };
}
