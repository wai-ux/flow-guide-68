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
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
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

      <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <Pill tone="primary">{t("appName")}</Pill>
        <h1 className="mt-5 text-3xl leading-tight sm:text-4xl">{t("tagline")}</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{t("emptyPlanBody")}</p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Link to="/auth">
            <Button size="lg">{t("getStarted")}</Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline">
              {t("demoLogin")}
            </Button>
          </Link>
        </div>

        <ol className="mt-14 grid gap-3 sm:grid-cols-2">
          {steps.map((key, i) => (
            <li key={key} className="rounded-lg border border-border bg-surface p-4">
              <span className="gk-eyebrow">
                {t("step")} {i + 1}
              </span>
              <p className="mt-1.5 text-[0.9375rem] font-semibold">{t(key)}</p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
