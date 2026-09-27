// To support types
// https://github.com/microsoft/TypeScript/issues/14877

declare const self: ServiceWorkerGlobalScope;

import { App } from "userbase";

async function getUserbase() {
   const userbase = App.create({
      connection: {
         url: "http://localhost:8080"
      }
   });
   await userbase.build();
   return userbase;
}

self.addEventListener("fetch", async (e) => {
   // only intercept api requests
   if (e.request.url.includes("/api/")) {
      e.respondWith(
         (async () => {
            try {
               const userbase = await getUserbase();
               return userbase.fetch(e.request);
            } catch (e) {
               return new Response(e.message, { status: 500 });
            }
         })()
      );
   }
});
