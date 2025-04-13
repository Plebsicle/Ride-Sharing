/*
  Warnings:

  - You are about to drop the column `pickupLocation` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `pickupTime` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "pickupLocation",
DROP COLUMN "pickupTime";
