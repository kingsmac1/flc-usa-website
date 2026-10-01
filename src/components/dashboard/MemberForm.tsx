/**
 * Add/edit form for a member record — pastor only. Mirrors the field set
 * and conventions of the public membership form (src/routes/membership.tsx)
 * so admin-entered records look and behave the same as visitor-submitted
 * ones, and the visual style of the other dashboard forms (Service Reports,
 * Offerings): a `rounded-2xl border bg-secondary/40` card with grouped
 * `sm:grid-cols-2` fields and a PillButton + inline status message footer.
 */
import { Loader2, ShieldCheck, X } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { MINISTRY_OPTIONS } from "./shared";

export type MemberFormValues = {
  fullName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  preferredContact: string;
  visitorStatus: "" | "first_time" | "attending";
  heardAboutUs: string;
  baptized: "" | "yes" | "no";
  ministryInterests: Set<string>;
  notes: string;
  consentToContact: boolean;
};

export const EMPTY_MEMBER_FORM: MemberFormValues = {
  fullName: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  preferredContact: "",
  visitorStatus: "",
  heardAboutUs: "",
  baptized: "",
  ministryInterests: new Set(),
  notes: "",
  consentToContact: false,
};

const fieldClass =
  "mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent";

type Props = {
  mode: "add" | "edit";
  value: MemberFormValues;
  onChange: (patch: Partial<MemberFormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
  success: boolean;
};

export function MemberForm({ mode, value, onChange, onSubmit, onCancel, submitting, error, success }: Props) {
  const toggleMinistry = (v: string) => {
    const next = new Set(value.ministryInterests);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange({ ministryInterests: next });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-secondary/40 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold tracking-wide text-foreground">
          {mode === "edit" ? "Edit member" : "Add a new member"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
          Cancel
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold sm:col-span-2">
          Full name
          <input
            required
            type="text"
            value={value.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="e.g. Ada Lovelace"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Date of birth
          <input
            type="date"
            value={value.dob}
            onChange={(e) => onChange({ dob: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Gender
          <select value={value.gender} onChange={(e) => onChange({ gender: e.target.value })} className={fieldClass}>
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Marital status
          <select
            value={value.maritalStatus}
            onChange={(e) => onChange({ maritalStatus: e.target.value })}
            className={fieldClass}
          >
            <option value="">Select…</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="divorced">Divorced</option>
          </select>
        </label>

        <label className="block text-sm font-semibold">
          Email
          <input
            required
            type="email"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Phone
          <input
            required
            type="tel"
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="(555) 123-4567"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Preferred contact method
          <select
            value={value.preferredContact}
            onChange={(e) => onChange({ preferredContact: e.target.value })}
            className={fieldClass}
          >
            <option value="">No preference</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text</option>
          </select>
        </label>

        <label className="block text-sm font-semibold sm:col-span-2">
          Street
          <input
            type="text"
            value={value.street}
            onChange={(e) => onChange({ street: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          City
          <input
            type="text"
            value={value.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          State
          <input
            type="text"
            value={value.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          ZIP
          <input
            type="text"
            value={value.zip}
            onChange={(e) => onChange({ zip: e.target.value })}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <h4 className="text-sm font-bold tracking-wide text-foreground">About their visit</h4>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold">Visitor status</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                { value: "first_time", label: "First-time visitor" },
                { value: "attending", label: "Already attending" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="visitor_status"
                    value={opt.value}
                    checked={value.visitorStatus === opt.value}
                    onChange={() => onChange({ visitorStatus: opt.value as MemberFormValues["visitorStatus"] })}
                    className="size-4 accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <label className="block text-sm font-semibold">
            How did they hear about us?
            <select
              value={value.heardAboutUs}
              onChange={(e) => onChange({ heardAboutUs: e.target.value })}
              className={fieldClass}
            >
              <option value="">Select…</option>
              <option value="friend_family">Friend / Family</option>
              <option value="social_media">Social Media</option>
              <option value="walk_in">Walk-in</option>
              <option value="website">Website</option>
              <option value="livestream">Livestream</option>
              <option value="other">Other</option>
            </select>
          </label>
          <div>
            <p className="text-sm font-semibold">Baptized?</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="baptized"
                    value={opt.value}
                    checked={value.baptized === opt.value}
                    onChange={() => onChange({ baptized: opt.value as MemberFormValues["baptized"] })}
                    className="size-4 accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold">Ministry interests</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MINISTRY_OPTIONS.map((opt) => {
              const checked = value.ministryInterests.has(opt.value);
              return (
                <label
                  key={opt.value}
                  className={
                    "flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition-colors " +
                    (checked ? "border-accent bg-accent/10" : "border-border bg-card hover:border-accent/50")
                  }
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMinistry(opt.value)}
                    className="size-4 rounded accent-primary"
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <label className="mt-5 block text-sm font-semibold">
        Notes (optional)
        <textarea
          rows={3}
          value={value.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Anything worth noting…"
          className={fieldClass + " resize-none"}
        />
      </label>

      <label className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
        <input
          type="checkbox"
          checked={value.consentToContact}
          onChange={(e) => onChange({ consentToContact: e.target.checked })}
          className="mt-0.5 size-4 shrink-0 rounded accent-primary"
        />
        <span>This member has agreed to be contacted regarding membership and church-related activities.</span>
      </label>

      <div className="mt-5 flex items-center gap-3">
        <PillButton type="submit" disabled={submitting} className="min-w-36">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving…
            </>
          ) : mode === "edit" ? (
            "Save changes"
          ) : (
            "Add member"
          )}
        </PillButton>
        {success && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            <ShieldCheck className="size-4" aria-hidden="true" />
            {mode === "edit" ? "Updated" : "Added"}
          </span>
        )}
        {error && (
          <span role="alert" className="text-sm text-destructive">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
