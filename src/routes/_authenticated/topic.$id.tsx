import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { LearningTree } from "@/components/LearningTree";
import { SourceRow } from "@/components/SourceRow";
import { UnderstandingCheck } from "@/components/UnderstandingCheck";
import { Button, Card, Pill, Progress } from "@/components/ui/primitives";
import { conceptPath, findTopic, flatConcepts, sources } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";


export const Route = createFileRoute("/_authenticated/topic/$id")({
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
  const [showAllSources, setShowAllSources] = useState(false);
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

  const path = conceptPath(topic, active.id);
  const level = Math.max(1, path.length);
  const stepIndex = all.findIndex((c) => c.id === active.id);
  const doneCount = all.filter((c) => state.concepts[c.id] === "understood").length;
  const remaining = all.length - doneCount;
  const kids = active.children ?? [];
  const prev = stepIndex > 0 ? all[stepIndex - 1] : undefined;
  const next = stepIndex < all.length - 1 ? all[stepIndex + 1] : undefined;

  const advance = (childId?: string) => {
    setChecking(false);
    if (childId) {
      setActiveId(childId);
      return;
    }
    const idx = all.findIndex((c) => c.id === active.id);
    const nxt = all.slice(idx + 1).find((c) => (state.concepts[c.id] ?? "todo") !== "understood");
    if (nxt) setActiveId(nxt.id);
    else router.navigate({ to: "/dashboard" });
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
            {pct}% · {remaining} {t("remaining")}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="branch-title" className="order-2 lg:order-1">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <nav aria-label={t("branch")} className="flex flex-wrap items-center gap-1.5 text-[0.6875rem] font-semibold text-muted-foreground">
                {path.map((c, i) => (
                  <span key={c.id} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i === path.length - 1 ? (
                      <span className="text-foreground">{L(c.title)}</span>
                    ) : (
                      <button onClick={() => setActiveId(c.id)} className="underline decoration-border-strong underline-offset-2 hover:text-foreground">
                        {L(c.title)}
                      </button>
                    )}
                  </span>
                ))}
              </nav>
              <span className="text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
                {t("stepOf")} {stepIndex + 1}/{all.length} · {t("levelLabel")} {level}
              </span>
            </div>

            <h2 id="branch-title" className="mt-3 text-lg leading-snug">
              {L(active.title)}
            </h2>
            <p className="mt-1 text-[0.8125rem] text-muted-foreground">{L(active.question)}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{L(active.summary)}</p>
            <p className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-wide text-muted-foreground">
              {active.minutes} {t("minutes")} ·{" "}
              {status === "understood" ? t("understood") : status === "gap" ? t("toReview") : status === "studied" ? t("studied") : t("notStarted")}
            </p>

            <div className="mt-6 gk-rule pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="gk-eyebrow">{t("sources")}</p>
                {activeSources.length > 2 && (
                  <button
                    onClick={() => setShowAllSources((v) => !v)}
                    className="text-[0.75rem] font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {showAllSources ? t("collapseAll") : `${t("expandAll")} (${activeSources.length})`}
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-[0.75rem] text-muted-foreground">{t("sourcesHelp")}</p>
              <div className="mt-2 space-y-1">
                {(showAllSources ? activeSources : activeSources.slice(0, 2)).map((s) => (
                  <SourceRow key={s.id} source={s} />
                ))}
              </div>
            </div>

            {kids.length > 0 && (
              <div className="mt-5 gk-rule pt-5">
                <p className="gk-eyebrow">{t("deeperBranches")}</p>
                <p className="mt-1.5 text-[0.75rem] text-muted-foreground">{t("deeperHelp")}</p>
                <ul className="mt-3 space-y-2">
                  {kids.map((k) => {
                    const ks = state.concepts[k.id] ?? "todo";
                    return (
                      <li key={k.id}>
                        <button
                          onClick={() => setActiveId(k.id)}
                          className="flex w-full items-center justify-between gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:border-border-strong"
                        >
                          <span className="min-w-0">
                            <span className="block text-[0.875rem] font-semibold leading-snug">{L(k.title)}</span>
                            <span className="mt-0.5 block text-[0.75rem] text-muted-foreground">
                              {k.minutes} {t("minutes")} ·{" "}
                              {ks === "understood" ? t("understood") : ks === "gap" ? t("toReview") : t("notStarted")}
                            </span>
                          </span>
                          <span className="shrink-0 text-[0.6875rem] font-semibold text-primary">{t("goDeeper")} →</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button
                variant={status === "todo" ? "outline" : "quiet"}
                onClick={() => setConcept(active.id, status === "todo" ? "studied" : "todo")}
              >
                {status === "todo" ? t("markRead") : `✓ ${t("studied")}`}
              </Button>
              <Button onClick={() => setChecking(true)}>{t("check")}</Button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 gk-rule pt-4">
              <Button variant="ghost" disabled={!prev} onClick={() => prev && setActiveId(prev.id)}>
                ← {t("prevConcept")}
              </Button>
              <Button variant="ghost" disabled={!next} onClick={() => next && setActiveId(next.id)}>
                {t("nextConcept")} →
              </Button>
            </div>

            {remaining === 0 && (
              <div className="mt-4 rounded-lg border border-primary/40 bg-primary/8 p-4" aria-live="polite">
                <p className="text-[0.875rem] font-semibold">{t("branchDone")}</p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{t("branchDoneBody")}</p>
              </div>
            )}
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
