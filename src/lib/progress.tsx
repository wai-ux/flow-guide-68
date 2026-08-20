import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { topics } from "./content";
import { useAuth } from "./auth";
import { useStore } from "./store";

export type ProgressRow = {
  module_slug: string;
  status: string;
  percent: number;
  updated_at: string;
};

/**
 * Keeps per-topic progress in sync with the `user_progress` table and
 * listens for realtime changes so the dashboard always shows live numbers.
 */
export function useProgress() {
  const { user } = useAuth();
  const { state, hydrated, topicProgress } = useStore();
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const lastPushed = useRef<string>("");

  // Initial read + realtime subscription for this student's progress.
  useEffect(() => {
    if (!user) {
      setRows([]);
      return;
    }
    let active = true;

    void (async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("module_slug, status, percent, updated_at")
        .eq("user_id", user.id);
      if (active && data) setRows(data as ProgressRow[]);
    })();

    const channel = supabase
      .channel(`user_progress:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_progress", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const next = payload.new as ProgressRow | null;
          if (!next?.module_slug) return;
          setRows((prev) => {
            const rest = prev.filter((r) => r.module_slug !== next.module_slug);
            return [...rest, next];
          });
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Push local topic progress up (debounced, only when something changed).
  useEffect(() => {
    if (!hydrated || !user || !state.planned) return;

    const payload = topics
      .filter((topic) => topic.bucket !== "filtered")
      .map((topic) => {
        const percent = topicProgress(topic);
        return {
          user_id: user.id,
          module_slug: topic.id,
          percent,
          status: percent >= 100 ? "completed" : percent > 0 ? "in_progress" : "not_started",
          completed_at: percent >= 100 ? new Date().toISOString() : null,
        };
      });

    const signature = payload.map((p) => `${p.module_slug}:${p.percent}`).join("|");
    if (signature === lastPushed.current) return;

    const timer = window.setTimeout(() => {
      lastPushed.current = signature;
      void (async () => {
        const { error } = await supabase
          .from("user_progress")
          .upsert(payload, { onConflict: "user_id,module_slug" });
        if (error) console.error("Could not sync progress", error.message);
      })();
    }, 800);

    return () => window.clearTimeout(timer);
  }, [state.concepts, state.planned, hydrated, user?.id, topicProgress]);

  const tracked = rows.filter((r) => topics.some((t) => t.id === r.module_slug));
  const completed = tracked.filter((r) => r.percent >= 100).length;
  const inProgress = tracked.filter((r) => r.percent > 0 && r.percent < 100).length;
  const lastUpdated = tracked
    .map((r) => r.updated_at)
    .sort()
    .at(-1);

  return { rows: tracked, completed, inProgress, lastUpdated, synced: tracked.length > 0 };
}
