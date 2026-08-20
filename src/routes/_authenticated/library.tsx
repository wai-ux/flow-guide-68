import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SourceRow } from "@/components/SourceRow";
import { Button, Input, PageHeader } from "@/components/ui/primitives";
import { sources, type Source } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Your material library — Gatekeeper" },
      {
        name: "description",
        content: "Every PDF, video, article and note you added, kept in one place and mapped to the concepts that need it.",
      },
      { property: "og:title", content: "Your material library — Gatekeeper" },
      { property: "og:description", content: "Sources mapped to concepts, not a folder of unread files." },
    ],
  }),
  component: LibraryPage,
});

const kinds = ["video", "article", "pdf", "slides", "notes"] as const;
const kindLabel: Record<(typeof kinds)[number], "kindVideo" | "kindArticle" | "kindPdf" | "kindSlides" | "kindNotes"> = {
  video: "kindVideo",
  article: "kindArticle",
  pdf: "kindPdf",
  slides: "kindSlides",
  notes: "kindNotes",
};

function LibraryPage() {
  const { t } = useLang();
  const L = useL();
  const { state, removeResource } = useStore();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Source["kind"] | "all">("all");

  const all = useMemo(() => Object.values(sources), []);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((s) => {
      if (kind !== "all" && s.kind !== kind) return false;
      if (!q) return true;
      return (
        L(s.title).toLowerCase().includes(q) ||
        L(s.meta).toLowerCase().includes(q) ||
        (s.host ?? "").toLowerCase().includes(q)
      );
    });
  }, [all, kind, query, L]);

  return (
    <AppShell>
      <PageHeader
        eyebrow={t("library")}
        title={t("resourcesTitle")}
        description={t("sourcesHelp")}
        action={
          <Link to="/start">
            <Button size="sm">{t("add")}</Button>
          </Link>
        }
        className="mb-6"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchSources")}
          aria-label={t("searchSources")}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("sources")}>
          {(["all", ...kinds] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[0.75rem] font-medium transition-colors",
                kind === k
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {k === "all" ? t("allKinds") : t(kindLabel[k])}
            </button>
          ))}
        </div>
        <span className="gk-meta sm:ml-auto">
          {visible.length} {t("itemsCount")}
        </span>
      </div>

      <div className="mt-5 space-y-2">
        {visible.map((s) => (
          <SourceRow key={s.id} source={s} />
        ))}
        {visible.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">{t("noMatches")}</p>
        )}
      </div>

      {state.resources.length > 0 && (
        <section className="mt-10">
          <h2 className="gk-eyebrow">{t("yourUploads")}</h2>
          <ul className="mt-3 divide-y divide-border">
            {state.resources.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3 text-sm">
                <span className="truncate">{r.name}</span>
                <button
                  onClick={() => removeResource(r.id)}
                  className="ml-auto shrink-0 text-[0.75rem] text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
                >
                  {t("remove")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
