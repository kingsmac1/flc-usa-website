import { useState } from "react";
import { Badge, EmptyState, SearchInput } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDate } from "./shared";
import type { AccountRow } from "./types";

type Props = {
  rows: AccountRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
};

function RoleBadge({ account }: { account: AccountRow }) {
  const role = account.role ?? null;
  if (role === "pastor") return <Badge tone="gold">Pastor</Badge>;
  if (role === "admin") return <Badge tone="accent">Admin</Badge>;
  return <Badge>Member</Badge>;
}

export function AccountsSection({ rows, isLoading, isError, error }: Props) {
  const [query, setQuery] = useState("");

  const filtered = rows.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (r.full_name || "").toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q)
    );
  });

  if (isError) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email" />

      {isLoading ? (
        <LoadingRow message="Loading accounts…" />
      ) : filtered.length === 0 ? (
        <EmptyState message="No registered accounts yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Full name</Th>
              <Th>Email</Th>
              <Th>Joined</Th>
              <Th>Role</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td><p className="font-semibold">{r.full_name || "—"}</p></Td>
                <Td>
                  {r.email ? (
                    <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                      {r.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>{formatDate(r.created_at)}</Td>
                <Td><RoleBadge account={r} /></Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
