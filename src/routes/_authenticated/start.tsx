import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, Input, Progress, Spinner, Textarea } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/start")({
  head: () => ({
    meta: [
      { title: "Set your learning goal — Gatekeeper" },
      {
        name: "description",
        content:
          "Add one learning goal and the material you already have. The gatekeeper decides what deserves your attention first.",
      },
      { property: "og:title", content: "Set your learning goal — Gatekeeper" },
      { property: "og:description", content: "Goal in, priorities out — in two steps." },
    ],
  }),
  component: StartPage,
});

const sampleFiles = [
  "Lecture 06 — Neural Networks.pdf",
  "Assignment 3 brief.pdf",
  "Tutorial notes week 5.jpg",
  "Calculus refresher.pptx",
];

function StartPage() {
  const { t } = useLang();
  const router = useRouter();
  const { state, update, addResource, removeResource } = useStore();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hours, setHours] = useState(2);
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "error">("idle");
  const [fileIndex, setFileIndex] = useState(0);

  useEffect(() => {
    setGoal(state.goal);
    setDeadline(state.deadline || defaultDeadline());
    setHours(state.hours);
  }, [state.goal, state.deadline, state.hours]);

  const submitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim().length < 6) {
      setError(t("goalError"));
      return;
    }
    setError(null);
    update({ goal: goal.trim(), deadline, hours });
    setStep(2);
  };

  const runPrioritisation = () => {
    if (state.resources.length === 0) {
      setError(t("needOne"));
      return;
    }
    setError(null);
    setPhase("loading");
    window.setTimeout(() => {
      update({ planned: true });
      router.navigate({ to: "/plan" });
    }, 1600);
  };

  if (phase === "loading") {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-sm flex-col items-center py-24 text-center" aria-live="polite">
          <Spinner className="size-6 text-primary" />
          <h1 className="mt-5 text-xl">{t("analyzing")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("analyzingSub")}</p>
          <div className="mt-6 w-full">
            <Progress value={70} />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <p className="gk-eyebrow">
          {t("step")} {step} {t("of")} 2
        </p>

        {step === 1 ? (
          <form onSubmit={submitGoal} className="mt-4">
            <h1 className="text-2xl sm:text-3xl">{t("goalTitle")}</h1>


            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="goal" className="gk-eyebrow">
                  {t("goalLabel")}
                </label>
                <Textarea
                  id="goal"
                  rows={3}
                  className="mt-2"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={t("goalPlaceholder")}
                  aria-invalid={!!error}
                  aria-describedby={error ? "goal-error" : undefined}
                />
                {error && (
                  <p id="goal-error" role="alert" className="mt-2 text-[0.8125rem] text-destructive">
                    {error}
                  </p>
                )}

                <p className="mt-4 gk-eyebrow">{t("examples")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["example1", "example2", "example3"] as const).map((k) => {
                    const text = t(k);
                    const active = goal === text;
                    return (
                      <button
                        key={k}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setGoal(text);
                          setError(null);
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-left text-[0.8125rem] transition-colors ${
                          active
                            ? "border-primary text-foreground"
                            : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                        }`}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="deadline" className="gk-eyebrow">
                    {t("deadline")}
                  </label>
                  <Input
                    id="deadline"
                    type="date"
                    className="mt-2"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="hours" className="gk-eyebrow">
                    {t("hoursPerDay")}
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      id="hours"
                      type="range"
                      min={1}
                      max={8}
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="h-1.5 w-full accent-[var(--color-primary)]"
                    />
                    <span className="w-8 text-sm font-semibold tabular-nums">{hours}h</span>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-7 w-full sm:w-auto">
              {t("next")}
            </Button>
          </form>
        ) : (
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl">{t("resourcesTitle")}</h1>


            <div className="mt-6 space-y-4">
              <button
                onClick={() => {
                  addResource({ name: sampleFiles[fileIndex % sampleFiles.length]!, kind: "file" });
                  setFileIndex((i) => i + 1);
                  setError(null);
                }}
                className="w-full rounded-lg border border-dashed border-border-strong bg-surface px-4 py-8 text-center text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="mx-auto mb-2 size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
                </svg>
                {t("dropzone")}
              </button>

              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!link.trim()) return;
                  addResource({ name: link.trim(), kind: "link" });
                  setLink("");
                  setError(null);
                }}
              >
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={t("pasteLink")}
                  aria-label={t("pasteLink")}
                />
                <Button type="submit" variant="outline">
                  {t("add")}
                </Button>
              </form>

              {state.resources.length === 0 ? (
                <p className="text-[0.8125rem] text-muted-foreground">{t("resourceEmpty")}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {state.resources.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 py-2.5">
                      <span className="shrink-0 text-[0.625rem] font-bold uppercase text-muted-foreground">
                        {r.kind === "file" ? "PDF" : "URL"}
                      </span>
                      <span className="min-w-0 truncate text-[0.8125rem]">{r.name}</span>
                      <button
                        onClick={() => removeResource(r.id)}
                        className="ml-auto shrink-0 text-[0.75rem] text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
                      >
                        {t("remove")}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {error && (
                <p role="alert" className="text-[0.8125rem] text-destructive">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={runPrioritisation}>
                {t("prioritize")}
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setStep(1)}>
                {t("back")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function defaultDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toISOString().slice(0, 10);
}
