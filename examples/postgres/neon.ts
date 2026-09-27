import { serve } from "userbase/adapter/bun";
import { createCustomPostgresConnection } from "userbase";
import { NeonDialect } from "kysely-neon";

const neon = createCustomPostgresConnection("neon", NeonDialect);

export default serve({
   connection: neon({
      connectionString: process.env.NEON,
   }),
   // ignore this, it's only required within this repository
   // because userbase is installed via "workspace:*"
   distPath: "../../app/dist",
});
