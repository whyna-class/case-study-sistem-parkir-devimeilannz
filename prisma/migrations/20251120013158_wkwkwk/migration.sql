/*
  Warnings:

  - You are about to alter the column `jenisKendaraan` on the `parkir` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `parkir` MODIFY `jenisKendaraan` ENUM('RODA2', 'RODA4') NOT NULL;
