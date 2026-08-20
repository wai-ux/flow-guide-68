import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="group"
      aria-label={t("langLabel")}
      className="flex items-center rounded-full border border-border bg-card p-0.5"
    >
      {(["en", "mm"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider transition-colors",
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l === "en" ? "EN" : "မြန်မာ"}
        </button>
      ))}
    </div>
  );
}

function ThemeSwitch() {
  const { mode, toggle } = useTheme();
  const { t } = useLang();
  return (
    <button
      onClick={toggle}
      aria-label={mode === "dark" ? t("lightMode") : t("darkMode")}
      className="grid size-8 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
    >
      {mode === "dark" ? (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}

const nav = [
  { to: "/", key: "today" },
  { to: "/plan", key: "plan" },
  { to: "/library", key: "library" },
] as const;

export function AppShell({
  children,
  backTo,
  backLabel,
}: {
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
}) {
  const { t } = useLang();
  const { reset } = useStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 20V8l8-4 8 4v12" />
                <path d="M10 20v-6h4v6" />
              </svg>
            </span>
            <span className="font-display text-[0.9375rem] font-semibold tracking-tight">{t("appName")}</span>
          </Link>

          <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 sm:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-2.5 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                reset();
                router.navigate({ to: "/start" as string });
              }}
              className="hidden text-[0.75rem] text-muted-foreground underline-offset-4 hover:underline md:block"
            >
              {t("reset")}
            </button>
            <LangSwitch />
            <ThemeSwitch />
          </div>
        </div>
      </header>

      {backTo && (
        <div className="mx-auto max-w-5xl px-5 pt-5">
          <Button variant="ghost" size="sm" onClick={() => router.navigate({ to: backTo })}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {backLabel ?? t("back")}
          </Button>
        </div>
      )}

      <main id="main" className="mx-auto max-w-5xl px-5 pb-24 pt-6">
        {children}
      </main>

      <nav
        aria-label="Primary mobile"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur sm:hidden"
      >
        <div className="flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex-1 py-3 text-center text-[0.75rem] font-medium text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {t(n.key)}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
