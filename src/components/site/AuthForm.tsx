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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

    setFullName("");
    setEmail("");
    setPassword("");
    onSuccess?.();
  };

  const inputClass =
    "min-h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent";

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
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <PillButton type="submit" variant="primary" disabled={submitting} className="w-full">
          {submitting ? "Please wait…" : mode === "signUp" ? "Create account" : "Sign in"}
        </PillButton>
        {mode === "signUp" ? (
          <p className="text-xs text-muted-foreground">
            You may need to confirm your email before signing in, depending on the church's account
            settings.
          </p>
        ) : null}
      </form>
    </div>
  );
}
