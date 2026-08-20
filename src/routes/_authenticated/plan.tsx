import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PriorityBoard } from "@/components/PriorityBoard";
import { Button, PageHeader } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({
    meta: [
      { title: "Your prioritised learning plan — Gatekeeper" },
      {
        name: "description",
        content:
          "Urgent, Priority, Foundation and Later: see exactly which study topics deserve your attention and which were filtered out.",
      },
      { property: "og:title", content: "Your prioritised learning plan — Gatekeeper" },
      {
        property: "og:description",
        content: "Four clear priority boxes instead of twenty unread resources.",
      },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const { t } = useLang();
  const { state, hydrated } = useStore();

  if (!hydrated) {
    return (
      <AppShell>
        <div className="space-y-4 py-6" aria-busy="true" aria-label={t("loading")}>
          <div className="h-6 w-40 animate-pulse rounded bg-secondary" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!state.planned) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="text-2xl">{t("emptyPlan")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("emptyPlanBody")}</p>
          <Link to="/start" className="mt-6 inline-block">
            <Button size="lg">{t("buildPlan")}</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={t("plan")}
        title={t("attention")}
        description={state.goal}
        action={
          <Link to="/start">
            <Button variant="outline" size="sm">
              {t("editGoal")}
            </Button>
          </Link>
        }
        className="mb-8"
      />
      <PriorityBoard />
    </AppShell>
  );
}
