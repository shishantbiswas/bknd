import { serve } from "userbase/adapter/aws";

export const handler = serve({
   // to get local assets, run `npx userbase copy-assets`
   // this is automatically done in `deploy.sh`
   assets: {
      mode: "local",
      root: "./static",
   },
   connection: {
      url: process.env.DB_URL,
      authToken: process.env.DB_TOKEN,
   },
});
