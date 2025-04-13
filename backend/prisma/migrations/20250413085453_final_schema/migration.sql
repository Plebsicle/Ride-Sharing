/*
  Warnings:

  - You are about to drop the column `documentUrl` on the `DriverVerification` table. All the data in the column will be lost.
  - Added the required column `pickupLocation` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentNumber` to the `DriverVerification` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "pickupLocation" TEXT NOT NULL,
ADD COLUMN     "pickupTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DriverVerification" DROP COLUMN "documentUrl",
ADD COLUMN     "documentNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "color" SET NOT NULL;
