import type { APIContext } from "astro";
import { serve } from "userbase/adapter/astro";
import { config } from "../../userbase";

export const prerender = false;
export const ALL = serve<APIContext>(config);
