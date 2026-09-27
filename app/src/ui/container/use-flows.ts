import { useUserbase } from "../client/UserbaseProvider";

/** @deprecated */
export function useFlows() {
   const { app } = useUserbase();

   return {
      flows: app.flows,
      config: app.config.flows,
   };
}

/** @deprecated */
export function useFlow(name: string) {
   const { app } = useUserbase();
   const flow = app.flows.find((f) => f.name === name);

   return {
      flow: flow!,
      config: app.config.flows[name],
   };
}
