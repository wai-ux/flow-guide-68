import type { Concept } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore, type ConceptState } from "@/lib/store";
import { cn } from "@/lib/utils";

function StatusDot({ status }: { status: ConceptState }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative z-10 mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2 bg-background",
        status === "understood" && "border-primary text-primary",
        status === "gap" && "border-urgent text-urgent",
        status === "studied" && "border-priority text-priority",
        status === "todo" && "border-border-strong text-muted-foreground",
      )}
    >
      {status === "understood" ? (
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M5 13l4 4L19 7" />
        </svg>
      ) : status === "gap" ? (
        <span className="text-[0.625rem] font-black">!</span>
      ) : (
        <span className="size-1.5 rounded-full bg-current opacity-60" />
      )}
    </span>
  );
}

export function LearningTree({
  concepts,
  activeId,
  onSelect,
  depth = 0,
}: {
  concepts: Concept[];
  activeId: string;
  onSelect: (id: string) => void;
  depth?: number;
}) {
  const L = useL();
  const { t } = useLang();
  const { state } = useStore();

  return (
    <ul className={cn("space-y-1.5", depth > 0 && "gk-tree-line mt-1.5 ml-3 pl-3")}>
      {concepts.map((c) => {
        const status = state.concepts[c.id] ?? "todo";
        const active = c.id === activeId;
        return (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex w-full gap-3 rounded-xl border p-3 text-left transition-colors",
                active
                  ? "border-primary/45 bg-primary/8"
                  : "border-transparent hover:border-border hover:bg-surface",
              )}
            >
              <StatusDot status={status} />
              <span className="min-w-0">
                <span className="block text-[0.875rem] font-semibold leading-snug">{L(c.title)}</span>
                <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-muted-foreground">
                  {L(c.question)}
                </span>
                <span className="mt-1.5 block text-[0.6875rem] font-semibold text-muted-foreground">
                  {c.minutes} {t("minutes")}
                  {status === "understood" && ` · ${t("studied")}`}
                  {status === "gap" && ` · ${t("gapFound")}`}
                </span>
              </span>
            </button>
            {c.children && c.children.length > 0 && (
              <LearningTree concepts={c.children} activeId={activeId} onSelect={onSelect} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
