-- Fix for sub-phase 1.2/1.3: enabling Row Level Security on a table does
-- NOT by itself grant a Postgres role permission to touch that table —
-- RLS policies only filter rows for operations a role already has base
-- privileges for. The initial schema migration created tables and RLS
-- policies but never granted the underlying table privileges to the
-- `authenticated` role, so every request failed with "permission denied
-- for table ..." even when correctly logged in (caught while testing
-- sub-phase 1.3's sign-up flow against the real project).
--
-- Grants below are scoped to exactly what each table's RLS policies
-- already allow (least privilege) — no DELETE anywhere, no INSERT on
-- profiles (only the handle_new_user trigger may create profile rows).
-- The `anon` role intentionally receives nothing: guest play is not
-- allowed, so anonymous requests should keep failing with permission
-- denied, exactly as already verified.

grant usage on schema public to authenticated;

grant select, update on public.profiles to authenticated;

grant select, insert, update on public.games to authenticated;

grant select, insert on public.game_moves to authenticated;

grant select, insert, update on public.challenges to authenticated;
