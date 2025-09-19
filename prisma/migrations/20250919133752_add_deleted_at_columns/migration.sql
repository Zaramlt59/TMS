-- Add deleted_at column to schools table
ALTER TABLE `schools` ADD COLUMN `deleted_at` DATETIME(3) NULL;

-- Add deleted_at column to teachers table  
ALTER TABLE `teachers` ADD COLUMN `deleted_at` DATETIME(3) NULL;
