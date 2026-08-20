import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SourceRow } from "@/components/SourceRow";
import { Button, Card } from "@/components/ui/primitives";
import { sources } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

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

function LibraryPage() {
  const { t } = useLang();
  const { state, removeResource } = useStore();
  const all = Object.values(sources);

  return (
    <AppShell>
      <header className="mb-6">
        <p className="gk-eyebrow">{t("library")}</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">{t("resourcesTitle")}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{t("sourcesHelp")}</p>
      </header>

      <div className="space-y-2.5">
        {all.map((s) => (
          <SourceRow key={s.id} source={s} />
        ))}
      </div>

      {state.resources.length > 0 && (
        <Card className="mt-6">
          <p className="gk-eyebrow">{t("resourcesTitle")}</p>
          <ul className="mt-3 divide-y divide-border">
            {state.resources.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="truncate">{r.name}</span>
                <button
                  onClick={() => removeResource(r.id)}
                  className="ml-auto text-[0.75rem] text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
                >
                  {t("remove")}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-8">
        <Link to="/start">
          <Button variant="outline">{t("add")}</Button>
        </Link>
      </div>
    </AppShell>
  );
}
