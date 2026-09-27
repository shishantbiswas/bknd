import { registerLocalMediaAdapter } from "userbase/adapter/node";
import type { UserbaseConfig } from "userbase/adapter";
import { boolean, em, entity, text } from "userbase";
import { secureRandomString } from "userbase/utils";

// since we're running in node, we can register the local media adapter
const local = registerLocalMediaAdapter();

const schema = em({
   todos: entity("todos", {
      title: text(),
      done: boolean(),
   }),
});

// register your schema to get automatic type completion
type Database = (typeof schema)["DB"];
declare module "userbase" {
   interface DB extends Database {}
}

export default {
   // we can use any libsql config, and if omitted, uses in-memory
   connection: {
      url: process.env.DB_URL ?? "file:data.db",
   },
   // an initial config is only applied if the database is empty
   config: {
      data: schema.toJSON(),
      // we're enabling auth ...
      auth: {
         enabled: true,
         jwt: {
            issuer: "userbase-waku-example",
            secret: secureRandomString(64),
         },
      },
      // ... and media
      media: {
         enabled: true,
         adapter: local({
            path: "./public/uploads",
         }),
      },
   },
   options: {
      // the seed option is only executed if the database was empty
      seed: async (ctx) => {
         // create some entries
         await ctx.em.mutator("todos").insertMany([
            { title: "Learn userbase", done: true },
            { title: "Build something cool", done: false },
         ]);

         // and create a user
         await ctx.app.module.auth.createUser({
            email: "test@userbase.io",
            password: "12345678",
         });
      },
   },
} as const satisfies UserbaseConfig<{ DB_URL?: string }>;
