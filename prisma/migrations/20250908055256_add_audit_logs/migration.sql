-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `action` ENUM('login', 'logout', 'login_failed', 'password_change', 'password_reset', 'user_create', 'user_update', 'user_delete', 'user_activate', 'user_deactivate', 'role_change', 'view', 'create', 'update', 'delete', 'export', 'import', 'system_config_change', 'backup_created', 'restore_performed', 'unauthorized_access', 'permission_denied', 'suspicious_activity') NOT NULL,
    `resource_type` VARCHAR(50) NOT NULL,
    `resource_id` VARCHAR(50) NULL,
    `details` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `success` BOOLEAN NOT NULL DEFAULT true,
    `error_message` VARCHAR(500) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_audit_logs_user_id` ON `audit_logs`(`user_id`);

-- CreateIndex
CREATE INDEX `idx_audit_logs_action` ON `audit_logs`(`action`);

-- CreateIndex
CREATE INDEX `idx_audit_logs_resource_type` ON `audit_logs`(`resource_type`);

-- CreateIndex
CREATE INDEX `idx_audit_logs_created_at` ON `audit_logs`(`created_at`);

-- CreateIndex
CREATE INDEX `idx_audit_logs_success` ON `audit_logs`(`success`);

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
