import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PriorityBoard, TopicCard } from "@/components/PriorityBoard";
import { Button, Card, Pill, Progress } from "@/components/ui/primitives";
import { flatConcepts, topics } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

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
  component: Today,
});

function Today() {
  const { t } = useLang();
  const L = useL();
  const { state, hydrated, focusTopic, overallProgress } = useStore();

  if (!hydrated) {
    return (
      <AppShell>
        <div className="space-y-4 py-6" aria-busy="true" aria-label={t("loading")}>
          <div className="h-6 w-40 animate-pulse rounded bg-secondary" />
          <div className="h-40 animate-pulse rounded-lg bg-secondary" />
          <div className="h-24 animate-pulse rounded-lg bg-secondary" />
        </div>
      </AppShell>
    );
  }

  if (!state.planned) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg py-14 text-center sm:py-20">
          <Pill tone="primary">{t("appName")}</Pill>
          <h1 className="mt-5 text-3xl leading-tight sm:text-4xl">{t("todayQuestion")}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("emptyPlanBody")}
          </p>
          <Link to="/start" className="mt-7 inline-block">
            <Button size="lg">{t("buildPlan")}</Button>
          </Link>
          <p className="mt-4 text-[0.75rem] text-muted-foreground">{t("tagline")}</p>
        </div>
      </AppShell>
    );
  }

  const focusConcept = focusTopic ? flatConcepts(focusTopic)[0] : undefined;
  const gapTopics = topics.filter((tp) => flatConcepts(tp).some((c) => state.gaps.includes(c.id)));

  return (
    <AppShell>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="gk-eyebrow">{t("greeting")}</p>
          <h1 className="mt-2 text-2xl leading-tight sm:text-3xl">{t("todayQuestion")}</h1>
        </div>
        <div className="min-w-40">
          <div className="flex items-baseline justify-between gap-2">
            <span className="gk-eyebrow">{t("progress")}</span>
            <span className="text-sm font-bold tabular-nums">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="mt-2" />
        </div>
      </header>

      <Card className="mt-5 border-primary/35 p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
          <Pill tone="primary">{t("todayAnswer")}</Pill>
          {focusTopic?.dueIn !== undefined && (
            <span className="text-[0.75rem] font-semibold text-urgent">
              {focusTopic.dueIn} {t("daysLeft")}
            </span>
          )}
          <span className="ml-auto text-[0.75rem] font-semibold text-muted-foreground">
            {focusTopic?.minutes} {t("minutes")}
          </span>
        </div>
        <div className="p-5">
          <h2 className="text-xl leading-snug sm:text-2xl">{focusTopic && L(focusTopic.title)}</h2>
          {focusConcept && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L(focusConcept.question)}</p>
          )}
          <div className="mt-4 rounded-lg border border-border bg-surface p-4">
            <p className="gk-eyebrow">{t("todayWhy")}</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed">{focusTopic && L(focusTopic.why)}</p>
          </div>
          {focusTopic && (
            <Link to="/topic/$id" params={{ id: focusTopic.id }} className="mt-5 inline-block">
              <Button size="lg">{t("startNow")}</Button>
            </Link>
          )}
        </div>
      </Card>

      <section className="mt-6 rounded-lg border border-border bg-surface p-4">
        <p className="gk-eyebrow">{t("goalLabel")}</p>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-[0.9375rem] font-semibold">{state.goal}</p>
          <Link to="/start" className="text-[0.75rem] text-primary underline-offset-4 hover:underline">
            {t("editGoal")}
          </Link>
        </div>
        <p className="mt-1 text-[0.75rem] text-muted-foreground">
          {state.resources.length} {t("resourcesCount")} · {state.hours} {t("perDay")}
        </p>
      </section>

      {gapTopics.length > 0 && (
        <section className="mt-6" aria-labelledby="gaps-title">
          <h2 id="gaps-title" className="gk-eyebrow">
            {t("gapFound")}
          </h2>
          <div className="mt-3 space-y-2.5">
            {gapTopics.map((tp) => (
              <TopicCard key={tp.id} topicId={tp.id} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8" aria-labelledby="board-title">
        <h2 id="board-title" className="mb-3 text-lg">
          {t("attention")}
        </h2>
        <PriorityBoard />
      </section>
    </AppShell>
  );
}
