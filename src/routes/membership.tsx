import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { PillButton, Section, SectionHeading } from "@/components/site/ui";
import { CtaBand } from "@/components/site/CtaBand";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const title = "Become a Member | Fountain of Life Church USA";
const description =
  "Join the Fountain of Life Church USA family. Fill in your details and a member of our team will be in touch.";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/membership" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/membership" }],
  }),
  component: MembershipPage,
});

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-accent";

const MINISTRY_OPTIONS = [
  { value: "ushers", label: "Ushering" },
  { value: "choir", label: "Choir / Worship" },
  { value: "media", label: "Media / Tech" },
  { value: "children", label: "Children's Ministry" },
  { value: "youth", label: "Youth" },
  { value: "outreach", label: "Outreach" },
  { value: "prayer_team", label: "Prayer Team" },
  { value: "hospitality", label: "Hospitality" },
  { value: "none_yet", label: "None yet — exploring" },
] as const;

type Step = {
  key: string;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  { key: "personal", label: "Your name", hint: "Tell us who you are", icon: User },
  { key: "contact", label: "Contact", hint: "How we can reach you", icon: Mail },
  { key: "visit", label: "Your visit", hint: "Tell us about you", icon: MapPin },
  { key: "finish", label: "Anything else", hint: "Notes and consent", icon: MessageSquare },
];

function MembershipPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [preferredContact, setPreferredContact] = useState("");
  const [visitorStatus, setVisitorStatus] = useState<"" | "first_time" | "attending">("");
  const [heardAboutUs, setHeardAboutUs] = useState("");
  const [baptized, setBaptized] = useState<"" | "yes" | "no">("");
  const [ministryInterests, setMinistryInterests] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);

  const toggleMinistry = (value: string) => {
    setMinistryInterests((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  /** Per-step required-field check. Returns null when valid, or a short message. */
  const validateStep = (i: number): string | null => {
    switch (i) {
      case 0:
        if (!fullName.trim()) return "Please enter your full name to continue.";
        return null;
      case 1:
        if (!email.trim()) return "Please add an email address so we can reach you.";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return "That email address doesn't look right.";
        if (!phone.trim()) return "Please add a phone number so we can reach you.";
        return null;
      case 2:
        // No required fields on the visit step — every question is optional.
        return null;
      case 3:
        if (!consent) return "Please confirm you'd like to be contacted to finish.";
        return null;
      default:
        return null;
    }
  };

  const goNext = () => {
    const msg = validateStep(stepIndex);
    if (msg) {
      setStepError(msg);
      return;
    }
    setStepError(null);
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const goBack = () => {
    setStepError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const resetForm = () => {
    setFullName("");
    setDob("");
    setGender("");
    setMaritalStatus("");
    setEmail("");
    setPhone("");
    setStreet("");
    setCity("");
    setState("");
    setZip("");
    setPreferredContact("");
    setVisitorStatus("");
    setHeardAboutUs("");
    setBaptized("");
    setMinistryInterests(new Set());
    setNotes("");
    setConsent(false);
    setStepIndex(0);
    setStepError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    // Re-run every step's validation — guards against any step that became
    // invalid while the user was on a later step.
    for (let i = 0; i < STEPS.length; i++) {
      const msg = validateStep(i);
      if (msg) {
        setStepIndex(i);
        setStepError(msg);
        return;
      }
    }
    if (!isSupabaseConfigured) {
      setError("Membership submissions are not available yet — please check back soon.");
      return;
    }

    setSubmitting(true);
    const { error: supabaseError } = await supabase.from("members").insert({
      full_name: fullName.trim(),
      date_of_birth: dob || null,
      gender: gender || null,
      marital_status: maritalStatus || null,
      email: email.trim(),
      phone: phone.trim(),
      address_street: street.trim() || null,
      address_city: city.trim() || null,
      address_state: state.trim() || null,
      address_zip: zip.trim() || null,
      preferred_contact: preferredContact || null,
      visitor_status: visitorStatus || null,
      heard_about_us: heardAboutUs || null,
      baptized: baptized || null,
      ministry_interests: ministryInterests.size > 0 ? [...ministryInterests] : null,
      notes: notes.trim() || null,
      consent_to_contact: consent,
    });
    setSubmitting(false);

    if (supabaseError) {
      setError(supabaseError.message ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepSummary = useMemo(
    () => STEPS.map((s) => ({ ...s })),
    [],
  );
  // stepIndex is always in [0, STEPS.length-1] thanks to goNext/goBack, but
  // TS sees array access as possibly-undefined under noUncheckedIndexedAccess.
  const currentStep = STEPS[stepIndex];

  if (sent) {
    return (
      <Section tone="cream">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center">
          <HeartHandshake className="mx-auto size-12 text-accent" aria-hidden="true" />
          <h2 className="mt-4 font-display text-3xl font-bold">
            Thank you for joining our family!
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Someone from our team will be in touch with you shortly. We are glad you are here.
          </p>
          <PillButton variant="outline" className="mt-8" onClick={resetForm}>
            Submit another response
          </PillButton>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section tone="deep">
        <SectionHeading
          tone="light"
          eyebrow="Membership"
          title="Become a part of our family"
          intro="We are glad you are here. Fill in the form below and a member of our team will be in touch."
        />
      </Section>

      <Section tone="cream">
        <div className="mx-auto max-w-5xl">
          {/* Header strip: title + step counter */}
          <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">
                  {currentStep?.label}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentStep?.hint}
                </p>
              </div>
              <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                Step {stepIndex + 1}/{STEPS.length}
              </p>
            </div>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (stepIndex === STEPS.length - 1) handleSubmit();
              else goNext();
            }}
            className="mt-6 grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]"
            aria-label="Membership form"
          >
            {/* Sidebar stepper — mirrors the reference image */}
            <ol
              className="relative hidden md:block"
              aria-label="Form progress"
            >
              <div
                aria-hidden="true"
                className="absolute left-[19px] top-4 bottom-4 w-px bg-border"
              />
              {stepSummary.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === stepIndex;
                const isDone = i < stepIndex;
                return (
                  <li key={step.key} className="relative pb-7 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span
                        className={
                          "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border " +
                          (isActive
                            ? "border-accent bg-accent text-accent-foreground"
                            : isDone
                              ? "border-accent bg-card text-accent"
                              : "border-border bg-card text-muted-foreground")
                        }
                      >
                        {isDone ? (
                          <Check className="size-4" aria-hidden="true" />
                        ) : (
                          <Icon className="size-4" aria-hidden="true" />
                        )}
                      </span>
                      <div className="pt-1.5">
                        <p
                          className={
                            "text-sm font-semibold " +
                            (isActive ? "text-foreground" : isDone ? "text-foreground" : "text-muted-foreground")
                          }
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{step.hint}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Active step's content */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              {stepIndex === 0 ? (
                <Step1Personal
                  fullName={fullName}
                  setFullName={setFullName}
                  dob={dob}
                  setDob={setDob}
                  gender={gender}
                  setGender={setGender}
                  maritalStatus={maritalStatus}
                  setMaritalStatus={setMaritalStatus}
                />
              ) : null}

              {stepIndex === 1 ? (
                <Step2Contact
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  street={street}
                  setStreet={setStreet}
                  city={city}
                  setCity={setCity}
                  state={state}
                  setState={setState}
                  zip={zip}
                  setZip={setZip}
                  preferredContact={preferredContact}
                  setPreferredContact={setPreferredContact}
                />
              ) : null}

              {stepIndex === 2 ? (
                <Step3Visit
                  visitorStatus={visitorStatus}
                  setVisitorStatus={setVisitorStatus}
                  heardAboutUs={heardAboutUs}
                  setHeardAboutUs={setHeardAboutUs}
                  baptized={baptized}
                  setBaptized={setBaptized}
                  ministryInterests={ministryInterests}
                  toggleMinistry={toggleMinistry}
                />
              ) : null}

              {stepIndex === 3 ? (
                <Step4Finish
                  notes={notes}
                  setNotes={setNotes}
                  consent={consent}
                  setConsent={setConsent}
                />
              ) : null}

              {/* Per-step error */}
              {stepError ? (
                <p
                  role="alert"
                  className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {stepError}
                </p>
              ) : null}

              {/* Submission error (e.g. Supabase failure) */}
              {error ? (
                <p
                  role="alert"
                  className="mt-5 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}

              {/* Nav buttons */}
              <div className="mt-7 flex items-center justify-between gap-3">
                {stepIndex > 0 ? (
                  <PillButton
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={submitting}
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Back
                  </PillButton>
                ) : (
                  <span aria-hidden="true" />
                )}

                {stepIndex < STEPS.length - 1 ? (
                  <PillButton type="submit" variant="accent" className="min-w-40">
                    Next step
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </PillButton>
                ) : (
                  <PillButton
                    type="submit"
                    variant="accent"
                    disabled={submitting}
                    className="min-w-40"
                  >
                    {submitting ? "Submitting..." : "Join the family"}
                  </PillButton>
                )}
              </div>
            </div>
          </form>
        </div>
      </Section>

      <CtaBand items={["prayer", "visit"]} tone="white" />
    </>
  );
}

/* ---------- Per-step subcomponents ----------
 * Splitting each step into its own component keeps the main render function
 * readable and means step-specific state changes can't accidentally clobber
 * a different step's inputs. Each component receives exactly the props it
 * needs — no shared "form state" object that would force a wider refactor.
 */

type Step1Props = {
  fullName: string;
  setFullName: (v: string) => void;
  dob: string;
  setDob: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  maritalStatus: string;
  setMaritalStatus: (v: string) => void;
};

function Step1Personal({
  fullName,
  setFullName,
  dob,
  setDob,
  gender,
  setGender,
  maritalStatus,
  setMaritalStatus,
}: Step1Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-semibold sm:col-span-2">
        Full name
        <input
          required
          autoFocus
          type="text"
          name="full_name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={fieldClass}
          placeholder="e.g. Ada Lovelace"
        />
      </label>
      <label className="block text-sm font-semibold">
        Date of birth
        <input
          type="date"
          name="date_of_birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-semibold">
        Gender
        <select
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={fieldClass}
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </label>
      <label className="block text-sm font-semibold sm:col-span-2">
        Marital status
        <select
          name="marital_status"
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          className={fieldClass}
        >
          <option value="">Select...</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="widowed">Widowed</option>
          <option value="divorced">Divorced</option>
        </select>
      </label>
    </div>
  );
}

type Step2Props = {
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  street: string;
  setStreet: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  state: string;
  setState: (v: string) => void;
  zip: string;
  setZip: (v: string) => void;
  preferredContact: string;
  setPreferredContact: (v: string) => void;
};

function Step2Contact({
  email,
  setEmail,
  phone,
  setPhone,
  street,
  setStreet,
  city,
  setCity,
  state,
  setState,
  zip,
  setZip,
  preferredContact,
  setPreferredContact,
}: Step2Props) {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Email address
          </span>
          <input
            required
            autoFocus
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Phone number
          </span>
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
            placeholder="(555) 123-4567"
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          Preferred contact method
          <select
            name="preferred_contact"
            value={preferredContact}
            onChange={(e) => setPreferredContact(e.target.value)}
            className={fieldClass}
          >
            <option value="">No preference</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text</option>
          </select>
        </label>
      </div>

      <p className="mt-8 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
        Home address (optional)
      </p>
      <div className="mt-2 grid gap-5 sm:grid-cols-6">
        <label className="block text-sm font-semibold sm:col-span-6">
          Street
          <input
            type="text"
            name="address_street"
            autoComplete="street-address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-3">
          City
          <input
            type="text"
            name="address_city"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-2">
          State
          <input
            type="text"
            name="address_state"
            autoComplete="address-level1"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold sm:col-span-1">
          ZIP
          <input
            type="text"
            name="address_zip"
            autoComplete="postal-code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>
    </div>
  );
}

type Step3Props = {
  visitorStatus: "" | "first_time" | "attending";
  setVisitorStatus: (v: "" | "first_time" | "attending") => void;
  heardAboutUs: string;
  setHeardAboutUs: (v: string) => void;
  baptized: "" | "yes" | "no";
  setBaptized: (v: "" | "yes" | "no") => void;
  ministryInterests: Set<string>;
  toggleMinistry: (v: string) => void;
};

function Step3Visit({
  visitorStatus,
  setVisitorStatus,
  heardAboutUs,
  setHeardAboutUs,
  baptized,
  setBaptized,
  ministryInterests,
  toggleMinistry,
}: Step3Props) {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="block text-sm font-semibold">
            Are you a first-time visitor or already attending?
          </p>
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
                  checked={visitorStatus === opt.value}
                  onChange={() => setVisitorStatus(opt.value as "first_time" | "attending")}
                  className="size-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        <label className="block text-sm font-semibold">
          How did you hear about us?
          <select
            name="heard_about_us"
            value={heardAboutUs}
            onChange={(e) => setHeardAboutUs(e.target.value)}
            className={fieldClass}
          >
            <option value="">Select...</option>
            <option value="friend_family">Friend / Family</option>
            <option value="social_media">Social Media</option>
            <option value="walk_in">Walk-in</option>
            <option value="website">Website</option>
            <option value="livestream">Livestream</option>
            <option value="other">Other</option>
          </select>
        </label>
        <div>
          <p className="block text-sm font-semibold">Have you been baptized?</p>
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
                  checked={baptized === opt.value}
                  onChange={() => setBaptized(opt.value as "yes" | "no")}
                  className="size-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7">
        <p className="block text-sm font-semibold">Ministry interest (optional)</p>
        <p className="mt-1 text-xs text-muted-foreground">Pick any that spark your interest.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MINISTRY_OPTIONS.map((opt) => {
            const checked = ministryInterests.has(opt.value);
            return (
              <label
                key={opt.value}
                className={
                  "flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm transition-colors " +
                  (checked
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:border-accent/50")
                }
              >
                <input
                  type="checkbox"
                  value={opt.value}
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
  );
}

type Step4Props = {
  notes: string;
  setNotes: (v: string) => void;
  consent: boolean;
  setConsent: (v: boolean) => void;
};

function Step4Finish({ notes, setNotes, consent, setConsent }: Step4Props) {
  return (
    <div>
      <label className="block text-sm font-semibold">
        Notes or prayer request (optional)
        <textarea
          name="notes"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={fieldClass + " resize-none"}
          placeholder="Share anything on your heart..."
        />
      </label>
      <label className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-4 text-sm">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded accent-primary"
        />
        <span>
          I agree to be contacted by Fountain of Life Church USA regarding my membership and
          church-related activities.
        </span>
      </label>
      <p className="mt-4 text-xs text-muted-foreground">
        By submitting, you'll join our family directory. We'll only use your details to follow up
        about membership and church life.
      </p>
    </div>
  );
}
