import {
   DataProvider,
   GlobalActionsProvider,
   type GlobalContextMeta,
   registerGlobalContext,
   usePlasmicCanvasContext
} from "@plasmicapp/host";
import type { AppConfig } from "userbase";
// @ts-ignore
import { ClientProvider, useApi, useAuth, useBaseUrl } from "userbase/client";
// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Users will be able to set these props in Studio.
interface UserbaseGlobalContextProps {
   // You might use this to override the auth URL to a test or local URL.
   baseUrl?: string;
   appConfig?: AppConfig;
   auth: any; // @todo: add typings
}

type UserbaseContextProps = {
   baseUrl?: string;
   initialAuth?: any;
};

const UserbaseContextContext = createContext<UserbaseGlobalContextProps>({} as any);
UserbaseContextContext.displayName = "UserbaseContext";

export const UserbaseContext = ({
   children,
   baseUrl,
   initialAuth
}: React.PropsWithChildren<UserbaseContextProps>) => {
   const auth = useAuth();
   const baseurl = baseUrl ?? useBaseUrl();
   const api = useApi(baseurl);

   const [data, setData] = useState<UserbaseGlobalContextProps>({
      baseUrl: baseurl,
      auth: auth ?? initialAuth,
      appConfig: undefined
   });
   const inEditor = !!usePlasmicCanvasContext();

   useEffect(() => {
      setData((prev) => ({ ...prev, auth: auth }));
   }, [auth.user]);

   useEffect(() => {
      (async () => {
         if (inEditor) {
            const result = await api.system.readConfig();
            setData((prev) => ({ ...prev, appConfig: result }));
         }
      })();
   }, [inEditor]);

   const actions = useMemo(
      () => ({
         login: auth.login,
         register: auth.register,
         logout: auth.logout,
         setToken: auth.setToken
      }),
      [baseUrl]
   );

   console.log("plasmic.userbase.context", { baseurl });
   return (
      <GlobalActionsProvider contextName="UserbaseContext" actions={actions}>
         <UserbaseContextContext.Provider value={data}>
            <DataProvider name="userbase" data={data}>
               <ClientProvider baseUrl={data.baseUrl}>{children}</ClientProvider>
            </DataProvider>
         </UserbaseContextContext.Provider>
      </GlobalActionsProvider>
   );
};

export function usePlasmicUserbaseContext() {
   const context = useContext(UserbaseContextContext);
   return context;
}

export function registerUserbaseContext(
   loader?: { registerGlobalContext: typeof registerGlobalContext },
   customMeta?: GlobalContextMeta<UserbaseContextProps>
) {
   if (loader) {
      loader.registerGlobalContext(UserbaseContext, customMeta ?? UserbaseContextMeta);
   } else {
      registerGlobalContext(UserbaseContext, customMeta ?? UserbaseContextMeta);
   }
}

export const UserbaseContextMeta: GlobalContextMeta<UserbaseContextProps> = {
   name: "UserbaseContext",
   importPath: "@userbase/plasmic",
   props: { baseUrl: { type: "string" }, initialAuth: { type: "object" } },
   providesData: true,
   globalActions: {
      login: {
         parameters: [{ name: "data", type: "object" }]
      },
      register: {
         parameters: [{ name: "data", type: "object" }]
      },
      logout: {
         parameters: []
      },
      setToken: {
         parameters: [{ name: "token", type: "string" }]
      },
      sayHi: {
         parameters: [{ name: "message", type: "string" }]
      }
   }
};
