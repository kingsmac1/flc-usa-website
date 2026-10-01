import { Trash2 } from "lucide-react";
import { Badge, ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDateTime } from "./shared";
import type { SalvationDecisionRow } from "./types";

type Props = {
  rows: SalvationDecisionRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  onDelete: (id: string) => Promise<void>;
};

export function SalvationDecisionsSection({ rows, isLoading, isError, error, onDelete }: Props) {
  if (isLoading) return <LoadingRow message="Loading decisions…" />;
  if (isError) return <ErrorBanner message={error} />;
  if (rows.length === 0) return <EmptyState message="No salvation decisions yet." />;

  return (
    <TableShell>
      <thead>
        <tr className="border-b border-border">
          <Th>Name</Th>
          <Th>Decision</Th>
          <Th>Contact</Th>
          <Th>Location</Th>
          <Th>Sent</Th>
          <Th align="right">Actions</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r) => (
          <tr key={r.id}>
            <Td><p className="font-semibold text-foreground">{r.name}</p></Td>
            <Td><Badge tone="accent">{r.decision}</Badge></Td>
            <Td>
              <p>{r.email}</p>
              {r.phone && <p className="text-xs text-muted-foreground">{r.phone}</p>}
            </Td>
            <Td>{r.location || "—"}</Td>
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
