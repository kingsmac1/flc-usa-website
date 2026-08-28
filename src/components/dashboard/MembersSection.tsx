import { Download } from "lucide-react";
import { useState } from "react";
import { PillButton } from "@/components/site/ui";
import { Badge, EmptyState, SearchInput } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { MINISTRY_OPTIONS, formatDate } from "./shared";
import { downloadCsv } from "./csv";
import type { MemberRow } from "./types";

type Props = {
  rows: MemberRow[];
  isLoading: boolean;
  isError: boolean;
  error: string;
};

export function MembersSection({ rows, isLoading, isError, error }: Props) {
  const [search, setSearch] = useState("");
  const [ministryFilter, setMinistryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<"full_name" | "created_at" | "email" | "visitor_status">(
    "created_at"
  );

  const filtered = rows.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !(r.full_name || "").toLowerCase().includes(q) &&
        !(r.email || "").toLowerCase().includes(q) &&
        !(r.phone || "").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (statusFilter && r.visitor_status !== statusFilter) return false;
    if (ministryFilter) {
      if (!r.ministry_interests || !r.ministry_interests.includes(ministryFilter)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";
    if (sortKey === "created_at") {
      return new Date(bv as string).getTime() - new Date(av as string).getTime();
    }
    return String(av).localeCompare(String(bv));
  });

  const exportCsv = () => {
    const header = ["Full name", "Email", "Phone", "Visitor status", "Ministries", "Joined"];
    const lines = [
      header,
      ...sorted.map((r) => [
        r.full_name ?? "",
        r.email ?? "",
        r.phone ?? "",
        r.visitor_status ?? "",
        (r.ministry_interests ?? []).join("; "),
        formatDate(r.created_at),
      ]),
    ];
    downloadCsv("members.csv", lines);
  };

  if (isError) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search name, email, or phone"
          fullWidth
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-10 rounded-2xl border border-border bg-secondary px-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
        >
          <option value="">All visitor statuses</option>
          <option value="first_time">First-time visitor</option>
          <option value="attending">Already attending</option>
        </select>
        <select
          value={ministryFilter}
          onChange={(e) => setMinistryFilter(e.target.value)}
          className="min-h-10 rounded-2xl border border-border bg-secondary px-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
        >
          <option value="">All ministries</option>
          {MINISTRY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <PillButton type="button" variant="outline" onClick={exportCsv} disabled={sorted.length === 0}>
          <Download className="size-4" aria-hidden="true" />
          Export CSV
        </PillButton>
      </div>

      {isLoading ? (
        <LoadingRow message="Loading members…" />
      ) : sorted.length === 0 ? (
        <EmptyState message="No members yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th sortKey="full_name" currentSort={sortKey} onSort={(k) => setSortKey(k as "full_name")}>Full name</Th>
              <Th sortKey="email" currentSort={sortKey} onSort={(k) => setSortKey(k as "email")}>Email</Th>
              <Th sortKey="visitor_status" currentSort={sortKey} onSort={(k) => setSortKey(k as "visitor_status")}>Visitor status</Th>
              <Th>Phone</Th>
              <Th>Ministry interests</Th>
              <Th sortKey="created_at" currentSort={sortKey} onSort={(k) => setSortKey(k as "created_at")}>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
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
                <Td>
                  {r.visitor_status ? <Badge>{r.visitor_status.replace("_", " ")}</Badge> : "—"}
                </Td>
                <Td>{r.phone || "—"}</Td>
                <Td>
                  {(r.ministry_interests ?? []).length === 0 ? (
                    "—"
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {r.ministry_interests!.map((m) => {
                        const opt = MINISTRY_OPTIONS.find((o) => o.value === m);
                        return (
                          <span key={m} title={opt?.label ?? m} className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs">
                            {opt?.label ?? m}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </Td>
                <Td>{formatDate(r.created_at)}</Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
