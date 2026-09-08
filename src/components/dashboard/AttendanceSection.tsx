import { Check, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, ConfirmButton, EmptyState } from "./Primitives";
import { ErrorBanner, LoadingRow, TableShell, Td, Th } from "./Table";
import { formatDateTime } from "./shared";
import type { AccountRow, CheckInRow } from "./types";

type Props = {
  date: string;
  onDateChange: (date: string) => void;
  profiles: AccountRow[];
  profilesLoading: boolean;
  profilesIsError: boolean;
  profilesError: string;
  checkIns: CheckInRow[];
  checkInsLoading: boolean;
  checkInsIsError: boolean;
  checkInsError: string;
  onMarkPresent: (profileId: string) => Promise<void>;
  onUndo: (checkInId: string) => Promise<void>;
};

export function AttendanceSection({
  date,
  onDateChange,
  profiles,
  profilesLoading,
  profilesIsError,
  profilesError,
  checkIns,
  checkInsLoading,
  checkInsIsError,
  checkInsError,
  onMarkPresent,
  onUndo,
}: Props) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const checkInByMember = useMemo(() => {
    const map = new Map<string, CheckInRow>();
    for (const c of checkIns) map.set(c.member_id, c);
    return map;
  }, [checkIns]);

  const presentCount = profiles.filter((p) => checkInByMember.has(p.id)).length;

  if (profilesIsError) return <ErrorBanner message={profilesError} />;
  if (checkInsIsError) return <ErrorBanner message={checkInsError} />;

  const isLoading = profilesLoading || checkInsLoading;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          Service date
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="min-h-10 rounded-2xl border border-border bg-secondary px-3 text-sm focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
      </div>

      {!isLoading ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{presentCount}</span> present /{" "}
          <span className="font-semibold text-foreground">{profiles.length}</span> total members
        </p>
      ) : null}

      {isLoading ? (
        <LoadingRow message="Loading attendance…" />
      ) : profiles.length === 0 ? (
        <EmptyState message="No members registered yet." />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => {
              const checkIn = checkInByMember.get(p.id);
              const isPending = pendingId === p.id;
              return (
                <tr key={p.id} className="border-t border-border">
                  <Td><p className="font-semibold">{p.full_name || "—"}</p></Td>
                  <Td>
                    {p.email ? (
                      <a href={`mailto:${p.email}`} className="text-primary hover:underline">
                        {p.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>
                    {checkIn ? (
                      <div className="flex flex-col gap-0.5">
                        <Badge tone="accent">Present</Badge>
                        <span className="text-xs text-muted-foreground">
                          {checkIn.method === "gps" ? "GPS" : "Marked by staff"} ·{" "}
                          {formatDateTime(checkIn.checked_in_at)}
                        </span>
                      </div>
                    ) : (
                      <Badge>Absent</Badge>
                    )}
                  </Td>
                  <Td align="right">
                    {!checkIn ? (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={async () => {
                          setPendingId(p.id);
                          await onMarkPresent(p.id);
                          setPendingId(null);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/15 disabled:opacity-60"
                      >
                        <Check className="size-3.5" aria-hidden="true" />
                        {isPending ? "Marking…" : "Mark Present"}
                      </button>
                    ) : checkIn.method === "manual" ? (
                      <ConfirmButton
                        label="Undo"
                        confirmLabel="Confirm undo"
                        icon={<Undo2 className="size-3.5" aria-hidden="true" />}
                        variant="outline"
                        onConfirm={async () => {
                          setPendingId(p.id);
                          await onUndo(checkIn.id);
                          setPendingId(null);
                        }}
                      />
                    ) : null}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}
