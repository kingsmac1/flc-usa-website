import { Lock, Trash2 } from "lucide-react";
import { Badge, ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDateTime } from "./shared";
import type { PrayerRequestRow } from "./types";

type Props = {
  rows: PrayerRequestRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  onDelete: (id: string) => Promise<void>;
};

export function PrayerRequestsSection({ rows, isLoading, isError, error, onDelete }: Props) {
  if (isLoading) return <LoadingRow message="Loading prayer requests…" />;
  if (isError) return <ErrorBanner message={error} />;
  if (rows.length === 0) return <EmptyState message="No prayer requests yet." />;

  return (
    <TableShell>
      <thead>
        <tr className="border-b border-border">
          <Th>Name</Th>
          <Th>Category</Th>
          <Th>Request</Th>
          <Th>Contact</Th>
          <Th>Sent</Th>
          <Th align="right">Actions</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r) => (
          <tr key={r.id}>
            <Td>
              <p className="font-semibold text-foreground">{r.name}</p>
              {r.confidential && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs">
                  <Badge tone="danger">
                    <Lock className="mr-1 size-3" aria-hidden="true" />
                    Confidential
                  </Badge>
                </span>
              )}
            </Td>
            <Td><Badge tone="light">{r.category}</Badge></Td>
            <Td><p className="line-clamp-3 max-w-md text-foreground/90">{r.request}</p></Td>
            <Td>
              <p>{r.email}</p>
              {r.phone && <p className="text-xs text-muted-foreground">{r.phone}</p>}
            </Td>
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
