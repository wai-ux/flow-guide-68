import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./auth";

export const PRO_PRICE_USD = 10;

export type PlanTier = "free" | "pro";

export type Subscription = {
  tier: PlanTier;
  startedAt: string | null;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
};

const emptySub: Subscription = { tier: "free", startedAt: null, renewsAt: null, cancelAtPeriodEnd: false };

type Ctx = {
  sub: Subscription;
  isPro: boolean;
  subscribe: () => void;
  cancel: () => void;
  resume: () => void;
};

const SubContext = createContext<Ctx | null>(null);

const keyFor = (id: string | null) => `gk-sub-v1:${id ?? "anon"}`;

function addMonth(from: Date) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d;
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [sub, setSub] = useState<Subscription>(emptySub);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(userId));
      setSub(raw ? { ...emptySub, ...JSON.parse(raw) } : emptySub);
    } catch {
      setSub(emptySub);
    }
  }, [userId]);

  const persist = useCallback(
    (next: Subscription) => {
      setSub(next);
      try {
        localStorage.setItem(keyFor(userId), JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
    },
    [userId],
  );

  const value = useMemo<Ctx>(() => {
    const now = new Date();
    return {
      sub,
      isPro: sub.tier === "pro",
      subscribe: () =>
        persist({
          tier: "pro",
          startedAt: now.toISOString(),
          renewsAt: addMonth(now).toISOString(),
          cancelAtPeriodEnd: false,
        }),
      cancel: () => persist({ ...sub, cancelAtPeriodEnd: true }),
      resume: () => persist({ ...sub, cancelAtPeriodEnd: false }),
    };
  }, [sub, persist]);

  return <SubContext.Provider value={value}>{children}</SubContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
