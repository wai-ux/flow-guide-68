import { Link } from "@tanstack/react-router";
import { bucketOrder, topics, type Bucket } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Progress } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const bucketMeta: Record<
  Bucket,
  {
    label: "urgent" | "priority" | "foundation" | "later";
    why: "urgentWhy" | "priorityWhy" | "foundationWhy" | "laterWhy";
    dot: string;
    text: string;
  }
> = {
  urgent: { label: "urgent", why: "urgentWhy", dot: "bg-urgent", text: "text-urgent" },
  priority: { label: "priority", why: "priorityWhy", dot: "bg-priority", text: "text-priority" },
  foundation: { label: "foundation", why: "foundationWhy", dot: "bg-foundation", text: "text-foundation" },
  later: { label: "later", why: "laterWhy", dot: "bg-later", text: "text-later" },
  filtered: { label: "later", why: "laterWhy", dot: "bg-later", text: "text-later" },
};

export function TopicCard({
  topicId,
  emphasis = false,
}: {
  topicId: string;
  emphasis?: boolean;
}) {
  const L = useL();
  const { t } = useLang();
  const { topicProgress } = useStore();
  const topic = topics.find((x) => x.id === topicId)!;
  const pct = topicProgress(topic);

  return (
    <Link
      to="/topic/$id"
      params={{ id: topic.id }}
      className={cn(
        "group block rounded-lg bg-card px-4 py-3.5 transition-colors hover:bg-secondary/70",
        emphasis && "px-5 py-4",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3
          className={cn(
            "min-w-0 font-semibold leading-snug tracking-tight",
            emphasis ? "text-base sm:text-[1.0625rem]" : "text-[0.9375rem]",
          )}
        >
          {L(topic.title)}
        </h3>
        <svg
          viewBox="0 0 24 24"
          className="mt-1 size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Progress value={pct} className="h-1 flex-1" />
        <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted-foreground">
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
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        {bucketOrder.map((b) => {
          const list = bucketTopics(b);
          const meta = bucketMeta[b];
          const isUrgent = b === "urgent";
          return (
            <section
              key={b}
              aria-labelledby={`bucket-${b}`}
              className={cn(
                "gk-panel p-4 sm:p-5",
                isUrgent && "border-urgent/25 bg-urgent-soft/40",
              )}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                <div className="min-w-0">
                  <h2
                    id={`bucket-${b}`}
                    className={cn(
                      "flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.09em]",
                      isUrgent ? meta.text : "text-muted-foreground",
                    )}
                  >
                    <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} />
                    {t(meta.label)}
                  </h2>
                  <p className="mt-1.5 truncate text-[0.75rem] text-muted-foreground">{t(meta.why)}</p>
                </div>
                <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted-foreground">
                  {list.length} {t("topics")}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {list.map((tp) => (
                  <TopicCard key={tp.id} topicId={tp.id} emphasis={isUrgent} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <section aria-labelledby="bucket-filtered">
          <h2 id="bucket-filtered" className="gk-eyebrow">
            {t("filteredOut")}
          </h2>
          <p className="mt-1.5 text-[0.75rem] text-muted-foreground">{t("filteredOutHelp")}</p>
          <ul className="mt-3 space-y-1.5">
            {filtered.map((tp) => (
              <li
                key={tp.id}
                className="flex flex-wrap items-baseline gap-x-2 text-[0.8125rem] text-muted-foreground"
              >
                <span className="line-through decoration-border-strong">{L(tp.title)}</span>
                <span className="text-[0.75rem] opacity-70">— {L(tp.why)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
