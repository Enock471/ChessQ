"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type Mode = "sign-in" | "sign-up";

const inputClassName =
  "w-full rounded-lg border border-border bg-surface-900/60 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/30";

// Simple format check, not full RFC validation — just enough to catch
// obvious typos ("bob@", "bob.com") before we bother the server.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

// Supabase's raw auth error messages are usually readable, but a couple
// of common ones read better rephrased for a non-technical user. Anything
// we haven't mapped falls back to Supabase's own message rather than
// hiding it — better to show something than nothing.
function getFriendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "That email is already registered — try logging in instead.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email before logging in.";
  }
  if (lower.includes("rate limit")) {
    return "Too many attempts — please wait a moment and try again.";
  }
  if (lower.includes("unable to validate email")) {
    return "That doesn't look like a valid email address.";
  }

  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Already logged in (or just logged in via the form below) — leave
  // this page. Also covers someone manually visiting /login while
  // already authenticated.
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    // Client-side checks first, so obvious mistakes are caught instantly
    // instead of round-tripping to the server.
    if (mode === "sign-up" && username.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters.");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          // Read by the handle_new_user trigger (sub-phase 1.2) to name
          // the auto-created profiles row.
          options: { data: { username: username.trim() } },
        });

        if (error) {
          setErrorMessage(getFriendlyAuthError(error.message));
          return;
        }

        // If email confirmation is still required in Supabase's Auth
        // settings, signUp succeeds but there's no active session yet.
        if (!data.session) {
          setInfoMessage(
            "Account created — check your email to confirm before logging in.",
          );
        }
        // If a session did come back (confirmation disabled), the
        // AuthProvider's listener picks it up and the effect above
        // redirects home automatically.
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMessage(getFriendlyAuthError(error.message));
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-950 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/25">
            <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.2} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Chess<span className="text-accent">Q</span>
          </span>
        </div>

        <GlassCard className="p-6 sm:p-7">
          <div className="mb-6 flex rounded-xl border border-border bg-surface-900/60 p-1">
            <ModeButton
              label="Log In"
              active={mode === "sign-in"}
              onClick={() => setMode("sign-in")}
            />
            <ModeButton
              label="Sign Up"
              active={mode === "sign-up"}
              onClick={() => setMode("sign-up")}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "sign-up" && (
              <Field label="Username">
                <input
                  type="text"
                  maxLength={20}
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="e.g. knight_rider"
                  className={inputClassName}
                />
              </Field>
            )}

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClassName}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={inputClassName}
              />
            </Field>

            {errorMessage && (
              <p className="text-xs font-medium text-red-400">
                {errorMessage}
              </p>
            )}
            {infoMessage && (
              <p className="text-xs font-medium text-accent">{infoMessage}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wide text-surface-950 transition hover:bg-accent-hover glow-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Please wait..."
                : mode === "sign-in"
                  ? "Log In"
                  : "Create Account"}
            </button>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg px-3 py-2 text-xs font-bold transition",
        active
          ? "bg-accent text-surface-950"
          : "text-zinc-400 hover:text-zinc-200",
      )}
    >
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}
