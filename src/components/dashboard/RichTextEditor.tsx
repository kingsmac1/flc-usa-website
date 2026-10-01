import { Bold, Code2, Italic, Link as LinkIcon, List, Pilcrow, Underline } from "lucide-react";
import { useRef } from "react";

/**
 * Shared Visual/HTML email body editor — used by both the Messaging
 * composer and the Email Templates editor, so campaigns and confirmation
 * copy support the same "simple formatting" vs. "full custom markup" split.
 *
 * Visual mode is a plain contentEditable with a small execCommand-based
 * toolbar rather than a full rich-text library — good enough for the
 * headings/bold/lists/links a church email needs, without adding a new
 * dependency. HTML mode is a raw textarea (for admins who want full control
 * over layout/tables/inline styles) with a live rendered preview beneath it.
 *
 * The contentEditable is intentionally uncontrolled: `value` only seeds it
 * on first mount, never overwritten while typing (that's what causes
 * cursor-jumping in contentEditable + React). If the caller needs to load a
 * *different* item into the same editor (e.g. switching which template row
 * is open), remount it with a changed `key` prop rather than expecting
 * `value` updates to take effect.
 */
export function RichTextEditor({
  mode,
  onModeChange,
  value,
  onChange,
  minHeightClassName = "min-h-40",
}: {
  mode: "visual" | "html";
  onModeChange: (mode: "visual" | "html") => void;
  value: string;
  onChange: (html: string) => void;
  minHeightClassName?: string;
}) {
  const editableRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, arg?: string) => {
    editableRef.current?.focus();
    document.execCommand(command, false, arg);
    if (editableRef.current) onChange(editableRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  };

  return (
    <div className="mt-1 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/50 px-3 py-2">
        <div className="inline-flex rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onModeChange("visual")}
            className={
              "rounded-full px-3 py-1 transition-colors " +
              (mode === "visual" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")
            }
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => onModeChange("html")}
            className={
              "rounded-full px-3 py-1 transition-colors " +
              (mode === "html" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")
            }
          >
            HTML
          </button>
        </div>

        {mode === "visual" && (
          <div className="flex flex-wrap items-center gap-1">
            <ToolbarButton label="Bold" onMouseDown={() => exec("bold")}>
              <Bold className="size-3.5" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Italic" onMouseDown={() => exec("italic")}>
              <Italic className="size-3.5" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Underline" onMouseDown={() => exec("underline")}>
              <Underline className="size-3.5" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Heading" onMouseDown={() => exec("formatBlock", "h2")}>
              <span className="text-[11px] font-black">H2</span>
            </ToolbarButton>
            <ToolbarButton label="Paragraph" onMouseDown={() => exec("formatBlock", "p")}>
              <Pilcrow className="size-3.5" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Bullet list" onMouseDown={() => exec("insertUnorderedList")}>
              <List className="size-3.5" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Link" onMouseDown={insertLink}>
              <LinkIcon className="size-3.5" aria-hidden="true" />
            </ToolbarButton>
          </div>
        )}
        {mode === "html" && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Code2 className="size-3.5" aria-hidden="true" />
            Raw HTML — rendered in the branded email wrapper
          </span>
        )}
      </div>

      {mode === "visual" ? (
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className={`${minHeightClassName} px-4 py-3 text-sm leading-relaxed outline-none [&_h2]:mt-2 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_ul]:list-disc [&_ul]:pl-5`}
        />
      ) : (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className={`${minHeightClassName} w-full resize-y border-0 bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-foreground outline-none`}
            placeholder="<p>Write raw HTML…</p>"
          />
          {value.trim() && (
            <div className="border-t border-border bg-secondary/30 px-4 py-3">
              <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Preview
              </p>
              <div
                className="rounded-xl border border-border bg-card p-3 text-sm [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ToolbarButton({
  label,
  onMouseDown,
  children,
}: {
  label: string;
  onMouseDown: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
    >
      {children}
    </button>
  );
}
