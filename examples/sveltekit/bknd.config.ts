import type { SvelteKitUserbaseConfig } from "userbase/adapter/sveltekit";
import { em, entity, text, libsql } from "userbase";
import { createClient } from "@libsql/client";

const schema = em({
  todos: entity("todos", {
    title: text().required(),
    done: text(),
  }),
});

export default {
  connection: libsql(
    createClient({
      url: "file:data.db",
    })
  ),
  config: {
    data: schema.toJSON(),
    auth: {
      enabled: true,
      allow_register: true,
      jwt: {
        issuer: "userbase-sveltekit-example",
        secret: "dev-secret-change-in-production-1234567890abcdef",
      },
      roles: {
        admin: {
          implicit_allow: true,
        },
        default: {
          permissions: ["data.entity.read", "data.entity.create"],
          is_default: true,
        },
      },
    },
  },
  adminOptions: {
    // this path must be the same as in `hooks.server.ts`
    adminBasepath: "/admin"
  },
  options: {
    seed: async (ctx) => {
      await ctx.app.module.auth.createUser({
        email: "admin@example.com",
        password: "password",
        role: "admin",
      });

      await ctx.em.mutator("todos").insertMany([
        { title: "Learn userbase", done: "true" },
        { title: "Build with SvelteKit", done: "false" },
      ]);
    },
  },
} as const satisfies SvelteKitUserbaseConfig;
