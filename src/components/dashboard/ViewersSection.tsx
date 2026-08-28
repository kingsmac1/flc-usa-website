import { useState } from "react";
import { Badge, EmptyState, SearchInput } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDateTime } from "./shared";
import type { ViewerSummary } from "./types";

type Props = {
  rows: ViewerSummary[];
  isLoading: boolean;
  isError: boolean;
  error: string;
};

export function ViewersSection({ rows, isLoading, isError, error }: Props) {
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
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search by name or email"
      />

      {isLoading ? (
        <LoadingRow message="Loading viewers…" />
      ) : filtered.length === 0 ? (
        <EmptyState message="No livestream views yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th align="right">Total views</Th>
              <Th>Most recent view</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.viewer_id} className="border-t border-border">
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
                <Td align="right">
                  <Badge tone="accent">{r.totalViews}</Badge>
                </Td>
                <Td>{formatDateTime(r.lastViewedAt)}</Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
