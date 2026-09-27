import type { TAppMediaConfig } from "media/media-schema";
import { useUserbase } from "ui/client/UserbaseProvider";

export function useUserbaseMedia() {
   const { config, schema, actions: userbaseActions } = useUserbase();

   const actions = {
      config: {
         patch: async (data: Partial<TAppMediaConfig>) => {
            if (await userbaseActions.set("media", data, true)) {
               await userbaseActions.reload();
               return true;
            }

            return false;
         },
      },
   };
   const $media = {};

   return {
      $media,
      config: config.media,
      schema: schema.media,
      actions,
   };
}
