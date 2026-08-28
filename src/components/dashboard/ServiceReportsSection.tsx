import { Download, Loader2, ShieldCheck, Upload } from "lucide-react";
import { PillButton } from "@/components/site/ui";
import { EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDate, formatDateTime } from "./shared";
import type { ReportRow } from "./types";

type Props = {
  rows: ReportRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;

  title: string;
  setTitle: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
  uploading: boolean;
  uploadError: string | null;
  uploadSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onDownload: (filePath: string) => void;
};

export function ServiceReportsSection(props: Props) {
  const {
    rows, isLoading, isError, error,
    title, setTitle, date, setDate, notes, setNotes,
    file, setFile, uploading, uploadError, uploadSuccess,
    onSubmit, onDownload,
  } = props;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-secondary/40 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold sm:col-span-2">
            Title
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunday Service report — 24 Aug 2026"
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="block text-sm font-semibold">
            Service date
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="block text-sm font-semibold">
            File (PDF or document)
            <input
              required
              type="file"
              accept="application/pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm text-muted-foreground file:ml-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:brightness-95"
            />
          </label>
          <label className="block text-sm font-semibold sm:col-span-2">
            Notes (optional)
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything worth noting…"
              className="mt-1 w-full resize-none rounded-2xl border border-border bg-card px-4 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <PillButton type="submit" disabled={uploading} className="min-w-36">
            {uploading ? (
              <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> Uploading…</>
            ) : (
              <><Upload className="size-4" aria-hidden="true" /> Upload report</>
            )}
          </PillButton>
          {uploadSuccess && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Uploaded
            </span>
          )}
          {uploadError && (
            <span role="alert" className="text-sm text-destructive">{uploadError}</span>
          )}
        </div>
      </form>

      {isLoading ? (
        <LoadingRow message="Loading reports…" />
      ) : isError ? (
        <ErrorBanner message={error} />
      ) : rows.length === 0 ? (
        <EmptyState message="No reports uploaded yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Service date</Th>
              <Th>Uploaded by</Th>
              <Th>Uploaded</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td>
                  <p className="font-semibold">{r.title}</p>
                  {r.notes && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.notes}</p>}
                </Td>
                <Td>{formatDate(r.service_date)}</Td>
                <Td>{r.profiles?.full_name || "—"}</Td>
                <Td>{formatDateTime(r.created_at)}</Td>
                <Td align="right">
                  <PillButton type="button" variant="outline" onClick={() => onDownload(r.file_path)}>
                    <Download className="size-4" aria-hidden="true" />
                    Download
                  </PillButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
