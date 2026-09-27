import type { UserbaseConfig } from "userbase/adapter";
import { makeModeConfig, type UserbaseModeConfig } from "./shared";
import { getDefaultConfig, type MaybePromise, type Merge } from "userbase";
import type { DbModuleManager } from "modules/db/DbModuleManager";
import { invariant, $console } from "userbase/utils";

export type UserbaseHybridModeOptions = {
   /**
    * Reader function to read the configuration from the file system.
    * This is required for hybrid mode to work.
    */
   reader?: (path: string) => MaybePromise<string | object>;
   /**
    * Provided secrets to be merged into the configuration
    */
   secrets?: Record<string, any>;
};

export type HybridUserbaseConfig<Args = any> = UserbaseModeConfig<Args, UserbaseHybridModeOptions>;
export type HybridMode<AdapterConfig extends UserbaseConfig> = AdapterConfig extends UserbaseConfig<
   infer Args
>
   ? UserbaseModeConfig<Args, Merge<UserbaseHybridModeOptions & AdapterConfig>>
   : never;

export function hybrid<
   Config extends UserbaseConfig,
   Args = Config extends UserbaseConfig<infer A> ? A : unknown,
>(hybridConfig: HybridMode<Config>): UserbaseConfig<Args> {
   return {
      ...hybridConfig,
      app: async (args) => {
         const {
            config: appConfig,
            isProd,
            plugins,
            syncSchemaOptions,
         } = await makeModeConfig(hybridConfig, args);

         const configFilePath = appConfig.configFilePath ?? "userbase-config.json";

         if (appConfig?.options?.mode && appConfig?.options?.mode !== "db") {
            $console.warn("You should not set a different mode than `db` when using hybrid mode");
         }
         invariant(
            typeof appConfig.reader === "function",
            "You must set a `reader` option when using hybrid mode",
         );

         const fileContent = await appConfig.reader?.(configFilePath);
         let fileConfig = typeof fileContent === "string" ? JSON.parse(fileContent) : fileContent;
         if (!fileConfig) {
            $console.warn("No config found, using default config");
            fileConfig = getDefaultConfig();
            await appConfig.writer?.(configFilePath, JSON.stringify(fileConfig, null, 2));
         }

         return {
            ...(appConfig as any),
            beforeBuild: async (app) => {
               if (app && !isProd) {
                  const mm = app.modules as DbModuleManager;
                  mm.buildSyncConfig = syncSchemaOptions;
               }
               await appConfig.beforeBuild?.(app);
            },
            config: fileConfig,
            options: {
               ...appConfig?.options,
               mode: isProd ? "code" : "db",
               plugins,
               manager: {
                  // skip validation in prod for a speed boost
                  skipValidation: isProd,
                  // secrets are required for hybrid mode
                  secrets: appConfig.secrets,
                  onModulesBuilt: async (ctx) => {
                     if (ctx.flags.sync_required && !isProd && syncSchemaOptions.force) {
                        $console.log("[hybrid] syncing schema");
                        await ctx.em.schema().sync(syncSchemaOptions);
                     }
                     await appConfig?.options?.manager?.onModulesBuilt?.(ctx);
                  },
                  ...appConfig?.options?.manager,
               },
            },
         };
      },
   };
}
