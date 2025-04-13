/*
  Warnings:

  - Added the required column `PickupLocation` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PickupTime` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "PickupLocation" TEXT NOT NULL,
ADD COLUMN     "PickupTime" TIMESTAMP(3) NOT NULL;
