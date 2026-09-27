import type { DB } from "userbase";
import type { Insertable, Selectable, Updateable, Generated } from "kysely";

declare global {
  type UserbaseEntity<T extends keyof DB> = Selectable<DB[T]>;
  type UserbaseEntityCreate<T extends keyof DB> = Insertable<DB[T]>;
  type UserbaseEntityUpdate<T extends keyof DB> = Updateable<DB[T]>;
}

export interface Todos {
  id: Generated<number>;
  title?: string;
  done?: boolean;
}

interface Database {
  todos: Todos;
}

declare module "userbase" {
  interface DB extends Database {}
}