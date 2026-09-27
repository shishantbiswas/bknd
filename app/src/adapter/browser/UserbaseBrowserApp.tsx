import {
   createContext,
   lazy,
   Suspense,
   useContext,
   useEffect,
   useState,
   type ReactNode,
} from "react";
import { checksum } from "userbase/utils";
import { App, registries, sqlocal, type UserbaseConfig } from "userbase";
import { Route, Router, Switch } from "wouter";
import { ClientProvider } from "userbase/client";
import { SQLocalKysely } from "sqlocal/kysely";
import type { ClientConfig, DatabasePath } from "sqlocal";
import { OpfsStorageAdapter } from "userbase/adapter/browser";
import type { UserbaseAdminConfig } from "userbase/ui";

const Admin = lazy(() =>
   Promise.all([
      import("userbase/ui"),
      // @ts-ignore
      import("userbase/dist/styles.css"),
   ]).then(([mod]) => ({
      default: mod.Admin,
   })),
);

function safeViewTransition(fn: () => void) {
   if (document.startViewTransition) {
      document.startViewTransition(fn);
   } else {
      fn();
   }
}

export type BrowserUserbaseConfig<Args = ImportMetaEnv> = Omit<
   UserbaseConfig<Args>,
   "connection" | "app"
> & {
   adminConfig?: UserbaseAdminConfig;
   connection?: ClientConfig | DatabasePath;
};

export type UserbaseBrowserAppProps = {
   children: ReactNode;
   header?: ReactNode;
   loading?: ReactNode;
   notFound?: ReactNode;
} & BrowserUserbaseConfig;

const UserbaseBrowserAppContext = createContext<{
   app: App;
   hash: string;
}>(undefined!);

export function UserbaseBrowserApp({
   children,
   adminConfig,
   header,
   loading,
   notFound,
   ...config
}: UserbaseBrowserAppProps) {
   const [app, setApp] = useState<App | undefined>(undefined);
   const [hash, setHash] = useState<string>("");
   const adminRoutePath = (adminConfig?.basepath ?? "") + "/*?";

   async function onBuilt(app: App) {
      safeViewTransition(async () => {
         setApp(app);
         setHash(await checksum(app.toJSON()));
      });
   }

   useEffect(() => {
      setup({ ...config, adminConfig })
         .then((app) => onBuilt(app as any))
         .catch(console.error);
   }, []);

   if (!app) {
      return (
         loading ?? (
            <Center>
               <span style={{ opacity: 0.2 }}>Loading...</span>
            </Center>
         )
      );
   }

   return (
      <UserbaseBrowserAppContext.Provider value={{ app, hash }}>
         <ClientProvider storage={window.localStorage} fetcher={app.server.request}>
            {header}
            <Router key={hash}>
               <Switch>
                  {children}

                  <Route path={adminRoutePath}>
                     <Suspense>
                        <Admin config={adminConfig} />
                     </Suspense>
                  </Route>
                  <Route path="*">
                     {notFound ?? (
                        <Center style={{ fontSize: "48px", fontFamily: "monospace" }}>404</Center>
                     )}
                  </Route>
               </Switch>
            </Router>
         </ClientProvider>
      </UserbaseBrowserAppContext.Provider>
   );
}

export function useApp() {
   return useContext(UserbaseBrowserAppContext);
}

const Center = (props: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      {...props}
      style={{
         width: "100%",
         minHeight: "100vh",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         ...(props.style ?? {}),
      }}
   />
);

let initialized = false;
async function setup(config: BrowserUserbaseConfig = {}) {
   if (initialized) return;
   initialized = true;

   registries.media.register("opfs", OpfsStorageAdapter);

   const app = App.create({
      ...config,
      // @ts-ignore
      connection: sqlocal(new SQLocalKysely(config.connection ?? ":localStorage:")),
   });

   await config.beforeBuild?.(app);
   await app.build({ sync: true });
   await config.onBuilt?.(app);

   return app;
}
