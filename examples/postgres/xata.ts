import { serve } from "userbase/adapter/bun";
import { createCustomPostgresConnection } from "userbase";
import { XataDialect } from "@xata.io/kysely";
import { buildClient } from "@xata.io/client";

const client = buildClient();
const xataClient = new client({
   databaseURL: process.env.XATA_URL,
   apiKey: process.env.XATA_API_KEY,
   branch: process.env.XATA_BRANCH,
});

const xata = createCustomPostgresConnection("xata", XataDialect, {
   supports: {
      batching: false,
   },
});

export default serve({
   connection: xata(xataClient),
   // ignore this, it's only required within this repository
   // because userbase is installed via "workspace:*"
   distPath: "../../../app/dist",
});
