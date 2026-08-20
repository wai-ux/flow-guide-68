import { useEffect, useRef, useState } from "react";
import type { Concept } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Button, Pill, Spinner, Textarea } from "@/components/ui/primitives";

type Phase = "ask" | "checking" | "gap" | "solid" | "error";

/** Heuristic stand-in for the real analysis: depth of reasoning, not keywords alone. */
function judge(answer: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const reasons = /(because|so that|otherwise|why|in order|ကြောင့်|ဘာလို့|ဖြစ်လို့|သဖြင့်)/i.test(answer);
  return words >= 25 && reasons;
}

export function UnderstandingCheck({
  concept,
  onClose,
  onContinue,
}: {
  concept: Concept;
  onClose: () => void;
  onContinue: (childId?: string) => void;
}) {
  const L = useL();
  const { t } = useLang();
  const { setConcept, addGap, clearGap } = useStore();
  const [phase, setPhase] = useState<Phase>("ask");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = () => {
    if (answer.trim().split(/\s+/).filter(Boolean).length < 8) {
      setError(t("answerTooShort"));
      return;
    }
    setError(null);
    setPhase("checking");
    window.setTimeout(() => {
      if (judge(answer)) {
        setConcept(concept.id, "understood");
        clearGap(concept.id);
        setPhase("solid");
      } else {
        setConcept(concept.id, "gap");
        addGap(concept.id);
        setPhase("gap");
      }
    }, 1400);
  };

  const child = concept.children?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="check-title"
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-xl border border-border bg-card p-6 shadow-lift sm:rounded-xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="gk-eyebrow">{t("checkTitle")}</p>
            <h2 id="check-title" className="mt-2 text-xl leading-snug">
              {L(concept.title)}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("back")}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {phase === "ask" && (
          <div className="mt-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{t("checkHelp")}</p>
            <p className="mt-4 rounded-lg border-l-2 border-primary bg-surface px-4 py-3.5 text-[1rem] font-semibold leading-relaxed">
              {L(concept.prompt)}
            </p>
            <Textarea
              ref={ref}
              rows={6}
              className="mt-4"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("answerPlaceholder")}
              aria-label={L(concept.prompt)}
              aria-invalid={!!error}
            />
            {error && (
              <p role="alert" className="mt-2 text-[0.8125rem] text-destructive">
                {error}
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={submit}>{t("submitAnswer")}</Button>
              <Button variant="ghost" onClick={onClose}>
                {t("back")}
              </Button>
            </div>
          </div>
        )}

        {phase === "checking" && (
          <div className="flex flex-col items-center py-12 text-center" aria-live="polite">
            <Spinner className="size-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">{t("checking")}</p>
          </div>
        )}

        {phase === "solid" && (
          <div className="mt-5" aria-live="polite">
            <Pill tone="primary">{t("solid")}</Pill>
            <p className="mt-3 text-sm leading-relaxed">{t("solidBody")}</p>
            <p className="mt-3 rounded-lg bg-surface p-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {L(concept.expects)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => onContinue()}>{t("continueBranch")}</Button>
              <Button variant="ghost" onClick={onClose}>
                {t("done")}
              </Button>
            </div>
          </div>
        )}

        {phase === "gap" && (
          <div className="mt-5" aria-live="polite">
            <Pill tone="urgent">{t("gapFound")}</Pill>
            <p className="mt-3 text-sm leading-relaxed">{L(concept.gap)}</p>

            <div className="mt-4 gk-panel p-4">
              <p className="gk-eyebrow">{t("microBranch")}</p>
              <p className="mt-2 text-[0.9375rem] font-semibold">{L(concept.gapFix)}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">{L(concept.expects)}</p>
            </div>

            <p className="mt-4 gk-eyebrow">{t("recommended")}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button onClick={() => onContinue(child?.id)}>{t("closeGap")}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAnswer("");
                  setPhase("ask");
                }}
              >
                {t("retry")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
