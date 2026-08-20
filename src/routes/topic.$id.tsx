import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LearningTree } from "@/components/LearningTree";
import { SourceRow } from "@/components/SourceRow";
import { UnderstandingCheck } from "@/components/UnderstandingCheck";
import { Button, Card, Pill, Progress } from "@/components/ui/primitives";
import { findTopic, flatConcepts, sources } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/topic/$id")({
  loader: ({ params }) => {
    const topic = findTopic(params.id);
    if (!topic) throw notFound();
    return { title: topic.title.en };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Topic unavailable — Gatekeeper" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — learning branch | Gatekeeper`;
    const description = `Work through ${loaderData.title} concept by concept, with only the sources that matter and an understanding check at the end.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TopicPage,
});

function TopicPage() {
  const { id } = Route.useParams();
  const topic = findTopic(id)!;
  const L = useL();
  const { t } = useLang();
  const router = useRouter();
  const { state, setConcept, topicProgress } = useStore();

  const all = useMemo(() => flatConcepts(topic), [topic]);
  const [activeId, setActiveId] = useState(all[0]?.id ?? "");
  const [checking, setChecking] = useState(false);
  const active = all.find((c) => c.id === activeId) ?? all[0];

  if (!active) {
    return (
      <AppShell backTo="/plan">
        <div className="py-16 text-center">
          <h1 className="text-2xl">{L(topic.title)}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{L(topic.why)}</p>
        </div>
      </AppShell>
    );
  }

  const status = state.concepts[active.id] ?? "todo";
  const activeSources = active.sourceIds.map((sid) => sources[sid]!).filter(Boolean);
  const pct = topicProgress(topic);

  const advance = (childId?: string) => {
    setChecking(false);
    if (childId) {
      setActiveId(childId);
      return;
    }
    const idx = all.findIndex((c) => c.id === active.id);
    const next = all.slice(idx + 1).find((c) => (state.concepts[c.id] ?? "todo") !== "understood");
    if (next) setActiveId(next.id);
    else router.navigate({ to: "/" });
  };

  return (
    <AppShell backTo="/plan" backLabel={t("plan")}>
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={topic.bucket === "filtered" ? "later" : topic.bucket}>{t(topic.bucket === "filtered" ? "later" : topic.bucket)}</Pill>
          {topic.dueIn !== undefined && (
            <span className="text-[0.75rem] font-semibold text-urgent">
              {topic.dueIn} {t("daysLeft")}
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl">{L(topic.title)}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{L(topic.why)}</p>
        <div className="mt-4 flex max-w-sm items-center gap-3">
          <Progress value={pct} className="flex-1" />
          <span className="shrink-0 whitespace-nowrap text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
            {pct}% {t("progress")}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="branch-title" className="order-2 lg:order-1">
          <Card>
            <p className="gk-eyebrow">{t("branch")}</p>
            <h2 id="branch-title" className="mt-2 text-lg leading-snug">
              {L(active.title)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L(active.summary)}</p>

            <div className="mt-5 gk-rule pt-5">
              <p className="gk-eyebrow">{t("sources")}</p>
              <p className="mt-1.5 text-[0.75rem] text-muted-foreground">{t("sourcesHelp")}</p>
              <div className="mt-3 space-y-2.5">
                {activeSources.map((s) => (
                  <SourceRow key={s.id} source={s} />
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant={status === "todo" ? "outline" : "quiet"}
                onClick={() => setConcept(active.id, status === "todo" ? "studied" : "todo")}
              >
                {status === "todo" ? t("markRead") : `✓ ${t("studied")}`}
              </Button>
              <Button onClick={() => setChecking(true)}>{t("check")}</Button>
            </div>
          </Card>
        </section>

        <aside aria-labelledby="tree-title" className="order-1 lg:order-2">
          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 id="tree-title" className="gk-eyebrow">
              {t("branch")}
            </h2>
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">{t("branchHelp")}</p>
            <div className="mt-3">
              <LearningTree concepts={topic.concepts} activeId={active.id} onSelect={setActiveId} />
            </div>
          </div>
        </aside>
      </div>

      {checking && (
        <UnderstandingCheck concept={active} onClose={() => setChecking(false)} onContinue={advance} />
      )}
    </AppShell>
  );
}
