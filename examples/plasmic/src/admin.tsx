/// <reference types="vite/client" />

import { Admin } from "userbase/ui";
import "userbase/dist/styles.css";

export default function AdminPage() {
   return <Admin config={{ basepath: "/admin" }} />;
}
