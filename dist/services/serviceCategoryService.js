"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategoryService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
class ServiceCategoryService {
    async getAll() {
        try {
            const items = await prismaService_1.default.$queryRaw `
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        ORDER BY name ASC
      `;
            return { success: true, message: 'Service categories retrieved successfully', data: items };
        }
        catch (error) {
            return { success: false, message: 'Failed to retrieve service categories', error: error.message };
        }
    }
    async getActive() {
        try {
            const items = await prismaService_1.default.$queryRaw `
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        WHERE COALESCE(is_active, TRUE) = TRUE
        ORDER BY name ASC
      `;
            return { success: true, message: 'Active service categories retrieved successfully', data: items };
        }
        catch (error) {
            return { success: false, message: 'Failed to retrieve active service categories', error: error.message };
        }
    }
    async getById(id) {
        try {
            const rows = await prismaService_1.default.$queryRaw `
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        WHERE id = ${id} AND COALESCE(is_active, TRUE) = TRUE
        LIMIT 1
      `;
            const item = rows[0];
            if (!item)
                return { success: false, message: 'Service category not found' };
            return { success: true, message: 'Service category retrieved successfully', data: item };
        }
        catch (error) {
            return { success: false, message: 'Failed to retrieve service category', error: error.message };
        }
    }
    async create(data) {
        try {
            const isActive = data.is_active !== undefined ? data.is_active : true;
            await prismaService_1.default.$executeRawUnsafe('INSERT IGNORE INTO service_categories (name, is_active) VALUES (?, ?)', data.name, isActive);
            const rows = await prismaService_1.default.$queryRaw `
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories
        WHERE name = ${data.name}
        ORDER BY id DESC
        LIMIT 1
      `;
            const item = rows[0];
            return { success: true, message: 'Service category created successfully', data: item };
        }
        catch (error) {
            return { success: false, message: 'Failed to create service category', error: error.message };
        }
    }
    async update(id, data) {
        try {
            const isActive = data.is_active !== undefined ? data.is_active : true;
            await prismaService_1.default.$executeRawUnsafe('UPDATE service_categories SET name = ?, is_active = ?, updated_at = NOW() WHERE id = ?', data.name, isActive, id);
            const rows = await prismaService_1.default.$queryRaw `
        SELECT id, name, is_active, created_at, updated_at
        FROM service_categories WHERE id = ${id} LIMIT 1
      `;
            const item = rows[0];
            return { success: true, message: 'Service category updated successfully', data: item };
        }
        catch (error) {
            return { success: false, message: 'Failed to update service category', error: error.message };
        }
    }
    async delete(id) {
        try {
            await prismaService_1.default.$executeRawUnsafe('UPDATE service_categories SET is_active = FALSE, updated_at = NOW() WHERE id = ?', id);
            return { success: true, message: 'Service category deleted successfully' };
        }
        catch (error) {
            return { success: false, message: 'Failed to delete service category', error: error.message };
        }
    }
    async hardDelete(id) {
        try {
            await prismaService_1.default.$executeRawUnsafe('DELETE FROM service_categories WHERE id = ?', id);
            return { success: true, message: 'Service category permanently deleted' };
        }
        catch (error) {
            return { success: false, message: 'Failed to hard delete service category', error: error.message };
        }
    }
}
exports.ServiceCategoryService = ServiceCategoryService;
//# sourceMappingURL=serviceCategoryService.js.map