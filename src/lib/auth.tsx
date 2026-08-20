import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = { id: string; display_name: string | null; avatar_url: string | null };

type Ctx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  /** True when the local, network-free demo session is active. */
  isDemo: boolean;
  startDemo: () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const DEMO_KEY = "gk-demo-session-v1";
const DEMO_USER_ID = "00000000-0000-4000-8000-000000000demo".slice(0, 36);

const demoUser = {
  id: DEMO_USER_ID,
  email: "demo@gatekeeper.app",
  app_metadata: {},
  user_metadata: { full_name: "Demo Student" },
  aud: "authenticated",
  created_at: new Date(0).toISOString(),
} as unknown as User;

const demoSession = {
  access_token: "demo",
  refresh_token: "demo",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 9999999999,
  user: demoUser,
} as unknown as Session;

const AuthContext = createContext<Ctx | null>(null);

async function ensureProfile(user: User): Promise<Profile | null> {
  const { data } = await supabase.from("profiles").select("id, display_name, avatar_url").eq("id", user.id).maybeSingle();
  if (data) return data as Profile;

  const meta = user.user_metadata ?? {};
  const displayName =
    (typeof meta["full_name"] === "string" && meta["full_name"]) ||
    (typeof meta["name"] === "string" && meta["name"]) ||
    user.email?.split("@")[0] ||
    "Student";
  const avatar = typeof meta["avatar_url"] === "string" ? meta["avatar_url"] : null;

  const { data: created } = await supabase
    .from("profiles")
    .upsert({ id: user.id, display_name: displayName, avatar_url: avatar })
    .select("id, display_name, avatar_url")
    .maybeSingle();
  return (created as Profile) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Restore a previously started demo session instantly (no network).
  useEffect(() => {
    try {
      if (localStorage.getItem(DEMO_KEY) === "1") {
        setIsDemo(true);
        setLoading(false);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
      if (!next) setProfile(null);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const realUser = session?.user ?? null;
  const user = realUser ?? (isDemo ? demoUser : null);

  useEffect(() => {
    if (!realUser) return;
    let active = true;
    void ensureProfile(realUser).then((p) => {
      if (active) setProfile(p);
    });
    return () => {
      active = false;
    };
  }, [realUser?.id]);

  const startDemo = useCallback(() => {
    try {
      localStorage.setItem(DEMO_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setIsDemo(true);
    setProfile({ id: DEMO_USER_ID, display_name: "Demo Student", avatar_url: null });
    setLoading(false);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      session: session ?? (isDemo ? demoSession : null),
      user,
      profile: profile ?? (isDemo ? { id: DEMO_USER_ID, display_name: "Demo Student", avatar_url: null } : null),
      loading,
      isDemo: isDemo && !realUser,
      startDemo,
      signOut: async () => {
        try {
          localStorage.removeItem(DEMO_KEY);
        } catch {
          /* storage unavailable */
        }
        setIsDemo(false);
        if (realUser) await supabase.auth.signOut();
        setProfile(null);
      },
      refreshProfile: async () => {
        if (realUser) setProfile(await ensureProfile(realUser));
      },
    }),
    [session, user, realUser, profile, loading, isDemo, startDemo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
