import type { Connection } from "userbase";
import { nodeSqlite } from "../node/connection/NodeSqliteConnection";

export function sqlite(config?: { url: string }): Connection {
   return nodeSqlite(config);
}
