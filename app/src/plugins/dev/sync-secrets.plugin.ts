import { type App, ModuleManagerEvents, type AppPlugin } from "userbase";

export type SyncSecretsOptions = {
   enabled?: boolean;
   includeFirstBoot?: boolean;
   write: (secrets: Record<string, any>) => Promise<void>;
};

export function syncSecrets({
   enabled = true,
   includeFirstBoot = false,
   write,
}: SyncSecretsOptions): AppPlugin {
   let firstBoot = true;
   return (app: App) => ({
      name: "userbase-sync-secrets",
      onBuilt: async () => {
         if (!enabled) return;
         const manager = app.modules;

         app.emgr.onEvent(
            ModuleManagerEvents.ModuleManagerSecretsExtractedEvent,
            async ({ params: { secrets } }) => {
               await write?.(secrets);
            },
            {
               id: "sync-secrets",
            },
         );

         if (firstBoot && includeFirstBoot) {
            firstBoot = false;
            await write?.(manager.extractSecrets().secrets);
         }
      },
   });
}
