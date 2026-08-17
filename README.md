# FLC USA website

Build a full, production-quality Phase 1 website for FLC USA (flcusa.org), a church platform. This is the public-facing core site — no authentication, payments, or backend writes are required yet in this phase (those come in Phase 2). Use placeholder/dummy content and image blocks wherever real assets aren't supplied — I will drop in real logos, photos, and copy afterward.

Stack

React + Vite (Lovable default), TypeScript, Tailwind CSS.

Mobile-first, fully responsive, accessible markup (semantic HTML, proper alt text placeholders, keyboard-navigable nav/menus).

Structure the project so Supabase, YouTube Data API, and Bible API integrations can be wired in later without a rebuild — build the UI for these features now with clearly mocked data/state.

Design System

Follow the attached style guide exactly for color palette, typography, buttons, card shapes, spacing, and section rhythm (dark green + lime accent on cream/white backgrounds, pill-shaped buttons, rounded 16–24px cards, alternating section background tones, eyebrow labels with small icon, stat/metric cards, testimonial pattern). Use the style guide as the single source of truth for all visual decisions.

Section & Page Structure

Follow the section layout patterns of the two reference screenshots provided (an architecture-firm landing page and a digital-marketing landing page) — NOT their color themes, just their structural rhythm and section types. Adapt each pattern to FLC USA's content:

Home page, in this order:

Top utility bar + main nav — logo left, links (Home / About / Ministries / Livestream / Devotional / Teachings / Books / Give / Contact), pill CTA button ("Watch Live" or "Plan a Visit") on the right.

Hero — full-bleed background image with dark overlay, large headline with one highlighted word, supporting subtext, two CTAs (primary pill button + secondary icon-CTA), small rating/stat badge overlapping the image (mirror the "About Company" stat-row pattern from the architecture template: e.g. years active, members, cities reached).

About / Mission block — short mission statement, 3–4 stat counters (years, ministries, countries reached, members) in a row, small logo/partner strip if applicable.

Services/Features grid — 3–4 card grid, alternating card background colors per the style guide, representing FLC USA's core offerings: Livestream Services, Daily Devotional Archive, Teachings Library, Book Store. Each card: icon, title, one-line description, "Learn More" link.

Gallery/Portfolio-style section — mirror the "Our Portfolio" grid from the architecture template: a responsive image grid (mixed large/small tiles) showcasing ministry photos/sermon highlights, each tile with a small caption label.

Event Countdown block — a prominent CTA-style band showing a live countdown timer to the next service. Build the UI to accept a target datetime and event title/type as props/state (mock this with a hardcoded upcoming Sunday service for now); include the visual fallback state described below.

Testimonial / leader quote section — mirror the marketing template's team/testimonial card style: avatar, name, role, short quote from a pastor/leader.

CTA banner — full-width lime or dark-green band inviting visitors to plan a visit or give.

Footer — dark green background, multi-column links (Ministries, Resources, Contact, Social), newsletter signup input (UI only, non-functional for now), bottom bar with copyright.

Additional pages (same nav/footer shell, each following the section-card patterns above):

About — mission/vision, history, leadership team grid (photo, name, title cards).

Ministries — grid of ministry cards (icon/image, name, short description).

Livestream page — video player container (mocked "not currently live" state by default, with a placeholder for the live YouTube embed), a Bible panel UI alongside it (book/chapter/verse selector, mocked scripture text area), and a comment feed UI below (list + input, mocked as UI-only — clearly marked as requiring auth in Phase 2).

Devotional Archive page — a calendar date-picker component, a "today's devotional" article card by default, route pattern /devotional/:date, and a comment feed UI matching the livestream page pattern. Include a "Download this month's PDF" link (mocked/disabled state, styled to look real).

Teachings page — collection/series grid, each linking to a detail page listing individual items (audio/video/article cards) within that series.

Book Store page — catalogue grid of book cards (cover image, title, author, price, "Add to Cart" button — UI only, no real checkout yet), with category/filter UI.

Contact / Give page — contact form UI (name, email, message — non-functional placeholder submit), map/location block, and a giving info section with placeholder payment CTA. Givepage should be built in a way that a payment platform can be integrated for stripe or anyother church payment system with reoccuring paayment system

Specific Build Instructions

"After adding or updating any npm dependency, do not leave package-lock.json out of sync with package.json. If you cannot run npm install to regenerate it, tell me explicitly which dependencies changed so I can regenerate the lockfile myself.

Keep all uploaded images as their original file format (jpeg/png) inside the assets/images folder. Reference them directly via standard image imports or <img src> tags. Do not convert images to JSON, base64, or any other data format, and do not create manifest files for them."

Preloader: Add a preloader that shows on initial page load — a breathing (soft pulse/scale) white logo centered on the dark-green background, with a thin loading bar beneath it. Once loading completes, reveal the site content with a vertical wipe/reveal transition (not a fade) — e.g. the preloader panel slides/wipes away vertically to expose the page underneath.

SEO / Meta: Set up complete, SEO-compliant meta tags and Open Graph tags for every page (title, description, canonical URL, og:title, og:description, og:image, og:type, twitter:card). All meta/OG author, publisher, and generator references should point to FLCUSA — do not reference Lovable anywhere in the site's meta data, page source, footer, or visible content.

Attached is the neccessary Images and information. All other images can be gotten from the internet and used as placeholders to be replaced later.

Notes

All images/logos/brand assets will be supplied and swapped in after this initial build — use clearly labeled placeholder blocks (correct aspect ratios) in the meantime.

Keep components modular and named clearly (e.g. HeroSection, EventCountdown, DevotionalCalendar, LivestreamPlayer, BiblePanel, CommentFeed) so Phase 2 (Supabase auth, real data, check-in, payments) can be layered in without restructuring.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/51f7fb3a-7a38-4261-95f0-e407bc63c8ba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
