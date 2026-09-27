"use client";

import { type UserbaseAdminProps, Admin } from "userbase/ui";
import { useEffect, useState } from "react";

export function AdminComponent(props: UserbaseAdminProps) {
   const [ready, setReady] = useState(false);

   useEffect(() => {
      if (typeof window !== "undefined") setReady(true);
   }, []);
   if (!ready) return null;

   return <Admin {...props} />;
}
