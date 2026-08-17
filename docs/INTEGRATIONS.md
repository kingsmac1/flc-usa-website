# FLC USA — Phase 2 integration guide

Everything below is already coded. When you paste the keys in, the features switch
from placeholder mode to live automatically — no rebuild of the UI needed.

Add secrets in Lovable (project settings → secrets / "Add secret"), then publish.
Never put these keys in the React components.

| Secret name | Used by | Where to get it |
| --- | --- | --- |
| `BIBLE_API_KEY` | Bible panel on /livestream | https://scripture.api.bible → free API key |
| `BIBLE_ID` (optional) | Bible translation | scripture.api.bible bible id, e.g. KJV. Defaults to a public domain translation |
| `YOUTUBE_API_KEY` | Live player on /livestream | Google Cloud Console → enable "YouTube Data API v3" → API key |
| `YOUTUBE_CHANNEL_ID` | Live player | Your channel ID (starts with `UC...`) from YouTube Studio → Settings → Channel → Advanced |
| `STRIPE_SECRET_KEY` | Giving form (/give and /livestream) | Stripe dashboard → Developers → API keys → secret key (`sk_live_...`) |

## 1. Bible API
- File: `src/lib/bible.server.ts` (fetch) and `src/lib/bible.functions.ts` (server function).
- Without a key: shows a placeholder passage and the note "Add your Bible API key…".
- With a key: the book/chapter/verse selector fetches the real text.

## 2. YouTube live mirroring
- File: `src/lib/youtube.server.ts` / `youtube.functions.ts`.
- The livestream page polls every 60 seconds. When the channel goes live, the player
  swaps from the "not currently live" state to the embedded broadcast automatically.
- Quota note: polling uses `search.list`; the free daily quota is enough for a church
  site. If you exceed it, raise the poll interval in `src/routes/livestream.tsx`.

## 3. Giving (Stripe)
- File: `src/lib/giving.server.ts` / `giving.functions.ts`, UI in `src/components/site/GiveWidget.tsx`.
- Without a key: the form previews the gift and explains giving isn't connected yet.
- With `STRIPE_SECRET_KEY`: it creates a Stripe Checkout session and redirects.
  One-time gifts work immediately. For Weekly/Monthly, create recurring Prices in
  Stripe and map them in `giving.server.ts` where the recurring branch is marked.
- The same widget is embedded on the livestream page, so no one has to leave the stream.

## 4. Devotional articles
- Paste new articles into `src/data/devotionals.ts` — each entry takes
  `date`, `title`, `scripture`, `verse`, `body` (array of paragraphs), `prayer`,
  optional `declarations`, `readingPlan`, `author`.

## 5. Monthly devotional PDFs
- Drop the file into `public/devotional-pdfs/` (e.g. `2026-08.pdf`).
- Add one line to `DEVOTIONAL_PDFS` in `src/data/devotionals.ts`:
  `{ month: "2026-08", label: "August 2026", file: "/devotional-pdfs/2026-08.pdf" }`.
- The download button on the devotional page enables itself for that month.
- Nothing
