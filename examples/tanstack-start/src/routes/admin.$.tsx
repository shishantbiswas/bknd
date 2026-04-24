import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "bknd/client";
import bkndCssUrl from "bknd/dist/styles.css?url";
import { Admin } from "bknd/ui";

export const Route = createFileRoute("/admin/$")({
  ssr: false, // "data-only" works too
  component: RouteComponent,
   head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: bkndCssUrl,
      },
    ],
  }),
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
