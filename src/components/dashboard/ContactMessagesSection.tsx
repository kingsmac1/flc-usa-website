import { Trash2 } from "lucide-react";
import { ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDateTime } from "./shared";
import type { ContactMessageRow } from "./types";

type Props = {
  rows: ContactMessageRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  onDelete: (id: string) => Promise<void>;
};

export function ContactMessagesSection({ rows, isLoading, isError, error, onDelete }: Props) {
  if (isLoading) return <LoadingRow message="Loading messages…" />;
  if (isError) return <ErrorBanner message={error} />;
  if (rows.length === 0) return <EmptyState message="No contact messages yet." />;

  return (
    <TableShell>
      <thead>
        <tr className="border-b border-border">
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Message</Th>
          <Th>Sent</Th>
          <Th align="right">Actions</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r) => (
          <tr key={r.id}>
            <Td><p className="font-semibold text-foreground">{r.name}</p></Td>
            <Td>{r.email}</Td>
            <Td><p className="line-clamp-3 max-w-md text-foreground/90">{r.message}</p></Td>
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
