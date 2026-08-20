import { useEffect, useMemo, useRef, useState } from "react";
import type { Checkpoint, Concept } from "@/lib/content";
import { checkpointsFor, recoveryPath, sources } from "@/lib/content";
import { useL, useLang } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Button, Pill, Spinner, Textarea } from "@/components/ui/primitives";

type Phase = "cp" | "recover" | "recovered" | "ask" | "checking" | "gap" | "solid";

/** Heuristic stand-in for the real analysis: depth of reasoning, not keywords alone. */
function judge(answer: string) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const reasons = /(because|so that|otherwise|why|in order|ကြောင့်|ဘာလို့|ဖြစ်လို့|သဖြင့်)/i.test(answer);
  return words >= 25 && reasons;
}

function shuffle<T>(arr: T[], seed: number) {
  const a = [...arr];
  for (let i = a.length - 1 > 0 ? a.length - 1 : 0; i > 0; i--) {
    const j = (seed * (i + 7)) % (i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
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
  const [phase, setPhase] = useState<Phase>("cp");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  const checkpoints = useMemo(() => checkpointsFor(concept), [concept]);
  const [cpIndex, setCpIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [failed, setFailed] = useState<Checkpoint[]>([]);

  const cp = checkpoints[cpIndex];
  const options = useMemo(
    () => (cp ? shuffle(cp.options, cpIndex + 3) : []),
    [cp, cpIndex],
  );
  const steps = useMemo(() => recoveryPath(concept, failed), [concept, failed]);

  useEffect(() => {
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

  useEffect(() => {
    if (phase === "ask") ref.current?.focus();
  }, [phase]);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (options[i]?.correct) return;
    if (cp) {
      setFailed((f) => (f.some((x) => x.id === cp.id) ? f : [...f, cp]));
      setConcept(concept.id, "gap");
      addGap(concept.id);
    }
  };

  const advance = () => {
    setPicked(null);
    if (cpIndex + 1 < checkpoints.length) {
      setCpIndex(cpIndex + 1);
      setPhase("cp");
    } else {
      setPhase("ask");
    }
  };

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
  const recoverySource = steps.find((s) => s.sourceId)?.sourceId;
  const src = recoverySource ? sources[recoverySource] : undefined;

  const RecoverySteps = () => (
    <ol className="mt-3 space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border text-[0.75rem] font-semibold">
            {i + 1}
          </span>
          <div>
            <p className="gk-eyebrow">{L(s.label)}</p>
            <p className="mt-1 text-[0.9375rem] leading-relaxed">{L(s.body)}</p>
          </div>
        </li>
      ))}
    </ol>
  );

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

        {phase === "cp" && cp && (
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {t("cpProgress")} {cpIndex + 1}/{checkpoints.length}
              </p>
              <div className="flex gap-1.5" aria-hidden>
                {checkpoints.map((c, i) => (
                  <span
                    key={c.id}
                    className={`h-1.5 w-6 rounded-full ${i <= cpIndex ? "bg-primary" : "bg-secondary"}`}
                  />
                ))}
              </div>
            </div>

            <p className="mt-4 rounded-lg border-l-2 border-primary bg-surface px-4 py-3.5 text-[1rem] font-semibold leading-relaxed">
              {L(cp.question)}
            </p>

            <div className="mt-4 space-y-2" role="group" aria-label={L(cp.question)}>
              {options.map((o, i) => {
                const chosen = picked === i;
                const reveal = picked !== null;
                const tone = reveal
                  ? o.correct
                    ? "border-primary bg-primary/10"
                    : chosen
                      ? "border-destructive bg-destructive/10"
                      : "border-border opacity-60"
                  : "border-border hover:border-foreground/40";
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={reveal}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-[0.9375rem] leading-relaxed transition-colors ${tone}`}
                  >
                    {L(o.text)}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="mt-4" aria-live="polite">
                {options[picked]?.correct ? (
                  <>
                    <Pill tone="primary">{t("cpCorrect")}</Pill>
                    <div className="mt-4">
                      <Button onClick={advance}>
                        {cpIndex + 1 < checkpoints.length ? t("cpNext") : t("cpToRecall")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Pill tone="urgent">{t("cpWrong")}</Pill>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {t("cpTests")}: {L(cp.tests)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button onClick={() => setPhase("recover")}>{t("recoveryStart")}</Button>
                      <Button variant="ghost" onClick={advance}>
                        {t("skipRecovery")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {phase === "recover" && (
          <div className="mt-5" aria-live="polite">
            <Pill tone="urgent">{t("recoveryTitle")}</Pill>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("recoveryHelp")}</p>
            <RecoverySteps />
            {src?.url && (
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-[0.8125rem] font-semibold text-primary underline underline-offset-4"
              >
                {t("recoveryOpen")} · {L(src.title)}
              </a>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setPicked(null);
                  setPhase("cp");
                }}
              >
                {t("recoveryRecheck")}
              </Button>
              <Button variant="outline" onClick={() => onContinue(child?.id)}>
                {t("closeGap")}
              </Button>
            </div>
          </div>
        )}

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
            <Pill tone="primary">{failed.length ? t("recovered") : t("solid")}</Pill>
            <p className="mt-3 text-sm leading-relaxed">
              {failed.length ? t("recoveredBody") : t("solidBody")}
            </p>
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

            <p className="mt-5 gk-eyebrow">{t("recoveryTitle")}</p>
            <RecoverySteps />

            <div className="mt-5 flex flex-wrap gap-2">
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
