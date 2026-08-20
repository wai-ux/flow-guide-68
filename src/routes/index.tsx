import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button, Pill } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gatekeeper — know what to study today" },
      {
        name: "description",
        content:
          "An information gatekeeper for students: turn ten scattered sources into one prioritised learning path, a learning tree, and an honest understanding check.",
      },
      { property: "og:title", content: "Gatekeeper — know what to study today" },
      {
        property: "og:description",
        content: "Not more information. Better decisions about the information you already have.",
      },
    ],
  }),
  component: Landing,
});

const steps = ["stepPrioritise", "stepBranch", "stepCheck", "stepClose"] as const;

function Landing() {
  const { t } = useLang();
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) void router.navigate({ to: "/dashboard", replace: true });
  }, [loading, session, router]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 20V8l8-4 8 4v12" />
              <path d="M10 20v-6h4v6" />
            </svg>
          </span>
          <span className="font-display text-[0.9375rem] font-semibold tracking-tight">{t("appName")}</span>
          <Link to="/auth" className="ml-auto">
            <Button size="sm" variant="outline">
              {t("signIn")}
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-24 sm:py-32">
        <h1 className="max-w-2xl text-[2rem] leading-[1.15] sm:text-[2.5rem]">{t("tagline")}</h1>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/auth">
            <Button size="lg">{t("getStarted")}</Button>
          </Link>
          <Link to="/auth" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {t("demoLogin")}
          </Link>
        </div>

        <ol className="mt-16 space-y-2.5 text-sm">
          {steps.map((key, i) => (
            <li key={key} className="flex gap-3">
              <span className="w-4 shrink-0 tabular-nums text-muted-foreground">{i + 1}</span>
              <span>{t(key)}</span>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
