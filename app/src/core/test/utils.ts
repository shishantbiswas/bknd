import { Connection, createApp as createAppInternal, type CreateAppConfig } from "userbase";
import { bunSqlite } from "userbase/adapter/bun";
import type { McpServer } from "userbase/utils";

export { App } from "userbase";

export function createApp({ connection, ...config }: CreateAppConfig = {}) {
   return createAppInternal({
      ...config,
      connection: Connection.isConnection(connection)
         ? connection
         : (bunSqlite(connection as any) as any),
   });
}

export function createMcpToolCaller() {
   return async (server: McpServer, name: string, args: any, raw?: any) => {
      const res = await server.handle(
         {
            jsonrpc: "2.0",
            method: "tools/call",
            params: {
               name,
               arguments: args,
            },
         },
         raw,
      );

      if ((res.result as any)?.isError) {
         console.dir(res.result, { depth: null });
         throw new Error((res.result as any)?.content?.[0]?.text ?? "Unknown error");
      }

      return JSON.parse((res.result as any)?.content?.[0]?.text ?? "null");
   };
}
