"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockOfficeService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
class BlockOfficeService {
    async getAllBlockOffices() {
        try {
            const blockOffices = await prismaService_1.default.block_offices.findMany({
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Block offices retrieved successfully',
                data: blockOffices
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve block offices',
                error: error.message
            };
        }
    }
    async getActiveBlockOffices() {
        try {
            const blockOffices = await prismaService_1.default.block_offices.findMany({
                where: { is_active: true },
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Active block offices retrieved successfully',
                data: blockOffices
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve active block offices',
                error: error.message
            };
        }
    }
    async getBlockOfficeById(id) {
        try {
            const blockOffice = await prismaService_1.default.block_offices.findUnique({
                where: { id, is_active: true }
            });
            if (!blockOffice) {
                return {
                    success: false,
                    message: 'Block office not found'
                };
            }
            return {
                success: true,
                message: 'Block office retrieved successfully',
                data: blockOffice
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve block office',
                error: error.message
            };
        }
    }
    async getBlockOfficeByIdIncludingInactive(id) {
        try {
            const blockOffice = await prismaService_1.default.block_offices.findUnique({
                where: { id }
            });
            if (!blockOffice) {
                return {
                    success: false,
                    message: 'Block office not found'
                };
            }
            return {
                success: true,
                message: 'Block office retrieved successfully',
                data: blockOffice
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve block office',
                error: error.message
            };
        }
    }
    async createBlockOffice(blockOfficeData) {
        try {
            const isActive = blockOfficeData.is_active !== undefined ? blockOfficeData.is_active : true;
            const blockOffice = await prismaService_1.default.block_offices.create({
                data: {
                    name: blockOfficeData.name,
                    is_active: isActive
                }
            });
            return {
                success: true,
                message: 'Block office created successfully',
                data: blockOffice
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create block office',
                error: error.message
            };
        }
    }
    async updateBlockOffice(id, blockOfficeData) {
        try {
            const isActive = blockOfficeData.is_active !== undefined ? blockOfficeData.is_active : true;
            const updatedBlockOffice = await prismaService_1.default.block_offices.update({
                where: { id },
                data: {
                    name: blockOfficeData.name,
                    is_active: isActive,
                    updated_at: new Date()
                }
            });
            return {
                success: true,
                message: 'Block office updated successfully',
                data: updatedBlockOffice
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update block office',
                error: error.message
            };
        }
    }
    async deleteBlockOffice(id) {
        try {
            const result = await prismaService_1.default.block_offices.update({
                where: { id },
                data: { is_active: false }
            });
            if (result.is_active === false) {
                return {
                    success: true,
                    message: 'Block office deleted successfully'
                };
            }
            return {
                success: false,
                message: 'Block office not found'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete block office',
                error: error.message
            };
        }
    }
    async hardDeleteBlockOffice(id) {
        try {
            // Check if block office is being used by any schools or teachers
            const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE block_office = (SELECT name FROM block_offices WHERE id = ?) UNION SELECT COUNT(*) as count FROM teachers WHERE block_office = (SELECT name FROM block_offices WHERE id = ?)';
            const checkResult = await prismaService_1.default.$queryRaw `SELECT COUNT(*) as count FROM schools WHERE block_office = (SELECT name FROM block_offices WHERE id = ${id}) UNION SELECT COUNT(*) as count FROM teachers WHERE block_office = (SELECT name FROM block_offices WHERE id = ${id})`;
            const count = checkResult.reduce((sum, row) => sum + row.count, 0);
            if (count > 0) {
                return {
                    success: false,
                    message: 'Cannot delete block office',
                    error: `Block office is being used by ${count} school(s) or teacher(s)`
                };
            }
            // Hard delete - remove from database
            const result = await prismaService_1.default.block_offices.delete({
                where: { id }
            });
            if (result) {
                return {
                    success: true,
                    message: 'Block office permanently deleted'
                };
            }
            return {
                success: false,
                message: 'Block office not found'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete block office',
                error: error.message
            };
        }
    }
}
exports.BlockOfficeService = BlockOfficeService;
//# sourceMappingURL=blockOfficeService.js.map