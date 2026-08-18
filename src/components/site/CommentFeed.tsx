import { MessageCircle } from "lucide-react";
import { PillButton } from "./ui";

export type Comment = {
  id: string;
  author: string;
  initials: string;
  time: string;
  body: string;
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "Grace A.",
    initials: "GA",
    time: "2 min ago",
    body: "Watching from Houston this morning. This word is timely!",
  },
  {
    id: "2",
    author: "Emeka O.",
    initials: "EO",
    time: "8 min ago",
    body: "Praying along with the family. God bless FLC USA.",
  },
  {
    id: "3",
    author: "Rita M.",
    initials: "RM",
    time: "15 min ago",
    body: "My family joined from London. Thank you for the livestream.",
  },
];

/** Comment feed UI. */
export function CommentFeed({
  title = "Live conversation",
  comments = MOCK_COMMENTS,
}: {
  title?: string;
  comments?: Comment[];
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold">
          <MessageCircle className="size-5 text-primary" aria-hidden="true" />
          {title}
        </h2>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
          Sign in to comment
        </span>
      </div>

      <ul className="mt-6 space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
            >
              {c.initials}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {c.author} <span className="font-normal text-muted-foreground">· {c.time}</span>
              </p>
              <p className="text-sm text-muted-foreground">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="comment-input">
          Write a comment
        </label>
        <input
          id="comment-input"
          disabled
          placeholder="Sign in to join the conversation"
          className="min-h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <PillButton type="submit" disabled className="shrink-0 opacity-60">
          Post
        </PillButton>
      </form>
    </div>
  );
}