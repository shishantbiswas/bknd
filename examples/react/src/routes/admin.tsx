import { Admin, type UserbaseAdminProps } from "userbase/ui";
import "userbase/dist/styles.css";

export default function AdminPage(props: UserbaseAdminProps) {
   return <Admin {...props} />;
}
