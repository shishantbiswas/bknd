import type { App, AppPlugin } from "userbase";
import { showRoutes as showRoutesHono } from "hono/dev";

export type ShowRoutesOptions = {
   once?: boolean;
};

export function showRoutes({ once = false }: ShowRoutesOptions = {}): AppPlugin {
   let shown = false;
   return (app: App) => ({
      name: "userbase-show-routes",
      onBuilt: () => {
         if (once && shown) return;
         shown = true;
         showRoutesHono(app.server);
      },
   });
}
