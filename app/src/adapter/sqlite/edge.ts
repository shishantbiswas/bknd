import { type Connection, libsql } from "userbase";

export function sqlite(config: { url: string }): Connection {
   return libsql(config);
}
