import { McpClient, type McpClientConfig } from "jsonv-ts/mcp";
import { useApi } from "userbase/client";
import { useUserbase } from "ui/client/userbase";

const clients = new Map<string, McpClient>();

export function getClient(opts: McpClientConfig) {
   if (!clients.has(JSON.stringify(opts))) {
      clients.set(JSON.stringify(opts), new McpClient(opts));
   }
   return clients.get(JSON.stringify(opts))!;
}

export function useMcpClient() {
   const { config } = useUserbase();
   const api = useApi();
   const token = api.getAuthState().token;
   const headers =
      api.token_transport === "header" && token ? { Authorization: `Bearer ${token}` } : undefined;

   return getClient({
      url: window.location.origin + config.server.mcp.path,
      fetch: api.fetcher,
      headers,
   });
}
