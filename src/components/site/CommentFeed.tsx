import { LogOut, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { AuthForm } from "./AuthForm";
import { PillButton } from "./ui";

export type ContentType = "livestream" | "devotional";

type Comment = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

function initialsFor(name: string | null | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
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
 * Comment feed backed by Supabase, shared by the livestream page and every
 * daily devotional page. Pass a stable contentType/contentId pair so each
 * surface gets its own thread — e.g. contentType="devotional" with
 * contentId={date} for a devotional, or contentType="livestream" with
 * contentId="general" for the one ongoing livestream conversation.
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
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("comments")
        .select("id, author_id, body, created_at, profiles(full_name)")
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

    // Live updates: new comments from anyone appear without a refresh.
    const channel = supabase
      .channel(`comments-${contentType}-${contentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `content_id=eq.${contentId}`,
        },
        (payload) => {
          const row = payload.new as Omit<Comment, "profiles">;
          if (row && (row as { content_type?: string }).content_type === contentType) {
            // Realtime payloads don't include the joined profile — fetch it.
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", row.author_id)
              .single()
              .then(({ data: profile }) => {
                setComments((prev) => [{ ...row, profiles: profile }, ...prev]);
              });
          }
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
    if (!user || !draft.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("comments").insert({
      author_id: user.id,
      content_type: contentType,
      content_id: contentId,
      body: draft.trim(),
    });
    setPosting(false);
    if (!error) setDraft("");
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      {!isSupabaseConfigured ? (
        <p className="text-sm text-muted-foreground">Comments are not available yet.</p>
      ) : (
        <>
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
            Sign in to comment
          </button>
        )}
      </div>

      <ul className="mt-6 space-y-4">
        {loading ? (
          <li className="text-sm text-muted-foreground">Loading comments…</li>
        ) : comments.length === 0 ? (
          <li className="text-sm text-muted-foreground">Be the first to comment.</li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold uppercase text-primary-foreground"
              >
                {initialsFor(c.profiles?.full_name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {c.profiles?.full_name ?? "A member"}{" "}
                  <span className="font-normal text-muted-foreground">· {timeAgo(c.created_at)}</span>
                </p>
                <p className="text-sm text-muted-foreground">{c.body}</p>
              </div>
            </li>
          ))
        )}
      </ul>

      {user ? (
        <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
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
        </form>
      ) : showAuth ? (
        <div className="mt-6">
          <AuthForm onSuccess={() => setShowAuth(false)} />
        </div>
      ) : (
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setShowAuth(true);
          }}
        >
          <label className="sr-only" htmlFor="comment-input-disabled">
            Sign in to comment
          </label>
          <input
            id="comment-input-disabled"
            readOnly
            onFocus={() => setShowAuth(true)}
            placeholder="Sign in to join the conversation"
            className="min-h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm placeholder:text-muted-foreground"
          />
          <PillButton type="submit" className="shrink-0">
            Sign in
          </PillButton>
        </form>
      )}
        </>
      )}
    </div>
  );
}
