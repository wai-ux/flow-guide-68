import { Link } from "@tanstack/react-router";
import { bucketOrder, topics, type Bucket } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Pill, Progress } from "@/components/ui/primitives";

const bucketMeta: Record<Bucket, { label: "urgent" | "priority" | "foundation" | "later"; why: "urgentWhy" | "priorityWhy" | "foundationWhy" | "laterWhy" }> = {
  urgent: { label: "urgent", why: "urgentWhy" },
  priority: { label: "priority", why: "priorityWhy" },
  foundation: { label: "foundation", why: "foundationWhy" },
  later: { label: "later", why: "laterWhy" },
  filtered: { label: "later", why: "laterWhy" },
};

export function TopicCard({ topicId }: { topicId: string }) {
  const L = useL();
  const { t } = useLang();
  const { topicProgress } = useStore();
  const topic = topics.find((x) => x.id === topicId)!;
  const pct = topicProgress(topic);

  return (
    <Link
      to="/topic/$id"
      params={{ id: topic.id }}
      className="group block rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[0.9375rem] font-semibold leading-snug">{L(topic.title)}</h3>
        <svg
          viewBox="0 0 24 24"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">{L(topic.why)}</p>
      <div className="mt-3 flex items-center gap-3">
        <Progress value={pct} className="flex-1" />
        <span className="text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
          {pct}% · {topic.minutes} {t("minutes")}
        </span>
      </div>
    </Link>
  );
}

export function PriorityBoard() {
  const { t } = useLang();
  const L = useL();
  const { bucketTopics } = useStore();
  const filtered = bucketTopics("filtered");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {bucketOrder.map((b) => {
          const list = bucketTopics(b);
          const meta = bucketMeta[b];
          return (
            <section
              key={b}
              aria-labelledby={`bucket-${b}`}
              className="rounded-2xl border border-border bg-surface p-4"
              style={{ borderLeft: `3px solid var(--color-${b})` }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <h2 id={`bucket-${b}`} className="flex items-center gap-2 text-[1rem]">
                    <Pill tone={b}>{t(meta.label)}</Pill>
                  </h2>
                  <p className="mt-2 text-[0.75rem] text-muted-foreground">{t(meta.why)}</p>
                </div>
                <span className="text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
                  {list.length} {t("topics")}
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {list.map((tp) => (
                  <TopicCard key={tp.id} topicId={tp.id} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <section aria-labelledby="bucket-filtered" className="rounded-2xl border border-dashed border-border p-4">
          <h2 id="bucket-filtered" className="gk-eyebrow">
            {t("filteredOut")}
          </h2>
          <p className="mt-1.5 text-[0.75rem] text-muted-foreground">{t("filteredOutHelp")}</p>
          <ul className="mt-3 space-y-1.5">
            {filtered.map((tp) => (
              <li key={tp.id} className="flex flex-wrap items-baseline gap-x-2 text-[0.8125rem] text-muted-foreground">
                <span className="line-through decoration-border-strong">{L(tp.title)}</span>
                <span className="text-[0.75rem] opacity-80">— {L(tp.why)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
