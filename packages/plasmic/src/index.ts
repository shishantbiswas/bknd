import type { registerComponent, registerGlobalContext } from "@plasmicapp/host";
import { registerImage } from "./components/Image";
import { registerLazyRender } from "./components/LazyRender";
import { registerUserbaseData } from "./components/data/UserbaseData";
import { registerUserbaseContext } from "./contexts/UserbaseContext";

export function registerAll(loader?: {
   registerComponent: typeof registerComponent;
   registerGlobalContext: typeof registerGlobalContext;
}) {
   registerUserbaseData(loader);
   registerUserbaseContext(loader);
   registerImage(loader);
   registerLazyRender(loader);
}

export { registerUserbaseData, registerUserbaseContext };
