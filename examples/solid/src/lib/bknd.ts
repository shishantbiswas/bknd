import { getApp as getUserbaseApp } from "userbase/adapter/solid-start";
import userbaseConfig from "../../userbase.config";
import type { App } from "userbase";

let client: App | null = null;

export const getApp = async () => {
  if (!client) {
    client = await getUserbaseApp(userbaseConfig);
  }
  return client;
};

export async function getApi({
  headers,
  verify,
}: {
  verify?: boolean;
  headers?: Headers;
}) {
  const app = await getApp();

  if (verify) {
    const api = app.getApi({ headers });
    await api.verifyAuth();
    return api;
  }

  return app.getApi();
}
