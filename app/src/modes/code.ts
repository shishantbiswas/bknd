import type { UserbaseConfig } from "userbase/adapter";
import { makeModeConfig, type UserbaseModeConfig } from "./shared";
import { $console } from "userbase/utils";

export type UserbaseCodeModeConfig<Args = any> = UserbaseModeConfig<Args>;

export type CodeMode<AdapterConfig extends UserbaseConfig> = AdapterConfig extends UserbaseConfig<
   infer Args
>
   ? UserbaseModeConfig<Args, AdapterConfig>
   : never;

export function code<
   Config extends UserbaseConfig,
   Args = Config extends UserbaseConfig<infer A> ? A : unknown,
>(codeConfig: CodeMode<Config>): UserbaseConfig<Args> {
   return {
      ...codeConfig,
      app: async (args) => {
         const {
            config: appConfig,
            plugins,
            isProd,
            syncSchemaOptions,
         } = await makeModeConfig(codeConfig, args);

         if (appConfig?.options?.mode && appConfig?.options?.mode !== "code") {
            $console.warn("You should not set a different mode than `db` when using code mode");
         }

         return {
            ...appConfig,
            options: {
               ...appConfig?.options,
               mode: "code",
               plugins,
               manager: {
                  // skip validation in prod for a speed boost
                  skipValidation: isProd,
                  onModulesBuilt: async (ctx) => {
                     if (!isProd && syncSchemaOptions.force) {
                        $console.log("[code] syncing schema");
                        await ctx.em.schema().sync(syncSchemaOptions);
                     }
                  },
                  ...appConfig?.options?.manager,
               },
            },
         };
      },
   };
}
