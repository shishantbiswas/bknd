import type { ModuleConfigs, ModuleSchemas } from "modules";
import { getDefaultConfig, getDefaultSchema } from "modules/ModuleManager";
import {
   createContext,
   startTransition,
   useContext,
   useEffect,
   useRef,
   useState,
   type ReactNode,
} from "react";
import { useApi } from "userbase/client";
import { type TSchemaActions, getSchemaActions } from "./schema/actions";
import { AppReduced } from "./utils/AppReduced";
import { Message } from "ui/components/display/Message";
import { useNavigate } from "ui/lib/routes";
import type { UserbaseAdminProps } from "ui/Admin";
import type { TPermission } from "auth/authorize/Permission";

export type UserbaseContext = {
   version: number;
   readonly: boolean;
   schema: ModuleSchemas;
   config: ModuleConfigs;
   permissions: TPermission[];
   hasSecrets: boolean;
   requireSecrets: () => Promise<void>;
   actions: ReturnType<typeof getSchemaActions>;
   app: AppReduced;
   options: UserbaseAdminProps["config"];
   fallback: boolean;
};

const UserbaseContext = createContext<UserbaseContext>(undefined!);
export type { TSchemaActions };

enum Fetching {
   None = 0,
   Schema = 1,
   Secrets = 2,
}

export function UserbaseProvider({
   includeSecrets = false,
   options,
   children,
   fallback = null,
}: {
   includeSecrets?: boolean;
   children: any;
   fallback?: React.ReactNode;
   options?: UserbaseAdminProps["config"];
}) {
   const [withSecrets, setWithSecrets] = useState<boolean>(includeSecrets);
   const [schema, setSchema] =
      useState<
         Pick<
            UserbaseContext,
            "version" | "schema" | "config" | "permissions" | "fallback" | "readonly"
         >
      >();
   const [fetched, setFetched] = useState(false);
   const [error, setError] = useState<boolean>();
   const errorShown = useRef<boolean>(false);
   const fetching = useRef<Fetching>(Fetching.None);
   const [local_version, set_local_version] = useState(0);
   const api = useApi();

   async function reloadSchema() {
      await fetchSchema(includeSecrets, {
         force: true,
         fresh: true,
      });
   }

   async function fetchSchema(
      _includeSecrets: boolean = false,
      opts?: {
         force?: boolean;
         fresh?: boolean;
      },
   ) {
      const requesting = withSecrets ? Fetching.Secrets : Fetching.Schema;
      if (fetching.current === requesting) return;

      if (withSecrets && opts?.force !== true) return;
      fetching.current = requesting;

      const res = await api.system.readSchema({
         config: true,
         secrets: _includeSecrets,
         fresh: opts?.fresh,
      });

      if (!res.ok) {
         if (errorShown.current) return;
         errorShown.current = true;

         setError(true);
         // if already has schema, don't overwrite
         if (fetched && schema?.schema) return;
      } else if (error) {
         setError(false);
      }

      const newSchema = res.ok
         ? res.body
         : ({
              version: 0,
              mode: "db",
              schema: getDefaultSchema(),
              config: getDefaultConfig(),
              permissions: [],
              fallback: true,
           } as any);

      startTransition(() => {
         const commit = () => {
            setSchema(newSchema);
            setWithSecrets(_includeSecrets);
            setFetched(true);
            set_local_version((v) => v + 1);
            fetching.current = Fetching.None;
         };

         // disable view transitions for now
         // because it causes browser crash on heavy pages (e.g. schema)
         commit();
         /* if ("startViewTransition" in document) {
            document.startViewTransition(commit);
         } else {
            commit();
         } */
      });
   }

   async function requireSecrets() {
      if (withSecrets) return;
      await fetchSchema(true);
   }

   useEffect(() => {
      if (schema?.schema) return;
      fetchSchema(includeSecrets);
   }, []);

   if (!fetched || !schema) return fallback;
   const app = new AppReduced(schema?.config as any, options);
   const actions = getSchemaActions({ api, setSchema, reloadSchema });
   const hasSecrets = withSecrets && !error;

   return (
      <UserbaseContext.Provider
         value={{ ...schema, actions, requireSecrets, app, options: app.options, hasSecrets }}
         key={local_version}
      >
         {error ? <AccessDenied /> : children}
      </UserbaseContext.Provider>
   );
}

function AccessDenied() {
   const [navigate] = useNavigate();
   return (
      <Message.MissingPermission
         what="the Admin UI"
         primary={{
            children: "Login",
            onClick: () => navigate("/auth/login"),
         }}
      />
   );
}

export function useUserbase({ withSecrets }: { withSecrets?: boolean } = {}): UserbaseContext {
   const ctx = useContext(UserbaseContext);
   if (withSecrets) ctx.requireSecrets();

   return ctx;
}

export function useUserbaseOptions(): UserbaseAdminProps["config"] {
   const ctx = useContext(UserbaseContext);
   return (
      ctx.options ?? {
         basepath: "/",
      }
   );
}

export function SchemaEditable({ children }: { children: ReactNode }) {
   const { readonly } = useUserbase();
   return !readonly ? children : null;
}
