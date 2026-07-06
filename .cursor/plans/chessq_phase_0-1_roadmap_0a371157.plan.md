---
name: ChessQ Phase 0-1 Roadmap
overview: A detailed, numbered execution plan for Section 19's Phase 0 (local playable board) and Phase 1 (backend + live play), broken into small 1-3 hour sub-phases, each ending with a manual test checklist. Phase 2+ are listed only as placeholders.
todos:
  - id: "0.1"
    content: Install chess.js + react-chessboard, render static board on new /play route
    status: completed
  - id: "0.2"
    content: Enable legal move-making with chess.js validation, hotseat turns, fixed orientation
    status: completed
  - id: "0.3"
    content: Handle castling/en passant/promotion UI and checkmate/stalemate/draw detection
    status: completed
  - id: "1.1"
    content: Set up Supabase project, CLI, and client wiring in the app
    status: completed
  - id: "1.2"
    content: Create DB schema (profiles, games, game_moves, challenges) via CLI migrations, RLS, profile trigger
    status: completed
  - id: "1.3"
    content: Add sign up / log in via Supabase Auth UI, replace mock user identity
    status: completed
  - id: "1.4"
    content: Build create-game and join-via-link flow (no move sync yet)
    status: pending
  - id: "1.5"
    content: Wire move submission through API + chess.js server validation, add Realtime sync
    status: pending
  - id: "1.6"
    content: Add basic per-player countdown clocks and timeout detection
    status: pending
isProject: false
---

# ChessQ — Phase 0 & Phase 1 Execution Plan

## Current actual state (verified by reading the repo)

- Next.js 16 App Router app with a single route: `/` (`src/app/page.tsx`), rendering `HomeDashboard`.
- Homepage UI is complete but 100% mock data (`src/lib/data.ts`): fake user "Arjun", fake live matches, fake tournaments, fake stats.
- `package.json` dependencies: only `next`, `react`, `react-dom`, `lucide-react` (+ Tailwind/TypeScript/ESLint tooling). **No** `chess.js`, `react-chessboard`, `@supabase/*`, or any auth/DB library installed.
- No `src/app/api/` folder — no backend routes exist.
- No `.env`/`.env.local` — no Supabase project connected yet.
- Sidebar nav items (`Play`, `Tournaments`, `Leaderboard`, `Learn`, `Profile`, `Settings`) are placeholder hash links (`#play`, etc.) with no real pages behind them.
- Nothing else from the spec exists: no auth, no database, no chess logic, no realtime, no clocks.

This plan starts from exactly that point.

## Decisions already confirmed with you

- **Phase 0 scope:** minimal — legal board with full rules enforcement only. No clock, no move list, no resign button in Phase 0 (those spec-listed "V1 Play Area" features come later; the roadmap table itself only requires rules-enforced hotseat play for Phase 0).
- **Board orientation (Phase 0):** fixed — white always at the bottom, "pass the device" style. No auto-flip.
- **Auth UI (Phase 1):** use Supabase's official pre-built Auth UI components (`@supabase/auth-ui-react`), restyled to fit ChessQ's dark theme.
- **Database schema management (Phase 1):** Supabase CLI with migration files committed to the repo (not manual dashboard SQL edits).
- **Guest play (Phase 1):** not allowed — both players must have a ChessQ account (Supabase Auth) before playing a link-based game.

## Flagged assumptions (spec gaps / defaults I'm picking — flag if you disagree before we start)

- **RLS policies & profile auto-creation:** Section 11's SQL creates tables but specifies no Row Level Security policies and no trigger to auto-insert a `profiles` row when a user signs up via `auth.users`. I'll design both when we reach sub-phase 1.2, using sensible defaults (profiles publicly readable, self-updatable only; games readable by participants; a `handle_new_user` trigger for profile creation). Will confirm specifics with you in that sub-phase before applying.
- **Phase 1 time control:** Section 8 recommends launching with "one or two" time controls but Phase 1's roadmap line ("basic clocks") doesn't pick one. I'll default to a single fixed time control (10+0) for sub-phase 1.6, adjustable later.
- **"Create Game" entry point:** I'm assuming this lives as a button on the same `/play` page built in Phase 0, rather than a separate new page. Will confirm when we reach 1.4.
- **Profile/Settings pages are OUT of scope for Phase 0-1.** Section 14.6/14.7 label them "V1-lite," but the Section 19 roadmap table (which the project rules say governs phasing) does not list them under Phase 0 or Phase 1 deliverables. I'm treating the roadmap table as authoritative and deferring Profile/Settings pages to a later phase. The Sidebar's `Profile`/`Settings`/`Tournaments`/`Leaderboard`/`Learn` links remain non-functional placeholders through Phase 0-1 — only `Home` and `Play` become real.
- **Supabase email confirmation:** Supabase Auth defaults to requiring email confirmation before login. For faster local testing during sub-phase 1.3, I'll suggest (not silently do) disabling "Confirm email" in the Supabase project's Auth settings during development, and flag this as a decision for you in that session.

---

## Phase 0 — Local Playable Board (spec Phase 0, "Now / Week 1")

### Sub-phase 0.1 — Install chess.js + react-chessboard, render a static board on a new /play route

**Goal:** Get a chessboard visually on screen, on its own route, styled to fit ChessQ's dark theme. No move logic yet.

- Install `chess.js` and `react-chessboard`.
- Create `src/app/play/page.tsx` — new route.
- Render the standard starting position using `react-chessboard`, customized colors/board size to roughly match the ChessQ dark/neon-green theme.
- Wire the Sidebar's "Play" nav item (`src/components/layout/Sidebar.tsx`) from `href="#play"` to `href="/play"`.

**STOP HERE — manual test checklist:**
- [ ] Run `npm run dev`, click "Play" in the sidebar (or go to `/play` directly).
- [ ] Confirm a chess board renders with all 32 pieces in the correct starting position.
- [ ] Confirm the board's styling doesn't look totally out of place next to the rest of the dark UI (rough fit is fine at this stage).
- [ ] Confirm no console errors.

### Sub-phase 0.2 — Legal move-making, hotseat turns, fixed orientation

**Goal:** Two people at one device can make legal moves alternating white/black; illegal moves are rejected.

- Wire `chess.js` as the rules engine behind the board: on piece drop, attempt the move via `chess.js`, only accept it if legal.
- If illegal, the piece snaps back (no move made).
- Alternate whose turn it is automatically (derived from `chess.js` game state, not manually tracked).
- Board orientation fixed with white at the bottom for the whole session (per your decision — no flipping).

**STOP HERE — manual test checklist:**
- [ ] Make a legal opening move as White (e.g., e2-e4). Confirm it's applied and it becomes Black's turn.
- [ ] Try to move a White piece again immediately (out of turn) — confirm it's rejected.
- [ ] Make a legal Black move. Confirm it applies and turn passes back to White.
- [ ] Try an illegal move (e.g., move a Bishop like a Rook, or move a piece so your own King is left in check) — confirm it's rejected and the piece returns to its square.
- [ ] Play a handful of moves back and forth to confirm turns keep alternating correctly.

### Sub-phase 0.3 — Special moves, promotion UI, and game-end detection

**Goal:** Castling, en passant, and pawn promotion all work correctly; checkmate/stalemate/draw is detected and clearly shown.

- Verify castling (kingside and queenside) works via `chess.js`'s legality checks — react-chessboard's default drag/drop should call into the same validation from 0.2, so this is mainly verification, not new logic.
- Verify en passant capture works the same way.
- Build a simple promotion picker UI (queen/rook/bishop/knight) that appears when a pawn reaches the last rank, and applies the chosen piece via `chess.js`.
- Detect game end using `chess.js`'s `isCheckmate()`, `isStalemate()`, `isDraw()`, `isThreefoldRepetition()`, `isInsufficientMaterial()` — show a simple on-screen banner/message (e.g., "Checkmate — White wins", "Draw — Stalemate") and stop accepting further moves.

**STOP HERE — manual test checklist:**
- [ ] Play out a sequence that reaches a legal kingside castle for White — confirm both King and Rook move correctly in one action.
- [ ] Set up (via normal play) an en passant opportunity and confirm the capture works correctly, including removing the correct pawn.
- [ ] Push a pawn to the last rank and confirm a promotion choice appears; pick Queen, confirm the pawn becomes a Queen. Repeat quickly for one other piece type (e.g., Knight) to confirm the picker isn't hardcoded to Queen.
- [ ] Play (or fast-forward) to a checkmate position (e.g., Fool's Mate: 1. f3 e5 2. g4 Qh4#) and confirm a clear "Checkmate" message appears and no further moves can be made.
- [ ] Optional: force a stalemate or insufficient-material draw position and confirm the correct message appears (not required to be exhaustive, just confirm the mechanism works for at least one draw type).

**Phase 0 complete when:** all three sub-phases pass their checklists. This satisfies the spec's Phase 0 deliverable: "chess.js + react-chessboard integrated, hotseat two-player mode (no networking), rules fully enforced."

---

## Phase 1 — Backend Foundation + Live Play (spec Phase 1, "Weeks 2-3")

### Sub-phase 1.1 — Supabase project setup + client wiring

**Goal:** A Supabase project exists and the Next.js app can talk to it.

- Create a Supabase project (cloud, free tier) if not already done.
- Install Supabase CLI locally; run `supabase init` in the repo; link to the cloud project.
- Install `@supabase/supabase-js`.
- Add `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — confirm `.env.local` is git-ignored.
- Create `src/lib/supabase.ts` exporting a configured Supabase client.

**STOP HERE — manual test checklist:**
- [ ] Confirm `.env.local` exists locally and is **not** shown in `git status` (i.e., it's ignored).
- [ ] Add a temporary debug line (e.g., in a scratch page or console log) calling `supabase.auth.getSession()` and confirm it resolves without throwing/network errors.
- [ ] Confirm `npm run build` still succeeds with the new dependency installed.

### Sub-phase 1.2 — Database schema via CLI migrations

**Goal:** `profiles`, `games`, `game_moves`, `challenges` tables exist in Supabase, created via versioned migration files in the repo, with baseline RLS policies and a profile auto-creation trigger.

- Write migration file(s) under `supabase/migrations/` implementing Section 11's four tables (`profiles`, `games`, `game_moves`, `challenges`) exactly as specified.
- Add a `handle_new_user` trigger/function so a `profiles` row is created automatically when a new `auth.users` row appears (flagged assumption above — will confirm exact shape with you here).
- Add baseline RLS policies (flagged assumption above — will confirm specifics with you here, e.g., profiles readable by anyone/updatable only by owner; games readable by participants).
- Apply migrations to the Supabase project via CLI.

**STOP HERE — manual test checklist:**
- [ ] Confirm migration files exist under `supabase/migrations/` in the repo.
- [ ] In the Supabase dashboard's Table Editor, confirm all four tables exist with the expected columns.
- [ ] Confirm RLS is enabled on each table (Supabase dashboard shows this per table).

### Sub-phase 1.3 — Sign up / log in with Supabase Auth UI

**Goal:** A real user can sign up, log in, and the app shows their real identity instead of mock "Arjun" data.

- Install `@supabase/auth-ui-react` and `@supabase/auth-ui-shared`.
- Create `src/app/login/page.tsx` using the pre-built Auth UI component, restyled with ChessQ's dark/neon-green theme variables.
- On successful auth, redirect to `/`.
- Update `Sidebar`/`TopHeader` to show the real logged-in user's info (username/email, default rating 1200 from `profiles`) instead of the hardcoded `user` object from `src/lib/data.ts`. Mock data for live matches/tournaments/etc. can remain mock for now — only the identity block changes.
- Add a basic logout action.

**STOP HERE — manual test checklist:**
- [ ] Sign up with a real email address; confirm a `profiles` row is created automatically (check Table Editor).
- [ ] Log in with that account; confirm the Sidebar/TopHeader shows your real username instead of "Arjun."
- [ ] Log out; confirm you're redirected to `/login` (or otherwise clearly logged out) and mock "Arjun" data does not reappear as if logged in.
- [ ] Log back in successfully with the same account.

### Sub-phase 1.4 — Create game + join via shareable link (no move sync yet)

**Goal:** A logged-in user can create a game and get a link; a second logged-in user opening that link joins the same game row.

- `POST /api/games` (Next.js API route) — creates a `games` row with the starting FEN, `white_id` = current user, `black_id` = null; returns the new game's id/URL.
- `src/app/play/[gameId]/page.tsx` — new dynamic route. Loads the game row by id and renders the Phase-0 board component at whatever FEN is stored (starting position initially).
- `POST /api/games/[id]/join` — if `black_id` is null and the joining user isn't `white_id`, sets `black_id` to the current user.

**STOP HERE — manual test checklist:**
- [ ] Logged in as User A, create a game and get the link/URL.
- [ ] Open that link as User B (different account, e.g., a private/incognito window) — confirm no errors and the same starting board renders.
- [ ] In the Supabase Table Editor, confirm the game's row now has both `white_id` and `black_id` populated correctly.
- [ ] Confirm a third user (or User A again) cannot overwrite `black_id` once it's already set.

### Sub-phase 1.5 — Move submission + Realtime sync (live play)

**Goal:** Two players in two different browser sessions can play a full live game against each other with moves syncing automatically. No clocks yet.

- `POST /api/games/[id]/move` — server loads the current FEN from the DB, validates the submitted move via `chess.js` (server-authoritative, per spec Section 7/17), rejects if illegal or not the submitter's turn, otherwise applies it and updates `fen`/`pgn`/`status`/`result` on the `games` row.
- Client subscribes to Supabase Realtime changes on that specific `games` row; re-renders the board whenever the row updates (rather than the player's own local move handling).
- Reuse the Phase 0 board/move UI, but route moves through this API instead of purely local `chess.js` state.
- Game end (checkmate/stalemate/draw) updates `status`/`result` on the row, detected via the same subscription.

**STOP HERE — manual test checklist:**
- [ ] Open the same game as User A and User B in two separate browser windows/devices.
- [ ] A makes a move — confirm B's board updates automatically within a few seconds, without B refreshing the page.
- [ ] B makes a move — confirm A's board updates the same way.
- [ ] A attempts to move when it's not their turn — confirm the server rejects it (no visible move happens for either player).
- [ ] Play to checkmate (or force it) — confirm both screens show the game as ended with the correct result.

### Sub-phase 1.6 — Basic clocks

**Goal:** Both players see a live countdown clock; running out of time ends the game as a loss.

- Add a fixed time control (default assumption: 10+0 — flagged above, confirm before building) stored on the `games` row at creation.
- Store clock state per Section 4.3's approach: a last-move timestamp + remaining time per side on the `games` row; recalculate remaining time client-side on render rather than running a server-side ticking process.
- Display live-counting clocks for both players in the `/play/[gameId]` UI.
- On move submission, update the mover's remaining time and switch the running clock to the opponent.
- Detect timeout: if a side's clock reaches zero, mark the game as ended with a "win on time" result for the other side.

**STOP HERE — manual test checklist:**
- [ ] Start a new game; confirm both clocks display and only the side-to-move's clock counts down.
- [ ] Make a move; confirm the clock switches to the other player and (if increment > 0) time is added correctly.
- [ ] Using a short test time control (e.g., temporarily set to something like 0+... a few seconds, just for this test) or by waiting, let one side's clock hit zero — confirm the game ends automatically with a "win on time" result shown to both players.

**Phase 1 complete when:** all six sub-phases pass their checklists. This satisfies the spec's Phase 1 deliverable: "Supabase set up (auth, DB, realtime); link-based two-player live games; basic clocks; game state persisted."

---

## Phase 2+ (placeholders only — not detailed yet)

- **Phase 2 — Real user pilot (spec Week 4):** 5-10 real people play real games; fix top issues found.
- **Phase 3 — Depth on core play (Month 2):** Elo ratings, game history/replay, PGN export, reconnect handling, basic Stockfish post-game analysis.
- **Phase 4 — Social & competitive layer (Month 3+):** Custom challenge polish, simple leaderboard, basic profile expansion, tournaments (only once organic demand appears).
- **Phase 5 — Learning & content:** Daily puzzles, opening explorer, lessons, endgame practice.
- **Phase 6 — Polish & scale:** Glicko-2 upgrade, anti-cheat hardening, admin panel, friend system, messaging, notifications expansion.
- **Phase 7 — Ecosystem:** AI Coach integration, mobile apps, club/organizer tools, advanced analytics.

These are explicitly out of scope until their turn arrives, per the project rules.

---

## Next step

Waiting for your explicit go-ahead before starting **sub-phase 0.1**. Each sub-phase will be built, tested against its checklist with you, and confirmed before moving to the next one — no skipping ahead.
