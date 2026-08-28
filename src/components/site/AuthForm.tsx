import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { PillButton } from "./ui";

/**
 * Compact sign-up / sign-in form. Toggles between the two modes.
 * Used inline inside CommentFeed when the visitor isn't signed in yet,
 * but written generically enough to drop in anywhere else later (a
 * dedicated /account page, a header dropdown, etc.).
 */
export function AuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  /** Shown after a successful sign-up, prompting the user to confirm their email. */
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result =
      mode === "signUp" ? await signUp(email, password, fullName) : await signIn(email, password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === "signUp") {
      // Supabase requires email confirmation before the account is usable —
      // there's no session yet at this point, so let the user know what to
      // do next rather than leaving them wondering why nothing happened.
      setAwaitingConfirmation(true);
      setFullName("");
      setEmail("");
      setPassword("");
      return;
    }

    setFullName("");
    setEmail("");
    setPassword("");
    onSuccess?.();
  };

  const inputClass =
    "min-h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent";

  if (awaitingConfirmation) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
        <h3 className="font-display text-base font-bold">Check your email</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We've sent a confirmation link to your inbox. Click it to activate your account, then come
          back here and sign in.
        </p>
        <button
          type="button"
          onClick={() => {
            setAwaitingConfirmation(false);
            setMode("signIn");
          }}
          className="mt-4 text-xs font-semibold text-primary underline underline-offset-4"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-secondary/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-bold">
          {mode === "signUp" ? "Create an account" : "Sign in"}
        </h3>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signUp" ? "signIn" : "signUp");
            setError(null);
          }}
          className="text-xs font-semibold text-primary underline underline-offset-4"
        >
          {mode === "signUp" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        {mode === "signUp" ? (
          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
        ) : null}
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <PillButton type="submit" variant="primary" disabled={submitting} className="w-full">
          {submitting ? "Please wait…" : mode === "signUp" ? "Create account" : "Sign in"}
        </PillButton>
      </form>
    </div>
  );
}