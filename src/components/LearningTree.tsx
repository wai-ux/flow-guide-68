import { useEffect, useState } from "react";
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

function collectIds(concepts: Concept[]): string[] {
  const out: string[] = [];
  const walk = (cs: Concept[]) => cs.forEach((c) => { out.push(c.id); if (c.children) walk(c.children); });
  walk(concepts);
  return out;
}

function idsWithin(c: Concept): string[] {
  return collectIds([c]);
}

function Nodes({
  concepts,
  activeId,
  onSelect,
  open,
  toggle,
  depth,
}: {
  concepts: Concept[];
  activeId: string;
  onSelect: (id: string) => void;
  open: Record<string, boolean>;
  toggle: (id: string) => void;
  depth: number;
}) {
  const L = useL();
  const { t } = useLang();
  const { state } = useStore();

  return (
    <ul className={cn("space-y-1", depth > 0 && "gk-tree-line mt-1 ml-3 pl-3")}>
      {concepts.map((c) => {
        const status = state.concepts[c.id] ?? "todo";
        const active = c.id === activeId;
        const kids = c.children ?? [];
        const isOpen = open[c.id] ?? false;
        const doneKids = collectIds(kids).filter((id) => state.concepts[id] === "understood").length;

        return (
          <li key={c.id}>
            <div
              className={cn(
                "flex items-start gap-1 rounded-lg border transition-colors",
                active ? "border-primary/45 bg-primary/8" : "border-transparent hover:border-border hover:bg-surface",
              )}
            >
              <button
                onClick={() => onSelect(c.id)}
                aria-current={active ? "true" : undefined}
                className="flex min-w-0 flex-1 gap-2.5 p-2.5 text-left"
              >
                <StatusDot status={status} />
                <span className="min-w-0">
                  <span className="block text-[0.8125rem] font-semibold leading-snug">{L(c.title)}</span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-relaxed text-muted-foreground">
                    {L(c.question)}
                  </span>
                  <span className="mt-1 block text-[0.625rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {c.minutes} {t("minutes")}
                    {kids.length > 0 && ` · ${doneKids}/${collectIds(kids).length} ${t("subCount")}`}
                    {status === "gap" && ` · ${t("toReview")}`}
                  </span>
                </span>
              </button>
              {kids.length > 0 && (
                <button
                  onClick={() => toggle(c.id)}
                  aria-expanded={isOpen}
                  aria-label={isOpen ? t("collapseAll") : t("expandAll")}
                  className="mt-2 mr-1.5 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={cn("size-3.5 transition-transform", isOpen && "rotate-90")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}
            </div>
            {kids.length > 0 && isOpen && (
              <Nodes
                concepts={kids}
                activeId={activeId}
                onSelect={onSelect}
                open={open}
                toggle={toggle}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function LearningTree({
  concepts,
  activeId,
  onSelect,
}: {
  concepts: Concept[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useLang();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // keep the active concept's ancestors open
  useEffect(() => {
    const parents: string[] = [];
    const walk = (cs: Concept[], trail: string[]) => {
      cs.forEach((c) => {
        if (idsWithin(c).includes(activeId)) parents.push(...trail, c.id);
        if (c.children) walk(c.children, [...trail, c.id]);
      });
    };
    walk(concepts, []);
    if (parents.length) {
      setOpen((o) => {
        const next = { ...o };
        parents.forEach((id) => { next[id] = true; });
        return next;
      });
    }
  }, [activeId, concepts]);

  const allIds = collectIds(concepts).filter((id) => {
    const find = (cs: Concept[]): boolean =>
      cs.some((c) => (c.id === id ? !!c.children?.length : c.children ? find(c.children) : false));
    return find(concepts);
  });

  const anyOpen = allIds.some((id) => open[id]);

  return (
    <div>
      {allIds.length > 0 && (
        <button
          onClick={() =>
            setOpen(anyOpen ? {} : Object.fromEntries(allIds.map((id) => [id, true])))
          }
          className="mb-2 text-[0.6875rem] font-semibold text-muted-foreground underline decoration-border-strong underline-offset-2 hover:text-foreground"
        >
          {anyOpen ? t("collapseAll") : t("expandAll")}
        </button>
      )}
      <Nodes concepts={concepts} activeId={activeId} onSelect={onSelect} open={open} toggle={(id) => setOpen((o) => ({ ...o, [id]: !o[id] }))} depth={0} />
    </div>
  );
}
