import { LogOut, MessageCircle, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { postGuestComment } from "@/lib/comments.functions";
import { AuthForm } from "./AuthForm";
import { Turnstile } from "./Turnstile";
import { PillButton } from "./ui";

/**
 * Public site key for Cloudflare Turnstile — safe to embed here, same
 * idea as the Supabase anon key. Set the real value from the Turnstile
 * dashboard; the matching secret key lives server-side only, in
 * src/lib/comments.functions.ts.
 */
const TURNSTILE_SITE_KEY = "0x4AAAAAAEt9lSBdpb3JAMhX"; // <-- REPLACE with your real site key

export type ContentType = "livestream" | "devotional";

type Comment = {
  id: string;
  author_id: string | null;
  display_name: string | null;
  body: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

function commentName(c: Comment): string {
  if (c.author_id) return c.profiles?.full_name ?? "A member";
  return c.display_name ?? "Guest";
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(iso).toLocaleDateString();
}

/**
 * Comment feed backed by Supabase. Open to everyone — signed in or not —
 * but only a signed-in user can edit or delete a comment, and only their
 * own. A visitor who isn't signed in must give a display name, and their
 * comments show a "Guest" badge so they're never confused with an
 * authenticated member's comment.
 */
export function CommentFeed({
  title = "Live conversation",
  contentType,
  contentId,
}: {
  title?: string;
  contentType: ContentType;
  contentId: string;
}) {
  const { user, signOut } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [guestName, setGuestName] = useState("");
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const postGuest = useServerFn(postGuestComment);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("comments")
        .select("id, author_id, display_name, body, created_at, profiles(full_name)")
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (!cancelled) {
        setComments((data as unknown as Comment[]) ?? []);
        setLoading(false);
      }
    }
    load();

    const channel = supabase
      .channel(`comments-${contentType}-${contentId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `content_id=eq.${contentId}` },
        (payload) => {
          const row = payload.new as Omit<Comment, "profiles">;
          if ((row as { content_type?: string }).content_type !== contentType) return;
          if (row.author_id) {
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", row.author_id)
              .single()
              .then(({ data: profile }) => {
                setComments((prev) => [{ ...row, profiles: profile }, ...prev]);
              });
          } else {
            setComments((prev) => [{ ...row, profiles: null }, ...prev]);
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "comments" },
        (payload) => {
          const oldRow = payload.old as { id?: string };
          if (oldRow.id) setComments((prev) => prev.filter((c) => c.id !== oldRow.id));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "comments" },
        (payload) => {
          const row = payload.new as Omit<Comment, "profiles">;
          setComments((prev) => prev.map((c) => (c.id === row.id ? { ...c, body: row.body } : c)));
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [contentType, contentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    if (!user) {
      if (!guestName.trim()) {
        setPostError("Please enter your name.");
        return;
      }
      if (!turnstileToken) {
        setPostError("Please complete the verification check above before posting.");
        return;
      }

      setPosting(true);
      setPostError(null);
      const result = await postGuest({
        data: {
          contentType,
          contentId,
          displayName: guestName.trim(),
          body: draft.trim(),
          turnstileToken,
        },
      });
      setPosting(false);

      if (result.error) {
        setPostError(result.error);
        return;
      }
      setDraft("");
      setTurnstileToken(null); // Turnstile tokens are single-use — a fresh one is needed for the next post.
      return;
    }

    // Signed-in posting — unchanged: still a direct insert, gated by the
    // existing "auth.uid() = author_id" RLS policy, which is already a
    // meaningful check on its own since it requires a real account.
    setPosting(true);
    setPostError(null);
    const { error } = await supabase.from("comments").insert({
      author_id: user.id,
      content_type: contentType,
      content_id: contentId,
      body: draft.trim(),
    });
    setPosting(false);
    if (error) {
      setPostError(error.message);
      return;
    }
    setDraft("");
  };

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditDraft(c.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const saveEdit = async (id: string) => {
    if (!editDraft.trim()) return;
    setSavingEdit(true);
    const { error } = await supabase.from("comments").update({ body: editDraft.trim() }).eq("id", id);
    setSavingEdit(false);
    if (!error) {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, body: editDraft.trim() } : c)));
      cancelEdit();
    }
  };

  const deleteComment = async (id: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold">
          <MessageCircle className="size-5 text-primary" aria-hidden="true" />
          {title}
        </h2>
        {user ? (
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAuth((v) => !v)}
            className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Sign in
          </button>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        {loading ? (
          <li className="text-sm text-muted-foreground">Loading comments…</li>
        ) : comments.length === 0 ? (
          <li className="text-sm text-muted-foreground">Be the first to comment.</li>
        ) : (
          comments.map((c) => {
            const name = commentName(c);
            const isOwner = user && c.author_id === user.id;
            const isEditing = editingId === c.id;

            return (
              <li key={c.id} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold uppercase text-primary-foreground"
                >
                  {initialsFor(name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                    {name}
                    {!c.author_id ? (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Guest
                      </span>
                    ) : null}
                    <span className="font-normal text-muted-foreground">· {timeAgo(c.created_at)}</span>
                  </p>

                  {isEditing ? (
                    <div className="mt-2 flex flex-col gap-2">
                      <textarea
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        maxLength={1000}
                        rows={2}
                        className="w-full rounded-2xl border border-border bg-secondary px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-accent"
                      />
                      <div className="flex gap-2">
                        <PillButton
                          type="button"
                          onClick={() => saveEdit(c.id)}
                          disabled={savingEdit || !editDraft.trim()}
                          className="min-h-9 px-4 text-xs"
                        >
                          {savingEdit ? "Saving…" : "Save"}
                        </PillButton>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-3.5" aria-hidden="true" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{c.body}</p>
                  )}

                  {isOwner && !isEditing ? (
                    <div className="mt-1 flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(c)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        <Pencil className="size-3" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteComment(c.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
                      >
                        <Trash2 className="size-3" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })
        )}
      </ul>

      {showAuth && !user ? (
        <div className="mt-6">
          <AuthForm onSuccess={() => setShowAuth(false)} />
          <p className="mt-2 text-xs text-muted-foreground">
            Signing in isn't required to comment — it just lets you edit or delete your comments later.
          </p>
        </div>
      ) : null}

      <form className="mt-6 flex flex-col gap-3" onSubmit={handleSubmit}>
        {!user ? (
          <>
            <label className="sr-only" htmlFor="guest-name">
              Your name
            </label>
            <input
              id="guest-name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              maxLength={60}
              placeholder="Your name"
              className="min-h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent"
            />
            <Turnstile siteKey={TURNSTILE_SITE_KEY} onVerify={setTurnstileToken} />
          </>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="comment-input">
            Write a comment
          </label>
          <input
            id="comment-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={1000}
            placeholder="Share your thoughts…"
            className="min-h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent"
          />
          <PillButton type="submit" disabled={posting || !draft.trim()} className="shrink-0">
            {posting ? "Posting…" : "Post"}
          </PillButton>
        </div>
        {postError ? <p className="text-sm text-destructive">{postError}</p> : null}
      </form>
    </div>
  );
}
