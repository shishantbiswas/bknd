import { useUserbase } from "ui/client/userbase";
import { useTheme } from "ui/client/use-theme";

export function useUserbaseSystem() {
   const { config, schema, actions: userbaseActions } = useUserbase();
   const { theme } = useTheme();

   const actions = {
      theme: {
         set: async (scheme: "light" | "dark") => {
            return await userbaseActions.patch("server", "admin", {
               color_scheme: scheme,
            });
         },
         toggle: async () => {
            return await userbaseActions.patch("server", "admin", {
               color_scheme: theme === "light" ? "dark" : "light",
            });
         },
      },
   };
   const $system = {};

   return {
      $system,
      config: config.server,
      schema: schema.server,
      theme,
      actions,
   };
}
