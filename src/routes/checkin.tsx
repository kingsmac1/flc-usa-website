import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { checkLocation, todayServiceDate, type LocationResult } from "@/lib/checkin";
import { AuthForm } from "@/components/site/AuthForm";
import { PillButton, Section, SectionHeading } from "@/components/site/ui";

const title = "Check In | Fountain of Life Church USA";
const description = "Check yourself in for service at Fountain of Life Church USA when you arrive.";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/checkin" },
    ],
    links: [{ rel: "canonical", href: "/checkin" }],
  }),
  component: CheckInPage,
});

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function CheckInPage() {
  const { user, loading } = useAuth();

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Service Check-In"
          title="Check In"
          intro="Let us know you've arrived for service today."
          animated
        />
      </Section>

      <Section tone="cream" className="flex min-h-[40vh] items-center justify-center">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-10 text-center">
          {loading || !isSupabaseConfigured ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-accent" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                {loading ? "Checking your access…" : "Supabase is not configured."}
              </p>
            </div>
          ) : !user ? (
            <>
              <h2 className="mb-4 font-display text-2xl font-bold">Sign in to check in</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Sign in with your member account to check yourself in for service.
              </p>
              <AuthForm />
            </>
          ) : (
            <CheckInPanel userId={user.id} />
          )}

          {!loading && isSupabaseConfigured ? (
            <p className="mt-6 text-xs text-muted-foreground">
              Having trouble? Ask a staff member to check you in manually.
            </p>
          ) : null}
        </div>
      </Section>
    </>
  );
}

function CheckInPanel({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const queryKey = ["checkin-today", userId] as const;

  const todayQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("check_ins")
        .select("id, checked_in_at")
        .eq("member_id", userId)
        .eq("service_date", todayServiceDate())
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as { id: string; checked_in_at: string } | null;
    },
  });

  const [checking, setChecking] = useState(false);
  const [locationResult, setLocationResult] = useState<LocationResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCheckIn = async () => {
    setSubmitError(null);
    setLocationResult(null);
    setChecking(true);

    const result = await checkLocation();
    setLocationResult(result);

    if (result.status !== "in-range") {
      setChecking(false);
      return;
    }

    const { error } = await supabase.from("check_ins").insert({
      member_id: userId,
      service_date: todayServiceDate(),
      method: "gps",
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setChecking(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey });
  };

  if (todayQuery.isLoading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-accent" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Checking today's status…</p>
      </div>
    );
  }

  if (todayQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {(todayQuery.error as Error).message}
      </p>
    );
  }

  if (todayQuery.data) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="grid size-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>
        <h2 className="font-display text-2xl font-bold">You're checked in for today ✓</h2>
        <p className="text-sm text-muted-foreground">
          Checked in at {formatTime(todayQuery.data.checked_in_at)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid size-14 place-items-center rounded-full border border-primary/30 bg-secondary text-primary">
        <MapPin className="size-7" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-bold">Ready to check in?</h2>
      <p className="text-sm text-muted-foreground">
        Tap the button below — we'll confirm you're at the church using your device's location.
      </p>
      <PillButton
        type="button"
        variant="primary"
        onClick={() => void handleCheckIn()}
        disabled={checking}
        className="w-full"
      >
        {checking ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Getting your location…
          </>
        ) : (
          "Check In"
        )}
      </PillButton>

      {locationResult?.status === "denied" ? (
        <p className="text-sm text-destructive">
          Location permission was denied. Please allow location access for this site in your
          browser or device settings, then try again.
        </p>
      ) : null}
      {locationResult?.status === "unsupported" ? (
        <p className="text-sm text-destructive">
          Your browser doesn't support location services. Please ask a staff member to check you
          in manually instead.
        </p>
      ) : null}
      {locationResult?.status === "out-of-range" ? (
        <p className="text-sm text-destructive">You need to be at the church to check in.</p>
      ) : null}
      {locationResult?.status === "error" ? (
        <p className="text-sm text-destructive">{locationResult.message}</p>
      ) : null}
      {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
    </div>
  );
}
