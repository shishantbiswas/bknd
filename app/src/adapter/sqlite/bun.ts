import type { Connection } from "userbase";
import { bunSqlite } from "../bun/connection/BunSqliteConnection";

export function sqlite(config?: { url: string }): Connection {
   return bunSqlite(config);
}
