-- ============================================================================
-- Workload Planner — enable Row Level Security (Phase C: quick hardening)
-- ============================================================================
-- Run this once in Supabase → SQL Editor → New query → Run.
--
-- What it does:
--   * Turns ON Row Level Security for all six app tables (clears the CRITICAL
--     "RLS disabled in public" advisor warnings).
--   * Adds a permissive policy so the app KEEPS WORKING with the public key.
--
-- Honest note:
--   Because the app authenticates inside its own code (not via Supabase Auth),
--   it talks to the database with the public/anon key. These policies therefore
--   allow the anon role full access — they remove the "disabled" criticals and
--   give you ONE place to tighten things later, but they do NOT yet restrict
--   access per user. True lockdown requires moving to Supabase Auth (Phase A).
--   Passwords are now hashed in the app, so the worst exposure is already gone.
-- ============================================================================

alter table public.task          enable row level security;
alter table public."Members"     enable row level security;
alter table public.kanban_cards  enable row level security;
alter table public.users_config  enable row level security;
alter table public.activity_log  enable row level security;
alter table public.snapshots     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['task','Members','kanban_cards','users_config','activity_log','snapshots']
  loop
    execute format('drop policy if exists app_all on public.%I;', t);
    execute format(
      'create policy app_all on public.%I for all to anon, authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;
