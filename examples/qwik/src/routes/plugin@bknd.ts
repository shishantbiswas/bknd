import type { RequestHandler } from "@builder.io/qwik-city";
import { serveRuntime } from "bknd/adapter/meta";
import bkndConfig from "../../bknd.config";
import type { EnvGetter } from "@builder.io/qwik-city/middleware/request-handler";

const handler = async (env: EnvGetter, request: Request) => serveRuntime(bkndConfig, env)(request);

export const onRequest: RequestHandler = async ({
  env,
  url,
  next,
  status,
  headers,
  request,
  redirect,
  getWritableStream,
}) => {
  const pathname = url.pathname;

  if (pathname.startsWith("/api") || pathname !== "/") {
    const response = await handler(env, request);

    // skips unknown paths
    if (response.status === 404) {
      await next();
      return;
    }

    // adds the set-cookie header
    response.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    // for redirect
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        throw redirect(response.status as any, location);
      }
    }

    // stream back the body
    status(response.status);
    if (response.body) {
      await response.body?.pipeTo(getWritableStream());
      return;
    }
  }
};
