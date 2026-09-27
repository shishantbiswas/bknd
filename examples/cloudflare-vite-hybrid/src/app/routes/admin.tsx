import { Admin, type UserbaseAdminProps } from "userbase/ui";
import "userbase/dist/styles.css";
import { useAuth } from "userbase/client";

export default function AdminPage(props: UserbaseAdminProps) {
   const auth = useAuth();
   return <Admin {...props} withProvider={{ user: auth.user }} />;
}
