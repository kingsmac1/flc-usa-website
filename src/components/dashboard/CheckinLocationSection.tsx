import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PillButton } from "@/components/site/ui";
import { ErrorBanner, LoadingRow } from "./Table";
import type { CheckinLocationRow } from "./types";

export function CheckinLocationSection({
  row,
  isLoading,
  isError,
  error,
  onSave,
}: {
  row: CheckinLocationRow | null;
  isLoading: boolean;
  isError: boolean;
  error: string;
  onSave: (values: CheckinLocationRow) => Promise<{ error?: string }>;
}) {
  const [lat, setLat] = useState(row ? String(row.church_lat) : "");
  const [lng, setLng] = useState(row ? String(row.church_lng) : "");
  const [radius, setRadius] = useState(row ? String(row.radius_meters) : "150");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (isLoading) return <LoadingRow message="Loading check-in location…" />;
  if (isError) return <ErrorBanner message={error} />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    const parsedRadius = Number(radius);
    if (!Number.isFinite(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      setSaveError("Latitude must be a number between -90 and 90.");
      return;
    }
    if (!Number.isFinite(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      setSaveError("Longitude must be a number between -180 and 180.");
      return;
    }
    if (!Number.isFinite(parsedRadius) || parsedRadius <= 0) {
      setSaveError("Radius must be a positive number of meters.");
      return;
    }

    setSaveError(null);
    setSaving(true);
    const result = await onSave({ church_lat: parsedLat, church_lng: parsedLng, radius_meters: parsedRadius });
    setSaving(false);
    if (result.error) {
      setSaveError(result.error);
      return;
    }
    setSaved(true);
  };

  return (
    <form onSubmit={(e) => void handleSave(e)} className="max-w-lg rounded-2xl border border-border bg-secondary/40 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Latitude
          <input
            required
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g. 40.712800"
            className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
        <label className="block text-sm font-semibold">
          Longitude
          <input
            required
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="e.g. -74.006000"
            className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Check-in radius (meters)
          <input
            required
            type="number"
            step="1"
            min="1"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        A member's GPS check-in is only accepted within this distance of these coordinates. Get the
        exact coordinates from Google Maps: right-click the church's location on the map, then click
        the numbers that appear at the top of the menu to copy them.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <PillButton type="submit" disabled={saving} className="min-w-32">
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving…
            </>
          ) : (
            "Save changes"
          )}
        </PillButton>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            <ShieldCheck className="size-4" aria-hidden="true" /> Saved
          </span>
        )}
        {saveError && (
          <span role="alert" className="text-sm text-destructive">
            {saveError}
          </span>
        )}
      </div>
    </form>
  );
}
