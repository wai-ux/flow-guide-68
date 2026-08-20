import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthGate,
});

function AuthGate() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const { t } = useLang();

  useEffect(() => {
    if (!loading && !session) {
      void router.navigate({ to: "/auth", replace: true });
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background" aria-busy="true" aria-label={t("loading")}>
        <div className="w-64 space-y-3">
          <div className="h-2 animate-pulse rounded bg-secondary" />
          <div className="h-2 w-2/3 animate-pulse rounded bg-secondary" />
        </div>
      </div>
    );
  }

  return <Outlet />;
}
