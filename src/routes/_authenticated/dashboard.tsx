import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PriorityBoard, TopicCard } from "@/components/PriorityBoard";
import { Button, Pill, Progress } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Today — Gatekeeper" },
      {
        name: "description",
        content:
          "Your prioritised learning path for today: what to study first, why it matters, and where your understanding gaps are.",
      },
      { property: "og:title", content: "Today — Gatekeeper" },
      {
        property: "og:description",
        content: "One question answered every morning: what should I study today?",
      },
    ],
  }),
  component: Today,
});

function Today() {
  const { t } = useLang();
  const { state, hydrated, overallProgress, focusTopic } = useStore();
  const { user, profile } = useAuth();
  const { completed, inProgress, synced } = useProgress();
  const studentName = profile?.display_name ?? user?.email?.split("@")[0] ?? "";

  if (!hydrated) {
    return (
      <AppShell>
        <div className="space-y-4 py-6" aria-busy="true" aria-label={t("loading")}>
          <div className="h-6 w-40 animate-pulse rounded bg-secondary" />
          <div className="h-40 animate-pulse rounded-lg bg-secondary" />
          <div className="h-24 animate-pulse rounded-lg bg-secondary" />
        </div>
      </AppShell>
    );
  }

  if (!state.planned) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg py-14 text-center sm:py-20">
          <Pill tone="primary">{t("appName")}</Pill>
          <h1 className="mt-5 text-3xl leading-tight sm:text-4xl">{t("todayQuestion")}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("emptyPlanBody")}
          </p>
          <Link to="/start" className="mt-7 inline-block">
            <Button size="lg">{t("buildPlan")}</Button>
          </Link>
          <p className="mt-4 text-[0.75rem] text-muted-foreground">{t("tagline")}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-10">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2.5">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={studentName}
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-[0.75rem] font-bold uppercase text-foreground">
                  {(studentName || "?").charAt(0)}
                </span>
              )}
              <span className="truncate text-[0.8125rem] text-muted-foreground">
                {t("welcomeBack")}, <span className="font-semibold text-foreground">{studentName}</span>
              </span>
            </div>
            <h1 className="max-w-2xl text-[1.75rem] leading-[1.2] tracking-tight sm:text-[2.125rem]">
              {t("todayQuestion")}
            </h1>
            <p className="mt-2 truncate text-sm text-muted-foreground">
              {state.goal} · {overallProgress}% {t("progress")}
            </p>
            <Progress value={overallProgress} className="mt-3 h-1 max-w-xs" />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.75rem] text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground">{completed}</span> {t("topicsDone")}
              </span>
              <span>
                <span className="font-semibold text-foreground">{inProgress}</span> {t("topicsActive")}
              </span>
              {synced && (
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  {t("liveSynced")}
                </span>
              )}
            </div>
          </div>
          <Link to="/start" className="shrink-0">
            <Button size="lg" className="w-full sm:w-auto">
              {t("buildPlan")}
            </Button>
          </Link>
        </header>

        {focusTopic && (
          <section aria-labelledby="focus-title">
            <h2 id="focus-title" className="gk-eyebrow">
              {t("focusToday")}
            </h2>
            <div className="mt-2">
              <TopicCard topicId={focusTopic.id} emphasis />
            </div>
          </section>
        )}

        <section aria-labelledby="board-title">
          <h2 id="board-title" className="gk-eyebrow mb-3">
            {t("attention")}
          </h2>
          <PriorityBoard />
        </section>
      </div>
    </AppShell>
  );
}

