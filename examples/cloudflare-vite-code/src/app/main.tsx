import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClientProvider } from "userbase/client";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <ClientProvider>
         <App />
      </ClientProvider>
   </StrictMode>
);
