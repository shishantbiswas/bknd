import { type BunUserbaseConfig, serve } from "userbase/adapter/bun";

// Actually, all it takes is the following line:
// serve();

// this is optional, if omitted, it uses an in-memory database
const config: BunUserbaseConfig = {
   connection: {
      url: "data.db",
   },
   config: {
      media: {
         enabled: true,
         adapter: {
            type: "local",
            config: { path: "./uploads" },
         },
      },
   },
};

serve(config);
