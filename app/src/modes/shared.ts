import type { AppPlugin, UserbaseConfig, MaybePromise, Merge } from "userbase";
import { syncTypes, syncConfig } from "userbase/plugins";
import { syncSecrets } from "plugins/dev/sync-secrets.plugin";
import { $console } from "userbase/utils";

export type UserbaseModeOptions = {
   /**
    * Whether the application is running in production.
    */
   isProduction?: boolean;
   /**
    * Writer function to write the configuration to the file system
    */
   writer?: (path: string, content: string) => MaybePromise<void>;
   /**
    * Configuration file path
    */
   configFilePath?: string;
   /**
    * Types file path
    * @default "userbase-types.d.ts"
    */
   typesFilePath?: string;
   /**
    * Syncing secrets options
    */
   syncSecrets?: {
      /**
       * Whether to enable syncing secrets
       */
      enabled?: boolean;
      /**
       * Output file path
       */
      outFile?: string;
      /**
       * Format of the output file
       * @default "env"
       */
      format?: "json" | "env";
      /**
       * Whether to include secrets in the output file
       * @default false
       */
      includeSecrets?: boolean;
   };
   /**
    * Determines whether to automatically sync the schema if not in production.
    * @default true
    */
   syncSchema?: boolean | { force?: boolean; drop?: boolean };
};

export type UserbaseModeConfig<Args = any, Additional = {}> = UserbaseConfig<
   Args,
   Merge<UserbaseModeOptions & Additional>
>;

function _isProd() {
   try {
      return process.env.NODE_ENV === "production";
   } catch (_e) {
      return false;
   }
}

export async function makeModeConfig<
   Args = any,
   Config extends UserbaseModeConfig<Args> = UserbaseModeConfig<Args>,
>({ app, ..._config }: Config, args: Args) {
   const appConfig = typeof app === "function" ? await app(args) : app;

   const config = {
      ..._config,
      ...appConfig,
   } as Omit<Config, "app">;

   if (typeof config.isProduction !== "boolean") {
      $console.warn(
         "You should set `isProduction` option when using managed modes to prevent accidental issues with writing plugins and syncing schema. As fallback, it is set to",
         _isProd(),
      );
   }

   let needsWriter = false;

   const { typesFilePath, configFilePath, writer, syncSecrets: syncSecretsOptions } = config;

   const isProd = config.isProduction ?? _isProd();
   const plugins = config?.options?.plugins ?? ([] as AppPlugin[]);
   const syncFallback = typeof config.syncSchema === "boolean" ? config.syncSchema : !isProd;
   const syncSchemaOptions =
      typeof config.syncSchema === "object"
         ? config.syncSchema
         : {
              force: syncFallback,
              drop: syncFallback,
           };

   if (!isProd) {
      if (typesFilePath) {
         if (plugins.some((p) => p.name === "userbase-sync-types")) {
            throw new Error("You have to unregister the `syncTypes` plugin");
         }
         needsWriter = true;
         plugins.push(
            syncTypes({
               enabled: true,
               includeFirstBoot: true,
               write: async (et) => {
                  try {
                     await config.writer?.(typesFilePath, et.toString());
                  } catch (e) {
                     console.error(`Error writing types to"${typesFilePath}"`, e);
                  }
               },
            }) as any,
         );
      }

      if (configFilePath) {
         if (plugins.some((p) => p.name === "userbase-sync-config")) {
            throw new Error("You have to unregister the `syncConfig` plugin");
         }
         needsWriter = true;
         plugins.push(
            syncConfig({
               enabled: true,
               includeFirstBoot: true,
               write: async (config) => {
                  try {
                     await writer?.(configFilePath, JSON.stringify(config, null, 2));
                  } catch (e) {
                     console.error(`Error writing config to "${configFilePath}"`, e);
                  }
               },
            }) as any,
         );
      }

      if (syncSecretsOptions && syncSecretsOptions.enabled !== false) {
         if (plugins.some((p) => p.name === "userbase-sync-secrets")) {
            throw new Error("You have to unregister the `syncSecrets` plugin");
         }

         let outFile = syncSecretsOptions.outFile;
         const format = syncSecretsOptions.format ?? "env";
         if (!outFile) {
            outFile = ["env", !syncSecretsOptions.includeSecrets && "example", format]
               .filter(Boolean)
               .join(".");
         }

         needsWriter = true;
         plugins.push(
            syncSecrets({
               enabled: true,
               includeFirstBoot: true,
               write: async (secrets) => {
                  const values = Object.fromEntries(
                     Object.entries(secrets).map(([key, value]) => [
                        key,
                        syncSecretsOptions.includeSecrets ? value : "",
                     ]),
                  );

                  try {
                     if (format === "env") {
                        await writer?.(
                           outFile,
                           Object.entries(values)
                              .map(([key, value]) => `${key}=${value}`)
                              .join("\n"),
                        );
                     } else {
                        await writer?.(outFile, JSON.stringify(values, null, 2));
                     }
                  } catch (e) {
                     console.error(`Error writing secrets to "${outFile}"`, e);
                  }
               },
            }) as any,
         );
      }
   }

   if (needsWriter && typeof config.writer !== "function") {
      $console.warn("You must set a `writer` function, attempts to write will fail");
   }

   return {
      config,
      isProd,
      plugins,
      syncSchemaOptions,
   };
}
