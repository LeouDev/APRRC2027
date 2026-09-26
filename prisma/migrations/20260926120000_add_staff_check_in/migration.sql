-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "checkInDeniedAt" TIMESTAMP(3),
ADD COLUMN     "checkInDeniedBy" TEXT,
ADD COLUMN     "checkInDeniedReason" TEXT,
ADD COLUMN     "checkedInAt" TIMESTAMP(3),
ADD COLUMN     "checkedInBy" TEXT;

-- CreateTable
CREATE TABLE "StaffUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_email_key" ON "StaffUser"("email");

-- Same reasoning as 20260908215956_enable_row_level_security: no policies
-- default-denies Supabase's anon/authenticated REST roles; Prisma is unaffected.
ALTER TABLE "StaffUser" ENABLE ROW LEVEL SECURITY;
