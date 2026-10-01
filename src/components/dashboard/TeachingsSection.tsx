/**
 * Teachings CRUD — two levels. The series list looks and behaves like the
 * other CMS sections (form-above-table, Pencil/Trash2 row actions); picking
 * "Manage sessions" on a series drops into a second table for that
 * series' `cms_teaching_items` rows, with its own add/edit/remove form.
 */
import { ChevronLeft, GraduationCap, Loader2, Pencil, Plus, ShieldCheck, Trash2, Video, X } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDate } from "./shared";
import type { TeachingItemRow, TeachingSeriesRow } from "./types";

export type SeriesFormValues = {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
};

export const EMPTY_SERIES_FORM: SeriesFormValues = {
  slug: "",
  title: "",
  summary: "",
  imageUrl: "",
};

export type TeachingItemFormValues = {
  title: string;
  speaker: string;
  date: string;
  duration: string;
  youtube: string;
  summary: string;
  imageUrl: string;
};

export const EMPTY_TEACHING_ITEM_FORM: TeachingItemFormValues = {
  title: "",
  speaker: "",
  date: "",
  duration: "",
  youtube: "",
  summary: "",
  imageUrl: "",
};

const fieldClass =
  "mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent";

type Props = {
  seriesRows: TeachingSeriesRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;

  seriesFormMode: "add" | "edit" | null;
  seriesFormValue: SeriesFormValues;
  onSeriesFormChange: (patch: Partial<SeriesFormValues>) => void;
  seriesImageFile: File | null;
  onSeriesImageFileChange: (file: File | null) => void;
  onOpenAddSeries: () => void;
  onOpenEditSeries: (row: TeachingSeriesRow) => void;
  onCancelSeriesForm: () => void;
  onSubmitSeriesForm: (e: React.FormEvent) => void;
  onDeleteSeries: (row: TeachingSeriesRow) => void;
  seriesFormSubmitting: boolean;
  seriesFormError: string | null;
  seriesFormSuccess: boolean;

  selectedSeries: TeachingSeriesRow | null;
  onSelectSeries: (row: TeachingSeriesRow | null) => void;

  itemFormMode: "add" | "edit" | null;
  itemFormValue: TeachingItemFormValues;
  onItemFormChange: (patch: Partial<TeachingItemFormValues>) => void;
  itemImageFile: File | null;
  onItemImageFileChange: (file: File | null) => void;
  onOpenAddItem: () => void;
  onOpenEditItem: (row: TeachingItemRow) => void;
  onCancelItemForm: () => void;
  onSubmitItemForm: (e: React.FormEvent) => void;
  onDeleteItem: (row: TeachingItemRow) => void;
  itemFormSubmitting: boolean;
  itemFormError: string | null;
  itemFormSuccess: boolean;
};

export function TeachingsSection({
  seriesRows,
  isLoading,
  isError,
  error,
  seriesFormMode,
  seriesFormValue,
  onSeriesFormChange,
  seriesImageFile,
  onSeriesImageFileChange,
  onOpenAddSeries,
  onOpenEditSeries,
  onCancelSeriesForm,
  onSubmitSeriesForm,
  onDeleteSeries,
  seriesFormSubmitting,
  seriesFormError,
  seriesFormSuccess,
  selectedSeries,
  onSelectSeries,
  itemFormMode,
  itemFormValue,
  onItemFormChange,
  itemImageFile,
  onItemImageFileChange,
  onOpenAddItem,
  onOpenEditItem,
  onCancelItemForm,
  onSubmitItemForm,
  onDeleteItem,
  itemFormSubmitting,
  itemFormError,
  itemFormSuccess,
}: Props) {
  if (isError) return <ErrorBanner message={error} />;

  if (selectedSeries) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelectSeries(null)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Back to series
          </button>
          {itemFormMode ? null : (
            <PillButton type="button" onClick={onOpenAddItem}>
              <Plus className="size-4" aria-hidden="true" />
              Add session
            </PillButton>
          )}
        </div>

        <div>
          <h3 className="font-display text-xl font-bold">{selectedSeries.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{selectedSeries.summary}</p>
        </div>

        {itemFormMode ? (
          <form onSubmit={onSubmitItemForm} className="rounded-2xl border border-border bg-secondary/40 p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold">
                {itemFormMode === "add" ? "Add session" : "Edit session"}
              </h4>
              <button
                type="button"
                onClick={onCancelItemForm}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
                aria-label="Cancel"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Title
                <input
                  required
                  type="text"
                  value={itemFormValue.title}
                  onChange={(e) => onItemFormChange({ title: e.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-semibold">
                Speaker
                <input
                  required
                  type="text"
                  value={itemFormValue.speaker}
                  onChange={(e) => onItemFormChange({ speaker: e.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-semibold">
                Date
                <input
                  required
                  type="date"
                  value={itemFormValue.date}
                  onChange={(e) => onItemFormChange({ date: e.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-semibold">
                Duration
                <input
                  required
                  type="text"
                  value={itemFormValue.duration}
                  onChange={(e) => onItemFormChange({ duration: e.target.value })}
                  placeholder="e.g. 48 min"
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">
                YouTube link
                <input
                  required
                  type="url"
                  value={itemFormValue.youtube}
                  onChange={(e) => onItemFormChange({ youtube: e.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">
                Summary (optional)
                <textarea
                  rows={2}
                  value={itemFormValue.summary}
                  onChange={(e) => onItemFormChange({ summary: e.target.value })}
                  className={fieldClass + " resize-none"}
                />
              </label>
              <label className="block text-sm font-semibold sm:col-span-2">
                Custom image (optional — falls back to the YouTube thumbnail)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onItemImageFileChange(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-sm text-muted-foreground file:ml-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:brightness-95"
                />
                {itemImageFile ? null : itemFormValue.imageUrl ? (
                  <img src={itemFormValue.imageUrl} alt="Current" className="mt-3 h-20 w-auto rounded-xl object-cover" />
                ) : null}
              </label>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <PillButton type="submit" disabled={itemFormSubmitting} className="min-w-36">
                {itemFormSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving…
                  </>
                ) : (
                  "Save session"
                )}
              </PillButton>
              {itemFormSuccess && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  Saved
                </span>
              )}
              {itemFormError && (
                <span role="alert" className="text-sm text-destructive">
                  {itemFormError}
                </span>
              )}
            </div>
          </form>
        ) : null}

        {selectedSeries.cms_teaching_items.length === 0 ? (
          <EmptyState message="No sessions in this series yet." />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Speaker</Th>
                <Th>Date</Th>
                <Th>Duration</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {selectedSeries.cms_teaching_items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <Td>
                    <p className="font-semibold">{item.title}</p>
                  </Td>
                  <Td>{item.speaker}</Td>
                  <Td>{formatDate(item.date)}</Td>
                  <Td>{item.duration}</Td>
                  <Td align="right">
                    <div className="flex justify-end gap-2">
                      <PillButton type="button" variant="outline" onClick={() => onOpenEditItem(item)}>
                        <Pencil className="size-4" aria-hidden="true" />
                        Edit
                      </PillButton>
                      <ConfirmButton
                        label="Delete"
                        confirmLabel="Confirm delete"
                        variant="destructive"
                        icon={<Trash2 className="size-3.5" aria-hidden="true" />}
                        onConfirm={() => onDeleteItem(item)}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {seriesFormMode ? null : (
          <PillButton type="button" onClick={onOpenAddSeries} className="ml-auto">
            <GraduationCap className="size-4" aria-hidden="true" />
            Add series
          </PillButton>
        )}
      </div>

      {seriesFormMode ? (
        <form onSubmit={onSubmitSeriesForm} className="rounded-2xl border border-border bg-secondary/40 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">
              {seriesFormMode === "add" ? "Add series" : "Edit series"}
            </h3>
            <button
              type="button"
              onClick={onCancelSeriesForm}
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
                value={seriesFormValue.slug}
                onChange={(e) => onSeriesFormChange({ slug: e.target.value })}
                placeholder="e.g. foundations-of-faith"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Series title
              <input
                required
                type="text"
                value={seriesFormValue.title}
                onChange={(e) => onSeriesFormChange({ title: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Series summary
              <textarea
                required
                rows={2}
                value={seriesFormValue.summary}
                onChange={(e) => onSeriesFormChange({ summary: e.target.value })}
                className={fieldClass + " resize-none"}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Series image {seriesFormMode === "edit" ? "(leave blank to keep the current one)" : ""}
              <input
                required={seriesFormMode === "add"}
                type="file"
                accept="image/*"
                onChange={(e) => onSeriesImageFileChange(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-muted-foreground file:ml-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:brightness-95"
              />
              {seriesImageFile ? null : seriesFormValue.imageUrl ? (
                <img src={seriesFormValue.imageUrl} alt="Current" className="mt-3 h-24 w-auto rounded-xl object-cover" />
              ) : null}
            </label>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <PillButton type="submit" disabled={seriesFormSubmitting} className="min-w-36">
              {seriesFormSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Saving…
                </>
              ) : (
                "Save series"
              )}
            </PillButton>
            {seriesFormSuccess && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Saved
              </span>
            )}
            {seriesFormError && (
              <span role="alert" className="text-sm text-destructive">
                {seriesFormError}
              </span>
            )}
          </div>
        </form>
      ) : null}

      {isLoading ? (
        <LoadingRow message="Loading teaching series…" />
      ) : seriesRows.length === 0 ? (
        <EmptyState message="No teaching series yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Image</Th>
              <Th>Series</Th>
              <Th>Sessions</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {seriesRows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td>
                  <img src={r.image_url} alt="" className="h-12 w-16 rounded object-cover" />
                </Td>
                <Td>
                  <p className="font-semibold">{r.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{r.summary}</p>
                </Td>
                <Td>{r.cms_teaching_items.length}</Td>
                <Td align="right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <PillButton type="button" variant="outline" onClick={() => onSelectSeries(r)}>
                      <Video className="size-4" aria-hidden="true" />
                      Manage sessions
                    </PillButton>
                    <PillButton type="button" variant="outline" onClick={() => onOpenEditSeries(r)}>
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </PillButton>
                    <ConfirmButton
                      label="Delete"
                      confirmLabel="Confirm delete"
                      variant="destructive"
                      icon={<Trash2 className="size-3.5" aria-hidden="true" />}
                      onConfirm={() => onDeleteSeries(r)}
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
