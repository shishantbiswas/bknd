import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "userbase/client";
import "userbase/dist/styles.css";
import { Admin } from "userbase/ui";

export const Route = createFileRoute("/admin/$")({
  ssr: false, // "data-only" works too
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  return (
    <Admin
      withProvider={{ user: user }}
      config={{
        basepath: "/admin",
        logo_return_path: "/../",
      }}
      baseUrl={import.meta.env.APP_URL}
    />
  );
}
