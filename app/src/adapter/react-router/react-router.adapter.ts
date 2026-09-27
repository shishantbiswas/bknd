import { type FrameworkUserbaseConfig, createFrameworkApp } from "userbase/adapter";

type ReactRouterEnv = NodeJS.ProcessEnv;
type ReactRouterFunctionArgs = {
   request: Request;
};
export type ReactRouterUserbaseConfig<Env = ReactRouterEnv> = FrameworkUserbaseConfig<Env>;

export async function getApp<Env = ReactRouterEnv>(
   config: ReactRouterUserbaseConfig<Env>,
   args: Env = process.env as Env,
) {
   return await createFrameworkApp(config, args);
}

export function serve<Env = ReactRouterEnv>(
   config: ReactRouterUserbaseConfig<Env> = {},
   args: Env = process.env as Env,
) {
   return async (fnArgs: ReactRouterFunctionArgs) => {
      return (await getApp(config, args)).fetch(fnArgs.request);
   };
}
