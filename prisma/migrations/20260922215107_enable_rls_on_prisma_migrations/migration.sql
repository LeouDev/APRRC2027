-- Supabase's security advisor flagged _prisma_migrations next: Prisma
-- creates it in the public schema to track applied migrations, so it's
-- exposed through the auto-generated REST API just like any other public
-- table. Nothing in it is sensitive (migration names/checksums, already
-- visible in this public repo's migration files), but leaving it open
-- lets the anon/authenticated roles delete rows and corrupt Prisma's
-- migration history. Same fix as before: RLS with no policies blocks
-- every role except the table owner, which is how Prisma itself connects.
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
