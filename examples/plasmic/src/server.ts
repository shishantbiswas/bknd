import { serve } from "userbase/adapter/vite";
import { App, boolean, em, entity, text } from "userbase";
import { secureRandomString } from "userbase/utils";

export default serve({
   config: {
      data: em({
         todos: entity("todos", {
            title: text(),
            done: boolean(),
         }),
      }).toJSON(),
      auth: {
         enabled: true,
         jwt: {
            secret: secureRandomString(64),
         },
      },
   },
   options: {
      seed: async (ctx) => {
         await ctx.em.mutator("todos" as any).insertMany([
            { title: "Learn userbase", done: true },
            { title: "Build something cool", done: false },
         ]);
      },
   },
   // here we can hook into the app lifecycle events ...
   beforeBuild: async (app) => {
      app.emgr.onEvent(
         App.Events.AppFirstBoot,
         async () => {
            // ... to create an initial user
            await app.module.auth.createUser({
               email: "ds@userbase.io",
               password: "12345678",
            });
         },
         "sync",
      );
   },
});
