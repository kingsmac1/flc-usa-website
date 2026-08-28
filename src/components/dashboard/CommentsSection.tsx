import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge, ConfirmButton, EmptyState, SearchInput } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDateTime } from "./shared";
import type { CommentRow } from "./types";

type Props = {
  rows: CommentRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  onDelete: (id: string) => Promise<void>;
};

export function CommentsSection({ rows, isLoading, isError, error, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = rows.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (r.author_id || "").toLowerCase().includes(q) ||
      r.body.toLowerCase().includes(q) ||
      (r.profiles?.full_name || "").toLowerCase().includes(q) ||
      r.content_type.toLowerCase().includes(q)
    );
  });

  if (isError) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="Search comments…" />

      {isLoading ? (
        <LoadingRow message="Loading comments…" />
      ) : filtered.length === 0 ? (
        <EmptyState message="No comments yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Author</Th>
              <Th>Platform</Th>
              <Th>Content</Th>
              <Th>Posted</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td><p className="font-semibold">{r.profiles?.full_name || "—"}</p></Td>
                <Td>
                  <Badge tone="light">{r.content_type}</Badge>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.content_id}</p>
                </Td>
                <Td><p className="line-clamp-3 text-foreground/90">{r.body}</p></Td>
                <Td>{formatDateTime(r.created_at)}</Td>
                <Td align="right">
                  <ConfirmButton
                    label="Delete"
                    icon={<Trash2 className="size-3.5" aria-hidden="true" />}
                    confirmLabel="Confirm"
                    variant="destructive"
                    onConfirm={async () => {
                      setDeletingId(r.id);
                      await onDelete(r.id);
                      setDeletingId(null);
                    }}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
