import type { Source } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";

const icons: Record<Source["kind"], string> = {
  pdf: "M7 3h7l4 4v14H7z M14 3v4h4",
  video: "M4 5h16v14H4z M10 9l5 3-5 3z",
  article: "M5 4h14v16H5z M8 8h8M8 12h8M8 16h5",
  slides: "M3 4h18v11H3z M12 15v5M8 20h8",
  notes: "M6 3h12v18l-6-3-6 3z",
};

export function SourceRow({ source }: { source: Source }) {
  const L = useL();
  const { t } = useLang();

  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:border-border-strong"
    >
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d={icons[source.kind]} />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-[0.875rem] font-semibold leading-snug">{L(source.title)}</span>
        <span className="mt-0.5 block text-[0.75rem] text-muted-foreground">{L(source.meta)}</span>
      </span>
      <span className="ml-auto shrink-0 text-[0.6875rem] font-semibold tabular-nums text-muted-foreground">
        {source.minutes} {t("minutes")}
      </span>
    </a>
  );
}
