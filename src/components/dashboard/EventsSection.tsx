/**
 * Events CRUD — same add/edit-form-plus-table shape as BooksSection.
 * "Details" is a plain textarea (one point per line), matching the old
 * Sveltia CMS field's UX exactly.
 */
import { CalendarPlus, Loader2, Pencil, ShieldCheck, Trash2, X } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDate } from "./shared";
import type { EventRow } from "./types";

export const EVENT_TYPE_OPTIONS = ["Conference", "Prayer", "Women", "Youth", "Men", "Outreach", "Other"] as const;

export type EventFormValues = {
  slug: string;
  title: string;
  type: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  details: string;
  registration: boolean;
  flyerUrl: string;
};

export const EMPTY_EVENT_FORM: EventFormValues = {
  slug: "",
  title: "",
  type: EVENT_TYPE_OPTIONS[0],
  start: "",
  end: "",
  location: "",
  summary: "",
  details: "",
  registration: true,
  flyerUrl: "",
};

const fieldClass =
  "mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent";

type Props = {
  rows: EventRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;

  formMode: "add" | "edit" | null;
  formValue: EventFormValues;
  onFormChange: (patch: Partial<EventFormValues>) => void;
  flyerFile: File | null;
  onFlyerFileChange: (file: File | null) => void;
  onOpenAdd: () => void;
  onOpenEdit: (row: EventRow) => void;
  onCancelForm: () => void;
  onSubmitForm: (e: React.FormEvent) => void;
  onDelete: (row: EventRow) => void;
  formSubmitting: boolean;
  formError: string | null;
  formSuccess: boolean;
};

export function EventsSection({
  rows,
  isLoading,
  isError,
  error,
  formMode,
  formValue,
  onFormChange,
  flyerFile,
  onFlyerFileChange,
  onOpenAdd,
  onOpenEdit,
  onCancelForm,
  onSubmitForm,
  onDelete,
  formSubmitting,
  formError,
  formSuccess,
}: Props) {
  if (isError) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {formMode ? null : (
          <PillButton type="button" onClick={onOpenAdd} className="ml-auto">
            <CalendarPlus className="size-4" aria-hidden="true" />
            Add event
          </PillButton>
        )}
      </div>

      {formMode ? (
        <form onSubmit={onSubmitForm} className="rounded-2xl border border-border bg-secondary/40 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">{formMode === "add" ? "Add event" : "Edit event"}</h3>
            <button
              type="button"
              onClick={onCancelForm}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
              aria-label="Cancel"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Slug
              <input
                required
                type="text"
                value={formValue.slug}
                onChange={(e) => onFormChange({ slug: e.target.value })}
                placeholder="e.g. destiny-awakening-conference"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Title
              <input
                required
                type="text"
                value={formValue.title}
                onChange={(e) => onFormChange({ title: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Type
              <select value={formValue.type} onChange={(e) => onFormChange({ type: e.target.value })} className={fieldClass}>
                {EVENT_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Location
              <input
                required
                type="text"
                value={formValue.location}
                onChange={(e) => onFormChange({ location: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Start
              <input
                required
                type="datetime-local"
                value={formValue.start}
                onChange={(e) => onFormChange({ start: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              End (optional)
              <input
                type="datetime-local"
                value={formValue.end}
                onChange={(e) => onFormChange({ end: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="mt-1 flex items-center gap-2 text-sm font-semibold sm:col-span-2">
              <input
                type="checkbox"
                checked={formValue.registration}
                onChange={(e) => onFormChange({ registration: e.target.checked })}
                className="size-4 rounded border-border"
              />
              Registration open
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Summary
              <textarea
                required
                rows={2}
                value={formValue.summary}
                onChange={(e) => onFormChange({ summary: e.target.value })}
                className={fieldClass + " resize-none"}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Details (one point per line)
              <textarea
                rows={4}
                value={formValue.details}
                onChange={(e) => onFormChange({ details: e.target.value })}
                className={fieldClass + " resize-none"}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Flyer image {formMode === "edit" ? "(leave blank to keep the current one)" : ""}
              <input
                required={formMode === "add"}
                type="file"
                accept="image/*"
                onChange={(e) => onFlyerFileChange(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-muted-foreground file:ml-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:brightness-95"
              />
              {flyerFile ? null : formValue.flyerUrl ? (
                <img src={formValue.flyerUrl} alt="Current flyer" className="mt-3 h-24 w-auto rounded-xl object-cover" />
              ) : null}
            </label>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <PillButton type="submit" disabled={formSubmitting} className="min-w-36">
              {formSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving…
                </>
              ) : (
                "Save event"
              )}
            </PillButton>
            {formSuccess && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Saved
              </span>
            )}
            {formError && (
              <span role="alert" className="text-sm text-destructive">
                {formError}
              </span>
            )}
          </div>
        </form>
      ) : null}

      {isLoading ? (
        <LoadingRow message="Loading events…" />
      ) : rows.length === 0 ? (
        <EmptyState message="No events yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Type</Th>
              <Th>Start</Th>
              <Th>Location</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td>
                  <p className="font-semibold">{r.title}</p>
                </Td>
                <Td>{r.type}</Td>
                <Td>{formatDate(r.start)}</Td>
                <Td>{r.location}</Td>
                <Td align="right">
                  <div className="flex justify-end gap-2">
                    <PillButton type="button" variant="outline" onClick={() => onOpenEdit(r)}>
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </PillButton>
                    <ConfirmButton
                      label="Delete"
                      confirmLabel="Confirm delete"
                      variant="destructive"
                      icon={<Trash2 className="size-3.5" aria-hidden="true" />}
                      onConfirm={() => onDelete(r)}
                    />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
