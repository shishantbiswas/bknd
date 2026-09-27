import { createRuntimeApp, serveStaticViaImport } from "userbase/adapter";

const app = await createRuntimeApp({
   connection: {
      url: "file:./data.db",
   },
   serveStatic: serveStaticViaImport(),
});

export default {
   fetch: app.fetch,
};
