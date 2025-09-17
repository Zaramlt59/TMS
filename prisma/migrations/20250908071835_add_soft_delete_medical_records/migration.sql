-- AlterTable
ALTER TABLE `medical_records` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `idx_medical_records_deleted_at` ON `medical_records`(`deleted_at`);
