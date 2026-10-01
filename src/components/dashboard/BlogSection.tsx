/**
 * Blog posts CRUD — same add/edit-form-plus-table shape as BooksSection.
 * "Body" is a plain textarea (paragraphs separated by a blank line),
 * matching the old Sveltia CMS field's UX exactly.
 */
import { Loader2, Pencil, PenSquare, ShieldCheck, Trash2, X } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDate } from "./shared";
import type { BlogPostRow } from "./types";

export const BLOG_CATEGORY_OPTIONS = ["Purpose", "Prayer", "Family", "Church News"] as const;

export type BlogFormValues = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  body: string;
  imageUrl: string;
};

export const EMPTY_BLOG_FORM: BlogFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  date: "",
  author: "",
  category: BLOG_CATEGORY_OPTIONS[0],
  body: "",
  imageUrl: "",
};

const fieldClass =
  "mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent";

type Props = {
  rows: BlogPostRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;

  formMode: "add" | "edit" | null;
  formValue: BlogFormValues;
  onFormChange: (patch: Partial<BlogFormValues>) => void;
  imageFile: File | null;
  onImageFileChange: (file: File | null) => void;
  onOpenAdd: () => void;
  onOpenEdit: (row: BlogPostRow) => void;
  onCancelForm: () => void;
  onSubmitForm: (e: React.FormEvent) => void;
  onDelete: (row: BlogPostRow) => void;
  formSubmitting: boolean;
  formError: string | null;
  formSuccess: boolean;
};

export function BlogSection({
  rows,
  isLoading,
  isError,
  error,
  formMode,
  formValue,
  onFormChange,
  imageFile,
  onImageFileChange,
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
            <PenSquare className="size-4" aria-hidden="true" />
            Add post
          </PillButton>
        )}
      </div>

      {formMode ? (
        <form onSubmit={onSubmitForm} className="rounded-2xl border border-border bg-secondary/40 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">{formMode === "add" ? "Add post" : "Edit post"}</h3>
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
                placeholder="e.g. walking-in-your-inheritance"
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
              Date
              <input
                required
                type="date"
                value={formValue.date}
                onChange={(e) => onFormChange({ date: e.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Category
              <select
                value={formValue.category}
                onChange={(e) => onFormChange({ category: e.target.value })}
                className={fieldClass}
              >
                {BLOG_CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Excerpt
              <textarea
                required
                rows={2}
                value={formValue.excerpt}
                onChange={(e) => onFormChange({ excerpt: e.target.value })}
                className={fieldClass + " resize-none"}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Body (separate paragraphs with a blank line between them)
              <textarea
                required
                rows={8}
                value={formValue.body}
                onChange={(e) => onFormChange({ body: e.target.value })}
                className={fieldClass + " resize-none"}
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Featured image {formMode === "edit" ? "(leave blank to keep the current one)" : ""}
              <input
                required={formMode === "add"}
                type="file"
                accept="image/*"
                onChange={(e) => onImageFileChange(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-muted-foreground file:ml-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:brightness-95"
              />
              {imageFile ? null : formValue.imageUrl ? (
                <img src={formValue.imageUrl} alt="Current featured image" className="mt-3 h-24 w-auto rounded-xl object-cover" />
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
                "Save post"
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
        <LoadingRow message="Loading posts…" />
      ) : rows.length === 0 ? (
        <EmptyState message="No blog posts yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Image</Th>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Date</Th>
              <Th>Category</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td>
                  <img src={r.image_url} alt="" className="h-12 w-16 rounded object-cover" />
                </Td>
                <Td>
                  <p className="font-semibold">{r.title}</p>
                </Td>
                <Td>{r.author}</Td>
                <Td>{formatDate(r.date)}</Td>
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
