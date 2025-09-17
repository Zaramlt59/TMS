"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediumService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
class MediumService {
    async getAllMediums() {
        try {
            const mediums = await prismaService_1.default.mediums.findMany({
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Mediums retrieved successfully',
                data: mediums
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve mediums',
                error: error.message
            };
        }
    }
    async getActiveMediums() {
        try {
            const mediums = await prismaService_1.default.mediums.findMany({
                where: { is_active: true },
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Active mediums retrieved successfully',
                data: mediums
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve active mediums',
                error: error.message
            };
        }
    }
    async getMediumById(id) {
        try {
            const medium = await prismaService_1.default.mediums.findUnique({
                where: { id, is_active: true }
            });
            if (!medium) {
                return {
                    success: false,
                    message: 'Medium not found'
                };
            }
            return {
                success: true,
                message: 'Medium retrieved successfully',
                data: medium
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve medium',
                error: error.message
            };
        }
    }
    async getMediumByIdIncludingInactive(id) {
        try {
            const medium = await prismaService_1.default.mediums.findUnique({
                where: { id }
            });
            if (!medium) {
                return {
                    success: false,
                    message: 'Medium not found'
                };
            }
            return {
                success: true,
                message: 'Medium retrieved successfully',
                data: medium
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve medium',
                error: error.message
            };
        }
    }
    async createMedium(mediumData) {
        try {
            const isActive = mediumData.is_active !== undefined ? mediumData.is_active : true;
            const medium = await prismaService_1.default.mediums.create({
                data: {
                    name: mediumData.name,
                    is_active: isActive
                }
            });
            return {
                success: true,
                message: 'Medium created successfully',
                data: medium
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create medium',
                error: error.message
            };
        }
    }
    async updateMedium(id, mediumData) {
        try {
            const isActive = mediumData.is_active !== undefined ? mediumData.is_active : true;
            const medium = await prismaService_1.default.mediums.update({
                where: { id },
                data: {
                    name: mediumData.name,
                    is_active: isActive,
                    updated_at: new Date()
                }
            });
            // Use the method that can retrieve inactive mediums for admin updates
            const updatedMedium = await this.getMediumByIdIncludingInactive(id);
            return updatedMedium;
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update medium',
                error: error.message
            };
        }
    }
    async deleteMedium(id) {
        try {
            const medium = await prismaService_1.default.mediums.findUnique({
                where: { id }
            });
            if (!medium) {
                return {
                    success: false,
                    message: 'Medium not found'
                };
            }
            // Check if medium is being used by any schools
            const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE medium = (SELECT name FROM mediums WHERE id = ?)';
            const checkResult = await prismaService_1.default.$queryRaw `SELECT COUNT(*) as count FROM schools WHERE medium = (SELECT name FROM mediums WHERE id = ${id})`;
            const count = checkResult[0].count;
            if (count > 0) {
                return {
                    success: false,
                    message: 'Cannot delete medium',
                    error: `Medium is being used by ${count} school(s)`
                };
            }
            // Hard delete - remove from database
            const result = await prismaService_1.default.mediums.delete({
                where: { id }
            });
            if (!result) {
                return {
                    success: false,
                    message: 'Medium not found'
                };
            }
            return {
                success: true,
                message: 'Medium deleted successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete medium',
                error: error.message
            };
        }
    }
    async hardDeleteMedium(id) {
        try {
            // Check if medium is being used by any schools
            const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE medium = (SELECT name FROM mediums WHERE id = ?)';
            const checkResult = await prismaService_1.default.$queryRaw `SELECT COUNT(*) as count FROM schools WHERE medium = (SELECT name FROM mediums WHERE id = ${id})`;
            const count = checkResult[0].count;
            if (count > 0) {
                return {
                    success: false,
                    message: 'Cannot delete medium',
                    error: `Medium is being used by ${count} school(s)`
                };
            }
            // Hard delete - remove from database
            const result = await prismaService_1.default.mediums.delete({
                where: { id }
            });
            if (!result) {
                return {
                    success: false,
                    message: 'Medium not found'
                };
            }
            return {
                success: true,
                message: 'Medium permanently deleted'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete medium',
                error: error.message
            };
        }
    }
}
exports.MediumService = MediumService;
//# sourceMappingURL=mediumService.js.map