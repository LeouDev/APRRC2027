/*
  Warnings:

  - Added the required column `dateOfBirth` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dietaryRestrictions` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactEmail` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactName` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactPhone` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactRelationship` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalConditions` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passportNumber` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shirtSize` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialAssistance` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Participant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization` on table `Participant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dietaryRestrictions" TEXT NOT NULL,
ADD COLUMN     "emergencyContactEmail" TEXT NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT NOT NULL,
ADD COLUMN     "emergencyContactPhone" TEXT NOT NULL,
ADD COLUMN     "emergencyContactRelationship" TEXT NOT NULL,
ADD COLUMN     "facebookAccount" TEXT,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "medicalConditions" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "passportNumber" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "proofOfPayment" BYTEA,
ADD COLUMN     "proofOfPaymentFileName" TEXT,
ADD COLUMN     "proofOfPaymentMimeType" TEXT,
ADD COLUMN     "rotaryId" TEXT,
ADD COLUMN     "shirtSize" TEXT NOT NULL,
ADD COLUMN     "specialAssistance" TEXT NOT NULL,
ADD COLUMN     "whatsapp" TEXT,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "organization" SET NOT NULL,
ALTER COLUMN "position" SET NOT NULL;
