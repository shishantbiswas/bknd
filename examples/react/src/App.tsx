import { boolean, em, entity, text } from "userbase";
import { Route } from "wouter";
import IndexPage from "~/routes/_index";
import { UserbaseBrowserApp, type BrowserUserbaseConfig, useApp } from "userbase/adapter/browser";
import { type ReactNode, useEffect } from "react";

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

const config = {
   config: {
      data: schema.toJSON(),
      auth: {
         enabled: true,
         jwt: {
            secret: "secret",
         },
      },
   },
   adminConfig: {
      basepath: "/admin",
      logo_return_path: "/../",
   },
   options: {
      // the seed option is only executed if the database was empty
      seed: async (ctx) => {
         await ctx.em.mutator("todos").insertMany([
            { title: "Learn userbase", done: true },
            { title: "Build something cool", done: false },
         ]);

         // @todo: auth is currently not working due to POST request
         await ctx.app.module.auth.createUser({
            email: "test@userbase.io",
            password: "12345678",
         });
      },
   },
} satisfies BrowserUserbaseConfig;

export default function App() {
   return (
      <UserbaseBrowserApp {...config} header={<Debug />}>
         <Route path="/" component={IndexPage} />
      </UserbaseBrowserApp>
   );
}

const Debug = () => {
   const { app } = useApp();
   useEffect(() => {
      // @ts-ignore
      window.app = app;
   }, [app]);
   return null;
};
