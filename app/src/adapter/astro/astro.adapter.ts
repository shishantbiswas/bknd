import { type FrameworkUserbaseConfig, createFrameworkApp } from "userbase/adapter";

type AstroEnv = NodeJS.ProcessEnv;
type TAstro = {
   request: Request;
};
export type AstroUserbaseConfig<Env = AstroEnv> = FrameworkUserbaseConfig<Env>;

export async function getApp<Env = AstroEnv>(
   config: AstroUserbaseConfig<Env> = {},
   args: Env = import.meta.env as Env,
) {
   return await createFrameworkApp(config, args);
}

export function serve<Env = AstroEnv>(
   config: AstroUserbaseConfig<Env> = {},
   args: Env = import.meta.env as Env,
) {
   return async (fnArgs: TAstro) => {
      return (await getApp(config, args)).fetch(fnArgs.request);
   };
}
