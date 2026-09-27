import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import React, { type ReactNode } from "react";
import { UserbaseProvider } from "ui/client/userbase";
import { useTheme, type AppTheme } from "ui/client/use-theme";
import { Logo } from "ui/components/display/Logo";
import * as AppShell from "ui/layouts/AppShell/AppShell";
import { ClientProvider, useUserbaseWindowContext, type ClientProviderProps } from "userbase/client";
import { createMantineTheme } from "./lib/mantine/theme";
import { Routes } from "./routes";
import type { UserbaseAdminAppShellOptions, UserbaseAdminEntitiesOptions } from "./options";

export type UserbaseAdminConfig = {
   /**
    * Base path of the Admin UI
    * @default `/`
    */
   basepath?: string;
   /**
    * Sub-path for the Admin UI within the base path
    * @default ``
    */
   admin_basepath?: string;
   /**
    * Path to return to when clicking the logo
    * @default `/`
    */
   logo_return_path?: string;
   /**
    * Theme of the Admin UI
    * @default `system`
    */
   theme?: AppTheme;
   /**
    * Entities configuration like headers, footers, actions, field renders, etc.
    */
   entities?: UserbaseAdminEntitiesOptions;
   /**
    * App shell configuration like user menu actions.
    */
   appShell?: UserbaseAdminAppShellOptions;
};

export type UserbaseAdminProps = {
   /**
    * Base URL of the API, only needed if you are not using the `withProvider` prop
    */
   baseUrl?: string;
   /**
    * Whether to wrap Admin in a `<ClientProvider />`
    */
   withProvider?: boolean | ClientProviderProps;
   /**
    * Admin UI customization options
    */
   config?: UserbaseAdminConfig;
   children?: ReactNode;
};

export default function Admin(props: UserbaseAdminProps) {
   const Provider = ({ children }: any) =>
      props.withProvider ? (
         <ClientProvider
            baseUrl={props.baseUrl}
            {...(typeof props.withProvider === "object" ? props.withProvider : {})}
         >
            {children}
         </ClientProvider>
      ) : (
         children
      );

   return (
      <Provider>
         <AdminInner {...props} />
      </Provider>
   );
}

function AdminInner(props: UserbaseAdminProps) {
   const { theme } = useTheme();
   const config = {
      ...props.config,
      ...useUserbaseWindowContext(),
   };

   const UserbaseWrapper = ({ children }: { children: ReactNode }) => (
      <UserbaseProvider options={config} fallback={<Skeleton theme={config?.theme} />}>
         {children}
      </UserbaseProvider>
   );

   return (
      <MantineProvider {...createMantineTheme(theme as any)}>
         <Notifications position="top-right" />
         <Routes UserbaseWrapper={UserbaseWrapper} basePath={config?.basepath}>
            {props.children}
         </Routes>
      </MantineProvider>
   );
}

const Skeleton = ({ theme }: { theme?: any }) => {
   const t = useTheme();
   const actualTheme = theme && ["dark", "light"].includes(theme) ? theme : t.theme;

   return (
      <div id="userbase-admin" className={actualTheme + " antialiased"}>
         <AppShell.Root>
            <header
               data-shell="header"
               className="flex flex-row w-full h-16 gap-2.5 border-muted border-b justify-start bg-muted/10"
            >
               <div className="max-h-full flex hover:bg-primary/5 link p-2.5 w-[134px] outline-none">
                  <Logo theme={actualTheme} />
               </div>
               <nav className="hidden md:flex flex-row gap-2.5 pl-0 p-2.5 items-center">
                  {[...new Array(4)].map((item, key) => (
                     <AppShell.NavLink key={key} as="span" className="active h-full opacity-50">
                        <div className="w-18 h-3" />
                     </AppShell.NavLink>
                  ))}
               </nav>
               <nav className="flex md:hidden flex-row gap-2.5 pl-0 p-2.5 items-center">
                  <AppShell.NavLink as="span" className="active h-full opacity-50">
                     <div className="w-20 h-3" />
                  </AppShell.NavLink>
               </nav>
               <div className="flex flex-grow" />
               <div className="hidden lg:flex flex-row items-center px-4 gap-2 opacity-50">
                  <div className="size-11 rounded-full bg-primary/10" />
               </div>
            </header>
            <AppShell.Content>
               <div className="flex flex-col w-full h-full justify-center items-center">
                  {/*<span className="font-mono opacity-30">Loading</span>*/}
               </div>
            </AppShell.Content>
         </AppShell.Root>
      </div>
   );
};
