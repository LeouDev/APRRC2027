-- AlterTable: replace the one-off isEarlyBird boolean with a general
-- regGroup string, so future cohorts (e.g. "Super Early Bird") don't need
-- their own dedicated column each time.
ALTER TABLE "Participant" ADD COLUMN "regGroup" TEXT;
UPDATE "Participant" SET "regGroup" = 'Early Bird' WHERE "isEarlyBird" = true;
ALTER TABLE "Participant" DROP COLUMN "isEarlyBird";
