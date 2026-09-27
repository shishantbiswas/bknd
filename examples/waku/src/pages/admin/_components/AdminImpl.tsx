"use client";

import { Admin, type UserbaseAdminProps } from "userbase/ui";

export const AdminImpl = (props: UserbaseAdminProps) => {
   if (typeof window === "undefined") {
      return null;
   }

   return (
      <Admin
         withProvider
         config={{
            basepath: "/admin",
            logo_return_path: "/../",
            ...props.config,
         }}
         {...props}
      />
   );
};

export default AdminImpl;
