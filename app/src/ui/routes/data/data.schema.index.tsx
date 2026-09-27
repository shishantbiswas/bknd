import { Suspense, lazy } from "react";
import { SchemaEditable } from "ui/client/userbase";
import { useUserbaseData } from "ui/client/schema/data/use-userbase-data";
import { Button } from "ui/components/buttons/Button";
import * as AppShell from "ui/layouts/AppShell/AppShell";

const DataSchemaCanvas = lazy(() =>
   import("ui/modules/data/components/canvas/DataSchemaCanvas").then((m) => ({
      default: m.DataSchemaCanvas,
   })),
);

export function DataSchemaIndex() {
   const { $data } = useUserbaseData();
   return (
      <>
         <AppShell.SectionHeader
            right={
               <SchemaEditable>
                  <Button type="button" variant="primary" onClick={$data.modals.createAny}>
                     Create new
                  </Button>
               </SchemaEditable>
            }
         >
            Schema Overview
         </AppShell.SectionHeader>
         <div className="w-full h-full">
            <Suspense>
               <DataSchemaCanvas />
            </Suspense>
         </div>
      </>
   );
}
