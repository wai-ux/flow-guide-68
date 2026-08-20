import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button, Input, Spinner } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Gatekeeper" },
      {
        name: "description",
        content:
          "Sign in to Gatekeeper to keep your learning goal, sources and understanding progress on your own account. Google sign-in and a one-tap demo account included.",
      },
      { property: "og:title", content: "Sign in — Gatekeeper" },
      { property: "og:description", content: "Your goal, your sources, your progress — saved to your account." },
    ],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  name: z.string().trim().max(60).optional(),
});

type Mode = "signin" | "signup";

function AuthPage() {
  const { t } = useLang();
  const router = useRouter();
  const { session, loading, startDemo } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<null | "email" | "google" | "demo">(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!loading && session) void router.navigate({ to: "/dashboard", replace: true });
  }, [loading, session, router]);

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    const parsed = credentials.safeParse({ email, password, name });
    if (!parsed.success) {
      setError(t("authInvalid"));
      return;
    }
    setBusy("email");
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: parsed.data.name || parsed.data.email.split("@")[0] },
          },
        });
        if (err) throw err;
        if (!data.session) setNotice(t("checkEmail"));
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorTitle"));
    } finally {
      setBusy(null);
    }
  }

  async function onGoogle() {
    setError("");
    setBusy("google");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      setError(result.error.message ?? t("errorTitle"));
      setBusy(null);
      return;
    }
    if (result.redirected) return;
  }

  /** Local demo session: no network, works the same on mobile and desktop. */
  function onDemo() {
    setError("");
    setNotice("");
    setBusy("demo");
    startDemo();
    void router.navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 20V8l8-4 8 4v12" />
              <path d="M10 20v-6h4v6" />
            </svg>
          </span>
          <span className="font-display text-[0.9375rem] font-semibold tracking-tight">{t("appName")}</span>
        </Link>

        <h1 className="text-2xl leading-tight">{mode === "signin" ? t("signInTitle") : t("signUpTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("authSub")}</p>

        <div className="mt-6 space-y-2.5">
          <Button variant="outline" className="w-full" onClick={onDemo} disabled={busy !== null}>
            {busy === "demo" ? <Spinner /> : null}
            {t("demoLogin")}
          </Button>
          <Button variant="outline" className="w-full" onClick={onGoogle} disabled={busy !== null}>
            {busy === "google" ? (
              <Spinner />
            ) : (
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.96h5.28c-.23 1.4-1.6 4.1-5.28 4.1a5.9 5.9 0 0 1 0-11.8c1.5 0 2.66.6 3.3 1.2l2.2-2.12A8.83 8.83 0 0 0 12.18 3a9 9 0 1 0 0 18c5.2 0 8.63-3.65 8.63-8.8 0-.6-.06-1-.16-1.44Z"
                />
              </svg>
            )}
            {t("googleLogin")}
          </Button>
          
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[0.6875rem] uppercase tracking-wider text-muted-foreground">{t("orEmail")}</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onEmailSubmit} className="space-y-3">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="gk-eyebrow">
                {t("nameLabel")}
              </label>
              <Input
                id="name"
                className="mt-1.5"
                value={name}
                maxLength={60}
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="gk-eyebrow">
              {t("emailLabel")}
            </label>
            <Input
              id="email"
              type="email"
              required
              className="mt-1.5"
              value={email}
              maxLength={255}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="gk-eyebrow">
              {t("passwordLabel")}
            </label>
            <Input
              id="password"
              type="password"
              required
              className="mt-1.5"
              value={password}
              maxLength={72}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-border bg-secondary px-3 py-2 text-[0.8125rem] text-foreground">
              {error}
            </p>
          )}

          {notice && (
            <p role="status" className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-[0.8125rem] text-foreground">
              {notice}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={busy !== null}>
            {busy === "email" ? <Spinner /> : null}
            {mode === "signin" ? t("signIn") : t("createAccount")}
          </Button>
        </form>

        <p className="mt-5 text-center text-[0.8125rem] text-muted-foreground">
          {mode === "signin" ? t("noAccount") : t("haveAccount")}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
            className={cn("font-semibold text-primary underline-offset-4 hover:underline")}
          >
            {mode === "signin" ? t("createAccount") : t("signIn")}
          </button>
        </p>
      </div>
    </div>
  );
}
