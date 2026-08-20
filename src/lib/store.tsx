import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { topics, type Bucket, type Topic } from "./content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

export type Resource = { id: string; name: string; kind: "file" | "link" };

export type ConceptState = "todo" | "studied" | "understood" | "gap";

export type AppState = {
  goal: string;
  deadline: string;
  hours: number;
  resources: Resource[];
  planned: boolean;
  concepts: Record<string, ConceptState>;
  gaps: string[];
};

const initial: AppState = {
  goal: "",
  deadline: "",
  hours: 2,
  resources: [],
  planned: false,
  concepts: {},
  gaps: [],
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  update: (patch: Partial<AppState>) => void;
  addResource: (r: Omit<Resource, "id">) => void;
  removeResource: (id: string) => void;
  setConcept: (id: string, s: ConceptState) => void;
  addGap: (id: string) => void;
  clearGap: (id: string) => void;
  reset: () => void;
  bucketTopics: (b: Bucket) => Topic[];
  focusTopic: Topic | undefined;
  topicProgress: (t: Topic) => number;
  overallProgress: number;
};

const StoreContext = createContext<Ctx | null>(null);
const KEY = "gk-state-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  // Load the signed-in member's saved state from their account (first time only).
  useEffect(() => {
    if (authLoading || !hydrated || !user) return;
    if (loadedFor.current === user.id) return;
    loadedFor.current = user.id;
    let active = true;

    void (async () => {
      const { data } = await supabase
        .from("learning_state")
        .select("goal, deadline, hours, planned, resources, concepts, gaps")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!active) return;

      if (data && data.planned) {
        setState({
          goal: data.goal ?? "",
          deadline: data.deadline ?? "",
          hours: data.hours ?? 2,
          planned: Boolean(data.planned),
          resources: (data.resources as Resource[]) ?? [],
          concepts: (data.concepts as Record<string, ConceptState>) ?? {},
          gaps: (data.gaps as string[]) ?? [],
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [authLoading, hydrated, user?.id]);

  useEffect(() => {
    if (!user) loadedFor.current = null;
  }, [user]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  // Persist to the member's account (debounced).
  useEffect(() => {
    if (!hydrated || !user || loadedFor.current !== user.id) return;
    const id = window.setTimeout(() => {
      void (async () => {
        const { error } = await supabase.from("learning_state").upsert(
          {
            user_id: user.id,
            goal: state.goal,
            deadline: state.deadline,
            hours: state.hours,
            planned: state.planned,
            resources: state.resources,
            concepts: state.concepts,
            gaps: state.gaps,
          },
          { onConflict: "user_id" },
        );
        if (error) console.error("Could not save your progress", error.message);
      })();
    }, 600);
    return () => window.clearTimeout(id);
  }, [state, hydrated, user?.id]);

  const update = useCallback((patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch })), []);

  const addResource = useCallback((r: Omit<Resource, "id">) => {
    setState((s) => ({ ...s, resources: [...s.resources, { ...r, id: crypto.randomUUID() }] }));
  }, []);

  const removeResource = useCallback((id: string) => {
    setState((s) => ({ ...s, resources: s.resources.filter((r) => r.id !== id) }));
  }, []);

  const setConcept = useCallback((id: string, st: ConceptState) => {
    setState((s) => ({ ...s, concepts: { ...s.concepts, [id]: st } }));
  }, []);

  const addGap = useCallback((id: string) => {
    setState((s) => ({ ...s, gaps: s.gaps.includes(id) ? s.gaps : [...s.gaps, id] }));
  }, []);

  const clearGap = useCallback((id: string) => {
    setState((s) => ({ ...s, gaps: s.gaps.filter((g) => g !== id) }));
  }, []);

  const reset = useCallback(() => {
    setState(initial);
    localStorage.removeItem(KEY);
  }, []);

  const value = useMemo<Ctx>(() => {
    const bucketTopics = (b: Bucket) => topics.filter((t) => t.bucket === b);

    const topicProgress = (t: Topic) => {
      const ids: string[] = [];
      const walk = (cs: typeof t.concepts) =>
        cs.forEach((c) => { ids.push(c.id); if (c.children) walk(c.children); });
      walk(t.concepts);
      if (!ids.length) return 0;
      const good = ids.filter((id) => state.concepts[id] === "understood").length;
      return Math.round((good / ids.length) * 100);
    };

    const all = topics.filter((t) => t.bucket !== "filtered");
    const overallProgress = all.length
      ? Math.round(all.reduce((sum, t) => sum + topicProgress(t), 0) / all.length)
      : 0;

    const focusTopic =
      bucketTopics("urgent").find((t) => topicProgress(t) < 100) ??
      bucketTopics("foundation").find((t) => topicProgress(t) < 100) ??
      bucketTopics("priority").find((t) => topicProgress(t) < 100) ??
      bucketTopics("later").find((t) => topicProgress(t) < 100);

    return {
      state,
      hydrated,
      update,
      addResource,
      removeResource,
      setConcept,
      addGap,
      clearGap,
      reset,
      bucketTopics,
      focusTopic,
      topicProgress,
      overallProgress,
    };
  }, [state, hydrated, update, addResource, removeResource, setConcept, addGap, clearGap, reset]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
