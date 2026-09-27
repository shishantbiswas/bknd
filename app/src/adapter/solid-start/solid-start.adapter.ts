import { createRuntimeApp, type RuntimeUserbaseConfig } from "userbase/adapter";

export type SolidStartEnv = NodeJS.ProcessEnv;
export type SolidStartUserbaseConfig<Env = SolidStartEnv> = RuntimeUserbaseConfig<Env>;

/**
 * Get userbase app instance
 * @param config - userbase configuration
 * @param args - environment variables
 */
export async function getApp<Env = SolidStartEnv>(
   config: SolidStartUserbaseConfig<Env>,
   args: Env = process.env as Env,
) {
   return await createRuntimeApp(config, args);
}

/**
 * Create middleware handler for Solid Start
 * @param config - userbase configuration
 * @param args - environment variables
 */
export function serve<Env = SolidStartEnv>(
   config: SolidStartUserbaseConfig<Env> = {},
   args: Env = process.env as Env,
) {
   return async (req: Request) => {
      const app = await getApp(config, args);
      return app.fetch(req);
   };
}
