import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, Card, PageHeader } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { ASSESSMENT_PRICE_USD, PRO_PRICE_USD, useSubscription } from "@/lib/subscription";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings & subscription — Gatekeeper" },
      {
        name: "description",
        content:
          "Manage your Gatekeeper account and unlock Pro for $10 per month: unlimited resources, deeper learning branches and cloud sync.",
      },
      { property: "og:title", content: "Settings & subscription — Gatekeeper" },
      { property: "og:description", content: "Upgrade to Gatekeeper Pro for $10 per month." },
    ],
  }),
  component: SettingsPage,
});

const freeFeatures = ["featFree1", "featFree2", "featFree3"] as const;
const proFeatures = ["featPro1", "featPro2", "featPro3", "featPro4"] as const;
const oneTimeFeatures = ["featOne1", "featOne2", "featOne3", "featOne4"] as const;

function Check({ locked }: { locked?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={locked ? "mt-0.5 size-4 shrink-0 text-muted-foreground" : "mt-0.5 size-4 shrink-0 text-primary"}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {locked ? <path d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z" /> : <path d="M20 6L9 17l-5-5" />}
    </svg>
  );
}

function fmt(date: string | null, lang: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString(lang === "mm" ? "my-MM" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SettingsPage() {
  const { t, lang } = useLang();
  const { user, profile } = useAuth();
  const { sub, isPro, subscribe, buyAssessment, cancel, resume } = useSubscription();
  const [confirming, setConfirming] = useState(false);
  const [justUpgraded, setJustUpgraded] = useState(false);
  const [confirmingOne, setConfirmingOne] = useState(false);
  const [boughtAssessment, setBoughtAssessment] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <PageHeader eyebrow={t("appName")} title={t("settings")} description={t("settingsSub")} className="mb-6" />

        <Card className="p-5">
          <h2 className="text-sm font-semibold">{t("account")}</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("nameLabel")}</dt>
              <dd className="truncate">{profile?.display_name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{t("emailLabel")}</dt>
              <dd className="truncate">{user?.email ?? "—"}</dd>
            </div>
          </dl>
        </Card>

        <section className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">{t("subscription")}</h2>
            <span className="text-[0.75rem] text-muted-foreground">
              {isPro ? t("planPro") : t("planFree")} · {t("currentPlan")}
            </span>
          </div>

          {justUpgraded && (
            <div className="mt-3 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3 text-sm">
              {t("upgradeSuccess")}
            </div>
          )}

          {boughtAssessment && (
            <div className="mt-3 rounded-lg border border-border-strong bg-secondary/40 px-4 py-3 text-sm">
              {t("oneTimeSuccess")}
            </div>
          )}

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card className={`p-5 ${isPro ? "" : "border-border-strong"}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">{t("planFree")}</h3>
                <span className="text-sm text-muted-foreground">$0</span>
              </div>
              <ul className="mt-3 space-y-2 text-[0.8125rem] text-muted-foreground">
                {freeFeatures.map((k) => (
                  <li key={k} className="flex gap-2">
                    <Check />
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
              {!isPro && <p className="mt-4 text-[0.75rem] text-muted-foreground">{t("yourPlanNow")}</p>}
            </Card>

            <Card className={`p-5 ${sub.assessmentCredits > 0 && !isPro ? "border-border-strong" : ""}`}>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">{t("planOneTime")}</h3>
                <span className="text-sm">
                  <span className="font-semibold">${ASSESSMENT_PRICE_USD}</span>
                  <span className="text-muted-foreground"> · {t("oneTimeTag")}</span>
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-[0.8125rem] text-muted-foreground">
                {oneTimeFeatures.map((k) => (
                  <li key={k} className="flex gap-2">
                    <Check locked={!isPro && sub.assessmentCredits === 0} />
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>

              {isPro ? (
                <p className="mt-4 text-[0.75rem] text-muted-foreground">{t("oneTimeIncluded")}</p>
              ) : sub.assessmentCredits > 0 ? (
                <p className="mt-4 text-[0.75rem] text-muted-foreground">
                  {t("oneTimeOwned").replace("{date}", fmt(sub.assessmentPurchasedAt, lang))}
                </p>
              ) : confirmingOne ? (
                <div className="mt-4 space-y-3">
                  <p className="text-[0.8125rem] leading-relaxed">
                    {t("confirmOneTime").replace("{price}", `$${ASSESSMENT_PRICE_USD}`)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        buyAssessment();
                        setConfirmingOne(false);
                        setBoughtAssessment(true);
                      }}
                    >
                      {t("confirmBuy")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmingOne(false)}>
                      {t("cancelAction")}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="mt-4 w-full" onClick={() => setConfirmingOne(true)}>
                    {t("buyOneTime").replace("{price}", `$${ASSESSMENT_PRICE_USD}`)}
                  </Button>
                  <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted-foreground">{t("billingNote")}</p>
                </>
              )}
            </Card>


            <Card className={`p-5 ${isPro ? "border-border-strong" : ""}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">{t("planPro")}</h3>
                <span className="text-sm">
                  <span className="font-semibold">${PRO_PRICE_USD}</span>
                  <span className="text-muted-foreground">/{t("perMonth")}</span>
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-[0.8125rem] text-muted-foreground">
                {proFeatures.map((k) => (
                  <li key={k} className="flex gap-2">
                    <Check locked={!isPro} />
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>

              {!isPro ? (
                <>
                  {confirming ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-[0.8125rem] leading-relaxed">
                        {t("confirmUpgrade").replace("{price}", `$${PRO_PRICE_USD}`)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            subscribe();
                            setConfirming(false);
                            setJustUpgraded(true);
                          }}
                        >
                          {t("confirmPay")}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                          {t("cancelAction")}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button className="mt-4 w-full" onClick={() => setConfirming(true)}>
                      {t("upgradeCta").replace("{price}", `$${PRO_PRICE_USD}`)}
                    </Button>
                  )}
                  <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted-foreground">{t("billingNote")}</p>
                </>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-[0.8125rem] text-muted-foreground">
                    {sub.cancelAtPeriodEnd
                      ? t("endsOn").replace("{date}", fmt(sub.renewsAt, lang))
                      : t("renewsOn").replace("{date}", fmt(sub.renewsAt, lang))}
                  </p>
                  {sub.cancelAtPeriodEnd ? (
                    <Button size="sm" variant="outline" onClick={resume}>
                      {t("resumePlan")}
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={cancel}>
                      {t("cancelPlan")}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
