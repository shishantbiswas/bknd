import { useUserbase } from "ui/client/UserbaseProvider";
import type { DropdownProps } from "ui/components/overlay/Dropdown";

export type UserbaseAdminAppShellOptions = {
   userMenu?: DropdownProps["items"];
};

export function useAppShellAdminOptions() {
   const { options } = useUserbase();
   const userMenu = options?.appShell?.userMenu ?? [];
   return { userMenu };
}
