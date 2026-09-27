import { em, entity, text, boolean } from "userbase";
import { secureRandomString } from "userbase/utils";
import type { SolidStartUserbaseConfig } from "userbase/adapter/solid-start";

const schema = em({
  todos: entity("todos", {
    title: text(),
    done: boolean(),
  }),
});

// register your schema to get automatic type completion
type Database = (typeof schema)["DB"];
declare module "userbase" {
  interface DB extends Database { }
}

export default {
  connection: { url: "file:data.db" },
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
  config: {
    data: schema.toJSON(),
    auth: {
      enabled: true,
      jwt: {
        secret: secureRandomString(32),
      },
    },
  },
  adminOptions: {
    adminBasepath: "/admin",
    assetsPath: "/admin/",
    logoReturnPath: "../..",
  },
} satisfies SolidStartUserbaseConfig;

