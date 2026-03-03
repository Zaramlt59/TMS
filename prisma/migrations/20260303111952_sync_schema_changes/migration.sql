/*
  Warnings:

  - The values [Education Office(CADC)] on the enum `schools_block_office` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[teacher_ID]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `medical_records` ADD COLUMN `diagnosis_date` DATE NULL,
    ADD COLUMN `treatment_status` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `schools` MODIFY `block_office` ENUM('DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib', 'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip', 'DEO Siaha', 'Education Office (CADC)', 'Education Office (LADC)', 'Education Office (MADC)', 'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai', 'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl', 'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit', 'SDEO North Vanlaiphai', 'SDEO Ngopa', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng') NOT NULL;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `teacher_ID` VARCHAR(50) NULL,
    MODIFY `block_office` ENUM('DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib', 'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip', 'DEO Siaha', 'Education Office(CADC)', 'Education Office (LADC)', 'Education Office (MADC)', 'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai', 'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl', 'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit', 'SDEO North Vanlaiphai', 'SDEO Ngopa', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng') NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `last_login` TIMESTAMP(0) NULL,
    ADD COLUMN `phone` VARCHAR(20) NULL,
    MODIFY `role` ENUM('super_admin', 'admin', 'deo', 'sdeo', 'hoi', 'teacher') NULL DEFAULT 'teacher';

-- CreateTable
CREATE TABLE `otp_verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `otp` VARCHAR(10) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `phone`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `teachers_teacher_ID_key` ON `teachers`(`teacher_ID`);

-- CreateIndex
CREATE INDEX `idx_teachers_teacher_id` ON `teachers`(`teacher_ID`);

-- CreateIndex
CREATE UNIQUE INDEX `phone` ON `users`(`phone`);

-- CreateIndex
CREATE INDEX `idx_users_phone` ON `users`(`phone`);
