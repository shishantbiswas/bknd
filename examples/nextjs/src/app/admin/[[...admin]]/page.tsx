import { AdminComponent } from "./Admin";
import { getApi } from "@/userbase";
import "userbase/dist/styles.css";

export default async function AdminPage() {
   const api = await getApi({ verify: true });

   return (
      <AdminComponent
         withProvider={{ user: api.getUser() }}
         config={{
            basepath: "/admin",
            logo_return_path: "/../",
            theme: "system",
         }}
      />
   );
}
