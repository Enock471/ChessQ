-- ChessQ initial schema — sub-phase 1.2
-- Tables: profiles, games, game_moves, challenges
-- Includes: profile auto-creation trigger, baseline RLS policies.
-- Guest play is not allowed (Phase 1 decision) — every policy requires
-- an authenticated session; the "authenticated" role has no matching
-- policy rows for anonymous requests, so anon gets zero access.

create extension if not exists pgcrypto;

-- =========================================================
-- 1. profiles
-- =========================================================

create table public.profiles (
  id uuid references auth.users(id) primary key,
  username text unique not null,
  display_name text,
  rating integer not null default 1200,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Any logged-in user can see every profile (username/rating aren't
-- secret — needed to show opponent names on the board and later for
-- leaderboards). Approved as "Option A."
create policy "profiles_select_all_logged_in"
  on public.profiles
  for select
  to authenticated
  using (true);

-- You may only edit your own profile row.
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- No insert/delete policy: only the handle_new_user trigger below
-- (running as the table owner, which bypasses RLS) may create profile
-- rows. No user or API can create/delete profiles directly.

-- =========================================================
-- 2. Profile auto-creation trigger
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  id_suffix text;
begin
  -- Prefer a username supplied at sign-up (sub-phase 1.3 will collect
  -- this); otherwise fall back to the email's local part.
  base_username := coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(new.email, '@', 1)
  );

  -- Keep only safe characters so it can't break the unique constraint
  -- or look malformed in the UI.
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_]', '_', 'g'));
  if base_username is null or base_username = '' then
    base_username := 'player';
  end if;

  -- Append a short slice of the user's own id so usernames can never
  -- collide, even if two people share an email prefix.
  id_suffix := substr(replace(new.id::text, '-', ''), 1, 8);
  final_username := base_username || '_' || id_suffix;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'username',
      base_username
    )
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =========================================================
-- 3. games
-- =========================================================

create table public.games (
  id uuid primary key default gen_random_uuid(),
  white_id uuid references public.profiles(id),
  black_id uuid references public.profiles(id),
  time_control text,
  rated boolean not null default false,
  fen text not null,
  pgn text,
  status text not null default 'active', -- active, checkmate, stalemate, draw, resigned, timeout
  result text, -- white, black, draw, null if ongoing
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

alter table public.games enable row level security;

-- Readable by White, Black, or anyone (while the Black slot is still
-- open, so a joining player can see what they're about to join).
create policy "games_select_participant_or_open"
  on public.games
  for select
  to authenticated
  using (
    white_id = auth.uid()
    or black_id = auth.uid()
    or black_id is null
  );

-- You can only create a game as White (yourself) — not on someone
-- else's behalf.
create policy "games_insert_as_white"
  on public.games
  for insert
  to authenticated
  with check (white_id = auth.uid());

-- Updatable by White, Black, or anyone while the Black slot is open
-- (so a joining player can claim it) — but the row that results MUST
-- have you as White or Black. This lets a new player claim an open
-- slot, while still blocking anyone touching a game they're not part
-- of once both slots are filled.
create policy "games_update_participant_or_open"
  on public.games
  for update
  to authenticated
  using (
    white_id = auth.uid()
    or black_id = auth.uid()
    or black_id is null
  )
  with check (
    white_id = auth.uid()
    or black_id = auth.uid()
  );

-- No delete policy: games are kept for history/replay in Phase 1.

-- =========================================================
-- 4. game_moves
-- =========================================================

create table public.game_moves (
  game_id uuid not null references public.games(id),
  move_number integer not null,
  uci text,
  san text,
  created_at timestamptz not null default now(),
  primary key (game_id, move_number)
);

alter table public.game_moves enable row level security;

-- Readable only by that game's two participants.
create policy "game_moves_select_participant"
  on public.game_moves
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.games g
      where g.id = game_moves.game_id
        and (g.white_id = auth.uid() or g.black_id = auth.uid())
    )
  );

-- Insertable only by that game's two participants. The API is still
-- responsible for validating the move itself via chess.js before this
-- insert happens — this policy only checks "are you in this game."
create policy "game_moves_insert_participant"
  on public.game_moves
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.games g
      where g.id = game_moves.game_id
        and (g.white_id = auth.uid() or g.black_id = auth.uid())
    )
  );

-- No update/delete policy: moves are an append-only history.

-- =========================================================
-- 5. challenges
-- =========================================================

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid references public.profiles(id),
  challenged_id uuid references public.profiles(id),
  time_control text,
  rated boolean not null default false,
  status text not null default 'pending', -- pending, accepted, declined, expired
  created_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

-- Readable only by the two people involved.
create policy "challenges_select_involved"
  on public.challenges
  for select
  to authenticated
  using (
    challenger_id = auth.uid() or challenged_id = auth.uid()
  );

-- You can only create a challenge as yourself (the challenger).
create policy "challenges_insert_as_challenger"
  on public.challenges
  for insert
  to authenticated
  with check (challenger_id = auth.uid());

-- Either side can update it (e.g. accept/decline) — finer-grained
-- rules (only the challenged user may accept) belong in the API when
-- challenges are actually built in a later phase.
create policy "challenges_update_involved"
  on public.challenges
  for update
  to authenticated
  using (
    challenger_id = auth.uid() or challenged_id = auth.uid()
  )
  with check (
    challenger_id = auth.uid() or challenged_id = auth.uid()
  );

-- No delete policy: use status = 'declined' / 'expired' instead.
