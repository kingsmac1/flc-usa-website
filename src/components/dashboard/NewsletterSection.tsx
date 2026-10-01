import { Trash2 } from "lucide-react";
import { ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDateTime } from "./shared";
import type { NewsletterSubscriberRow } from "./types";

type Props = {
  rows: NewsletterSubscriberRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  onDelete: (id: string) => Promise<void>;
};

export function NewsletterSection({ rows, isLoading, isError, error, onDelete }: Props) {
  if (isLoading) return <LoadingRow message="Loading subscribers…" />;
  if (isError) return <ErrorBanner message={error} />;
  if (rows.length === 0) return <EmptyState message="No newsletter subscribers yet." />;

  return (
    <TableShell>
      <thead>
        <tr className="border-b border-border">
          <Th>Email</Th>
          <Th>Subscribed</Th>
          <Th align="right">Actions</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r) => (
          <tr key={r.id}>
            <Td><p className="font-semibold text-foreground">{r.email}</p></Td>
            <Td>{formatDateTime(r.created_at)}</Td>
            <Td align="right">
              <ConfirmButton
                label="Delete"
                icon={<Trash2 className="size-3.5" aria-hidden="true" />}
                confirmLabel="Confirm"
                variant="destructive"
                onConfirm={() => onDelete(r.id)}
              />
            </Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}
