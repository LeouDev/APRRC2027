-- Supabase flagged both public tables as "publicly accessible": RLS was
-- never enabled, so anyone with the project URL and anon key could read,
-- edit, or delete every row via Supabase's auto-generated REST API (all of
-- Participant's PII/passport data and AdminUser's password hashes) even
-- though this app never uses that API — it only ever talks to Postgres
-- directly through Prisma using the table-owning `postgres` role, which
-- bypasses RLS regardless of policies. Enabling RLS with zero policies
-- default-denies every other role (anon/authenticated) while leaving the
-- app's own queries completely unaffected.
ALTER TABLE "Participant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
