/**
 * Books CRUD — add/edit form (mirrors the ServiceReportsSection form
 * layout) plus a table with Pencil/Trash2 edit-delete actions (mirrors
 * MembersSection). Cover images upload to the "cms-media" storage bucket;
 * DashboardBody owns the upload + insert/update/delete calls.
 */
import { BookPlus, Loader2, Pencil, ShieldCheck, Trash2, X } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import type { BookRow } from "./types";

export const BOOK_CATEGORY_OPTIONS = ["Purpose", "Family", "Discipleship", "Devotional"] as const;

export type BookFormValues = {
  slug: string;
  title: string;
  author: string;
  price: string;
  category: string;
  description: string;
  buyUrl: string;
  coverUrl: string;
};

export const EMPTY_BOOK_FORM: BookFormValues = {
  slug: "",
  title: "",
  author: "",
  price: "",
  category: BOOK_CATEGORY_OPTIONS[0],
  description: "",
  buyUrl: "",
  coverUrl: "",
};

const fieldClass =
  "mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent";

type Props = {
  rows: BookRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;

  formMode: "add" | "edit" | null;
  formValue: BookFormValues;
  onFormChange: (patch: Partial<BookFormValues>) => void;
  coverFile: File | null;
  onCoverFileChange: (file: File | null) => void;
  onOpenAdd: () => void;
  onOpenEdit: (row: BookRow) => void;
  onCancelForm: () => void;
  onSubmitForm: (e: React.FormEvent) => void;
  onDelete: (row: BookRow) => void;
  formSubmitting: boolean;
  formError: string | null;
  formSuccess: boolean;
};

export function BooksSection({
  rows,
  isLoading,
  isError,
  error,
  formMode,
  formValue,
  onFormChange,
  coverFile,
  onCoverFileChange,
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
            <BookPlus className="size-4" aria-hidden="true" />
            Add book
          </PillButton>
        )}
      </div>

      {formMode ? (
        <form onSubmit={onSubmitForm} className="rounded-2xl border border-border bg-secondary/40 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">{formMode === "add" ? "Add book" : "Edit book"}</h3>
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
                placeholder="e.g. discovering-your-purpose"
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
              Author
              <input
                required
                type="text"
                value={formValue.author}
                onChange={(e) => onFormChange({ author: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Price
              <input
                required
                type="text"
                value={formValue.price}
                onChange={(e) => onFormChange({ price: e.target.value })}
                placeholder="e.g. $14.99"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold">
              Category
              <select
                value={formValue.category}
                onChange={(e) => onFormChange({ category: e.target.value })}
                className={fieldClass}
              >
                {BOOK_CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Buy link
              <input
                required
                type="url"
                value={formValue.buyUrl}
                onChange={(e) => onFormChange({ buyUrl: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Description
              <textarea
                required
                rows={3}
                value={formValue.description}
                onChange={(e) => onFormChange({ description: e.target.value })}
                className={fieldClass + " resize-none"}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Cover image {formMode === "edit" ? "(leave blank to keep the current one)" : ""}
              <input
                required={formMode === "add"}
                type="file"
                accept="image/*"
                onChange={(e) => onCoverFileChange(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-muted-foreground file:ml-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:brightness-95"
              />
              {coverFile ? null : formValue.coverUrl ? (
                <img src={formValue.coverUrl} alt="Current cover" className="mt-3 h-24 w-auto rounded-xl object-cover" />
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
                "Save book"
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
        <LoadingRow message="Loading books…" />
      ) : rows.length === 0 ? (
        <EmptyState message="No books yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Cover</Th>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Price</Th>
              <Th>Category</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td>
                  <img src={r.cover_url} alt="" className="h-12 w-9 rounded object-cover" />
                </Td>
                <Td>
                  <p className="font-semibold">{r.title}</p>
                </Td>
                <Td>{r.author}</Td>
                <Td>{r.price}</Td>
                <Td>{r.category}</Td>
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
