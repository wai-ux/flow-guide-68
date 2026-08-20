import type { Source } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";

const icons: Record<Source["kind"], string> = {
  pdf: "M7 3h7l4 4v14H7z M14 3v4h4",
  video: "M4 5h16v14H4z M10 9l5 3-5 3z",
  article: "M5 4h14v16H5z M8 8h8M8 12h8M8 16h5",
  slides: "M3 4h18v11H3z M12 15v5M8 20h8",
  notes: "M6 3h12v18l-6-3-6 3z",
};

const kindKey: Record<Source["kind"], "kindPdf" | "kindVideo" | "kindArticle" | "kindSlides" | "kindNotes"> = {
  pdf: "kindPdf",
  video: "kindVideo",
  article: "kindArticle",
  slides: "kindSlides",
  notes: "kindNotes",
};

export function SourceRow({ source }: { source: Source }) {
  const L = useL();
  const { t } = useLang();
  const external = Boolean(source.url);

  const inner = (
    <>
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d={icons[source.kind]} />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="rounded border border-border px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide text-muted-foreground">
            {t(kindKey[source.kind])}
          </span>
          {source.host && (
            <span className="text-[0.625rem] font-semibold text-primary">{source.host}</span>
          )}
        </span>
        <span className="mt-1 block text-[0.875rem] font-semibold leading-snug">{L(source.title)}</span>
        <span className="mt-0.5 block text-[0.75rem] text-muted-foreground">{L(source.meta)}</span>
      </span>
      <span className="ml-auto flex shrink-0 flex-col items-end gap-1">
        <span className="text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
          {source.minutes} {t("minutes")}
        </span>
        <span className="text-[0.6875rem] font-semibold text-primary">
          {external
            ? source.kind === "video"
              ? `${t("watch")} ↗`
              : `${t("read")} ↗`
            : t("yourFile")}
        </span>
      </span>
    </>
  );

  const cls =
    "flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-border-strong";

  if (!external) return <div className={cls}>{inner}</div>;

  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}
