-- CreateTable
CREATE TABLE `attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `designation` VARCHAR(255) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `rd_block` VARCHAR(100) NULL,
    `habitation` VARCHAR(255) NULL,
    `joining_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `status` ENUM('Active', 'Completed') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `teacher_id`(`teacher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `block_offices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deputations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `designation` VARCHAR(255) NOT NULL,
    `joining_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `status` ENUM('Active', 'Completed') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `teacher_id`(`teacher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    INDEX `idx_districts_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `management_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mediums` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posting_histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `school_name` VARCHAR(255) NOT NULL,
    `school_type` ENUM('Co-educational', 'Girls') NOT NULL,
    `medium` VARCHAR(100) NOT NULL,
    `management` VARCHAR(100) NOT NULL,
    `block_office` VARCHAR(255) NOT NULL,
    `district` VARCHAR(100) NOT NULL,
    `rd_block` VARCHAR(100) NULL,
    `pincode` VARCHAR(10) NULL,
    `habitation` VARCHAR(255) NULL,
    `habitation_class` ENUM('Rural', 'Urban') NULL,
    `habitation_category` ENUM('City', 'Town', 'Village') NULL,
    `from_date` DATE NOT NULL,
    `to_date` DATE NULL,
    `status` ENUM('Active', 'Completed') NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `teacher_id`(`teacher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rd_blocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `district_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_rd_blocks_district_id`(`district_id`),
    UNIQUE INDEX `unique_rd_block_per_district`(`district_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `religions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` VARCHAR(50) NOT NULL,
    `school_name` VARCHAR(255) NOT NULL,
    `school_type` ENUM('Co-educational', 'Girls') NOT NULL,
    `school_level` TEXT NOT NULL,
    `management` ENUM('Adhoc Aided', 'Central', 'Council Aided', 'Deficit', 'Deficit Mission', 'Government', 'Local Body', 'Lumpsum Aided', 'Private', 'Samagra') NOT NULL,
    `medium` ENUM('Bengali', 'Chakma', 'English', 'Hindi', 'Mizo', 'Nepali') NOT NULL,
    `pincode` VARCHAR(10) NULL,
    `district` VARCHAR(100) NULL,
    `rd_block` VARCHAR(100) NULL,
    `school_phone` VARCHAR(20) NULL,
    `school_email` VARCHAR(255) NULL,
    `habitation` VARCHAR(255) NULL,
    `habitation_class` ENUM('Rural', 'Urban') NULL,
    `habitation_category` ENUM('City', 'Town', 'Village') NULL,
    `block_office` ENUM('DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib', 'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip', 'DEO Siaha', 'Education Office(CADC)', 'Education Office (LADC)', 'Education Office (MADC)', 'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai', 'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl', 'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit', 'SDEO North Vanlaiphai', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `school_id`(`school_id`),
    INDEX `idx_schools_district`(`district`),
    INDEX `idx_schools_school_id`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(20) NULL,
    `classes` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_name` VARCHAR(255) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `joining_date` DATE NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `social_group` ENUM('ST', 'SC', 'OBC', 'General') NOT NULL,
    `religion` ENUM('Hindu', 'Islam', 'Christian', 'Sikh', 'Buddhist', 'Jain') NOT NULL,
    `gender` ENUM('Male', 'Female', 'Others') NOT NULL,
    `aadhaar_number` VARCHAR(12) NULL,
    `area_village` VARCHAR(255) NULL,
    `subjects_taught` TEXT NOT NULL,
    `classes_taught` TEXT NOT NULL,
    `school_id` VARCHAR(50) NOT NULL,
    `current_school_name` VARCHAR(255) NOT NULL,
    `school_level` TEXT NOT NULL,
    `management` ENUM('Adhoc Aided', 'Central', 'Council Aided', 'Deficit', 'Deficit Mission', 'Government', 'Local Body', 'Lumpsum Aided', 'Private', 'Samagra') NOT NULL,
    `medium` ENUM('Bengali', 'Chakma', 'English', 'Hindi', 'Mizo', 'Nepali') NOT NULL,
    `service_category` VARCHAR(100) NULL,
    `habitation` VARCHAR(255) NULL,
    `pincode` VARCHAR(10) NULL,
    `district` VARCHAR(100) NULL,
    `rd_block` VARCHAR(100) NULL,
    `school_phone` VARCHAR(20) NULL,
    `habitation_class` ENUM('Rural', 'Urban') NULL,
    `habitation_category` ENUM('City', 'Town', 'Village') NULL,
    `block_office` ENUM('DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib', 'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip', 'DEO Siaha', 'Education Office(CADC)', 'Education Office (LADC)', 'Education Office (MADC)', 'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai', 'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl', 'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit', 'SDEO North Vanlaiphai', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `idx_teachers_district`(`district`),
    INDEX `idx_teachers_school_id`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `villages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rd_block_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_villages_rd_block_id`(`rd_block_id`),
    UNIQUE INDEX `unique_village_per_rd_block`(`rd_block_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'teacher') NOT NULL DEFAULT 'admin',
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `idx_users_username`(`username`),
    INDEX `idx_users_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `replaced_by_token` VARCHAR(255) NULL,
    `device_id` VARCHAR(255) NULL,
    `ip_address` VARCHAR(100) NULL,
    `user_agent` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `refresh_tokens_token_key`(`token`),
    INDEX `idx_refresh_tokens_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `ailment_name` VARCHAR(255) NOT NULL,
    `severity` VARCHAR(50) NOT NULL,
    `remarks` TEXT NULL,
    `documents` VARCHAR(500) NULL,
    `entered_by_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    INDEX `idx_medical_records_teacher_id`(`teacher_id`),
    INDEX `idx_medical_records_entered_by_id`(`entered_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_record_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `medical_record_id` INTEGER NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `changed_by_id` INTEGER NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_medical_record_logs_record_id`(`medical_record_id`),
    INDEX `idx_medical_record_logs_changed_by`(`changed_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `deputations` ADD CONSTRAINT `deputations_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `posting_histories` ADD CONSTRAINT `posting_histories_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rd_blocks` ADD CONSTRAINT `rd_blocks_ibfk_1` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `schools`(`school_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `villages` ADD CONSTRAINT `villages_ibfk_1` FOREIGN KEY (`rd_block_id`) REFERENCES `rd_blocks`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `medical_records` ADD CONSTRAINT `medical_records_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `medical_records` ADD CONSTRAINT `medical_records_entered_by_id_fkey` FOREIGN KEY (`entered_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `medical_record_logs` ADD CONSTRAINT `medical_record_logs_medical_record_id_fkey` FOREIGN KEY (`medical_record_id`) REFERENCES `medical_records`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `medical_record_logs` ADD CONSTRAINT `medical_record_logs_changed_by_id_fkey` FOREIGN KEY (`changed_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
