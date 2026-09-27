import { IconPhoto } from "@tabler/icons-react";
import { useUserbase } from "ui/client/UserbaseProvider";
import { Empty } from "ui/components/display/Empty";
import { useBrowserTitle } from "ui/hooks/use-browser-title";
import * as AppShell from "ui/layouts/AppShell/AppShell";
import { useLocation } from "wouter";
import { userbaseModals } from "ui/modals";
import { DropzoneContainer } from "ui/elements/media/DropzoneContainer";
import type { FileState } from "ui/elements/media/Dropzone";

export function MediaIndex() {
   const { config } = useUserbase();
   const [, navigate] = useLocation();
   useBrowserTitle(["Media"]);

   if (!config.media.enabled) {
      return (
         <Empty
            Icon={IconPhoto}
            title="Media not enabled"
            description="Please enable media in the settings to continue."
            primary={{
               children: "Manage Settings",
               onClick: () => navigate("/settings"),
            }}
         />
      );
   }

   const onClick = (file: FileState) => {
      userbaseModals.open(userbaseModals.ids.mediaInfo, {
         file,
      });
   };

   return (
      <AppShell.Scrollable>
         <div className="flex flex-1 p-3">
            <DropzoneContainer onClick={onClick} infinite query={{ sort: "-id" }} />
         </div>
      </AppShell.Scrollable>
   );
}
