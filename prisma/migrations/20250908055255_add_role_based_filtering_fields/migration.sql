-- Add role-based filtering fields to users table
ALTER TABLE `users` ADD COLUMN `school_id` VARCHAR(50);
ALTER TABLE `users` ADD COLUMN `district` VARCHAR(100);
ALTER TABLE `users` ADD COLUMN `rd_block` VARCHAR(100);

-- Create indexes for better performance
CREATE INDEX `idx_users_school_id` ON `users`(`school_id`);
CREATE INDEX `idx_users_district` ON `users`(`district`);
CREATE INDEX `idx_users_rd_block` ON `users`(`rd_block`);
