import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = { id: string; display_name: string | null; avatar_url: string | null };

type Ctx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

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

  const user = session?.user ?? null;

  useEffect(() => {
    if (!user) return;
    let active = true;
    void ensureProfile(user).then((p) => {
      if (active) setProfile(p);
    });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const value = useMemo<Ctx>(
    () => ({
      session,
      user,
      profile,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
      },
      refreshProfile: async () => {
        if (user) setProfile(await ensureProfile(user));
      },
    }),
    [session, user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
