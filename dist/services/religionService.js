"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReligionService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
class ReligionService {
    async getAllReligions() {
        try {
            const religions = await prismaService_1.default.religions.findMany({
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Religions retrieved successfully',
                data: religions
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve religions',
                error: error.message
            };
        }
    }
    async getReligionById(id) {
        try {
            const religion = await prismaService_1.default.religions.findUnique({
                where: { id, is_active: true }
            });
            if (!religion) {
                return {
                    success: false,
                    message: 'Religion not found'
                };
            }
            return {
                success: true,
                message: 'Religion retrieved successfully',
                data: religion
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve religion',
                error: error.message
            };
        }
    }
    async getReligionByIdIncludingInactive(id) {
        try {
            const religion = await prismaService_1.default.religions.findUnique({
                where: { id }
            });
            if (!religion) {
                return {
                    success: false,
                    message: 'Religion not found'
                };
            }
            return {
                success: true,
                message: 'Religion retrieved successfully',
                data: religion
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve religion',
                error: error.message
            };
        }
    }
    async getActiveReligions() {
        try {
            const religions = await prismaService_1.default.religions.findMany({
                where: { is_active: true },
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Active religions retrieved successfully',
                data: religions
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve active religions',
                error: error.message
            };
        }
    }
    async createReligion(religionData) {
        try {
            const isActive = religionData.is_active !== undefined ? religionData.is_active : true;
            const religion = await prismaService_1.default.religions.create({
                data: {
                    name: religionData.name,
                    is_active: isActive
                }
            });
            return {
                success: true,
                message: 'Religion created successfully',
                data: religion
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create religion',
                error: error.message
            };
        }
    }
    async updateReligion(id, religionData) {
        try {
            const isActive = religionData.is_active !== undefined ? religionData.is_active : true;
            const religion = await prismaService_1.default.religions.update({
                where: { id },
                data: {
                    name: religionData.name,
                    is_active: isActive
                }
            });
            // Use the method that can retrieve inactive religions for admin updates
            const updatedReligion = await this.getReligionByIdIncludingInactive(id);
            return updatedReligion;
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update religion',
                error: error.message
            };
        }
    }
    async deleteReligion(id) {
        try {
            // Check if religion is being used by any teacher
            const checkSql = 'SELECT COUNT(*) as count FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ?)';
            const checkResult = await prismaService_1.default.religions.findUnique({ where: { id } });
            const count = checkResult.count;
            if (count > 0) {
                return {
                    success: false,
                    message: 'Cannot delete religion',
                    error: `Religion is being used by ${count} teacher(s)`
                };
            }
            // Soft delete - set is_active to false
            const religion = await prismaService_1.default.religions.update({
                where: { id },
                data: { is_active: false }
            });
            if (!religion) {
                return {
                    success: false,
                    message: 'Religion not found',
                    error: 'Religion with the specified ID does not exist'
                };
            }
            return {
                success: true,
                message: 'Religion deleted successfully',
                data: null
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete religion',
                error: error.message
            };
        }
    }
    async hardDeleteReligion(id) {
        try {
            // Check if religion is being used by any teacher
            const checkResult = await prismaService_1.default.$queryRaw `SELECT COUNT(*) as count FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ${id})`;
            const count = Array.isArray(checkResult) && checkResult.length > 0 ? checkResult[0].count : 0;
            if (count > 0) {
                // Get more details about which teachers are using this religion
                const detailResult = await prismaService_1.default.$queryRaw `SELECT teacher_name FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ${id}) LIMIT 5`;
                const teacherNames = Array.isArray(detailResult) ? detailResult.map((t) => t.teacher_name).join(', ') : '';
                return {
                    success: false,
                    message: 'Cannot delete religion',
                    error: `Religion is being used by ${count} teacher(s). Some examples: ${teacherNames}`
                };
            }
            // Hard delete - remove from database
            const religion = await prismaService_1.default.religions.delete({ where: { id } });
            if (!religion) {
                return {
                    success: false,
                    message: 'Religion not found'
                };
            }
            return {
                success: true,
                message: 'Religion permanently deleted',
                data: null
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete religion',
                error: error.message
            };
        }
    }
    async forceDeleteReligion(id) {
        try {
            // Force delete - remove from database without validation
            const religion = await prismaService_1.default.religions.delete({ where: { id } });
            if (!religion) {
                return {
                    success: false,
                    message: 'Religion not found'
                };
            }
            return {
                success: true,
                message: 'Religion force deleted (validation bypassed)',
                data: null
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to force delete religion',
                error: error.message
            };
        }
    }
    async hardDelete(id) {
        try {
            const religion = await prismaService_1.default.religions.delete({ where: { id } });
            return {
                success: true,
                message: 'Religion deleted permanently'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete religion permanently',
                error: error.message
            };
        }
    }
}
exports.ReligionService = ReligionService;
//# sourceMappingURL=religionService.js.map