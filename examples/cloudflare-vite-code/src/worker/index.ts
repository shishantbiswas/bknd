import { serve } from "userbase/adapter/cloudflare";
import config from "../../config.ts";

export default serve(config, () => ({
   // since userbase is running code-only, we can use a pre-initialized app instance if available
   warm: true,
}));
