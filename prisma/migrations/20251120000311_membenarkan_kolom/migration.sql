/*
  Warnings:

  - You are about to alter the column `jenisKendaraan` on the `parkir` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE `parkir` MODIFY `jenisKendaraan` VARCHAR(5) NOT NULL;
