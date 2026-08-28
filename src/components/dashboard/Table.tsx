/**
 * Table primitives — sortable header, generic cell, and scrollable shell.
 * Section files compose these instead of writing raw <table> JSX.
 */
import { type ReactNode } from "react";

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
  sortKey,
  currentSort,
  onSort,
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  sortKey?: string;
  currentSort?: string | null;
  onSort?: (key: string) => void;
}) {
  const sorted = currentSort === sortKey;
  return (
    <th
      className={
        "px-4 py-3 text-xs font-semibold tracking-wide uppercase text-muted-foreground " +
        (align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left")
      }
    >
      {sortKey ? (
        <button
          type="button"
          onClick={() => onSort?.(sorted ? "" : sortKey)}
          className="inline-flex items-center gap-1 hover:text-foreground"
        >
          {children}
          {sorted ? " ▲" : ""}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function Td({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
}) {
  return (
    <td
      className={
        "px-4 py-3 align-top " +
        (align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left")
      }
    >
      {children}
    </td>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {message}
    </p>
  );
}

export function LoadingRow({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
      <span
        aria-hidden="true"
        className="inline-block size-4 animate-spin rounded-full border-2 border-muted border-t-accent"
      />
      {message}
    </div>
  );
}
