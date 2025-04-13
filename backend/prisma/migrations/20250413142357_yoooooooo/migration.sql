/*
  Warnings:

  - Added the required column `route` to the `RideGiven` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RideGiven" ADD COLUMN     "route" TEXT NOT NULL;
