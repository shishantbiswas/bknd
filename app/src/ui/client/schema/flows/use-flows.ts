import { parse } from "userbase/utils";
import { type TAppFlowSchema, flowSchema } from "flows/flows-schema";
import { useUserbase } from "../../UserbaseProvider";

export function useFlows() {
   const { config, app, actions: userbaseActions } = useUserbase();

   const actions = {
      flow: {
         create: async (name: string, data: TAppFlowSchema) => {
            const parsed = parse(flowSchema, data, { skipMark: true, forceParse: true });
            const res = await userbaseActions.add("flows", `flows.${name}`, parsed);
         },
      },
   };

   return { flows: app.flows, config: config.flows, actions };
}
