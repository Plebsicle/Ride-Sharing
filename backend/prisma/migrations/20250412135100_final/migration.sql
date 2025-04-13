/*
  Warnings:

  - You are about to drop the column `verified` on the `DriverVerification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "status",
ADD COLUMN     "status" "RideStatus" NOT NULL;

-- AlterTable
ALTER TABLE "DriverVerification" DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "RideGiven" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "BookingStatus";
