"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementTypeService = void 0;
const prismaService_1 = __importDefault(require("./prismaService"));
class ManagementTypeService {
    async getAllManagementTypes() {
        try {
            const managementTypes = await prismaService_1.default.management_types.findMany({
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Management types retrieved successfully',
                data: managementTypes
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve management types',
                error: error.message
            };
        }
    }
    async getManagementTypeById(id) {
        try {
            const managementType = await prismaService_1.default.management_types.findUnique({
                where: { id, is_active: true }
            });
            if (!managementType) {
                return {
                    success: false,
                    message: 'Management type not found'
                };
            }
            return {
                success: true,
                message: 'Management type retrieved successfully',
                data: managementType
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve management type',
                error: error.message
            };
        }
    }
    async getManagementTypeByIdIncludingInactive(id) {
        try {
            const managementType = await prismaService_1.default.management_types.findUnique({
                where: { id }
            });
            if (!managementType) {
                return {
                    success: false,
                    message: 'Management type not found'
                };
            }
            return {
                success: true,
                message: 'Management type retrieved successfully',
                data: managementType
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve management type',
                error: error.message
            };
        }
    }
    async getActiveManagementTypes() {
        try {
            const managementTypes = await prismaService_1.default.management_types.findMany({
                where: { is_active: true },
                orderBy: { name: 'asc' }
            });
            return {
                success: true,
                message: 'Active management types retrieved successfully',
                data: managementTypes
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to retrieve active management types',
                error: error.message
            };
        }
    }
    async createManagementType(managementTypeData) {
        try {
            const isActive = managementTypeData.is_active !== undefined ? managementTypeData.is_active : true;
            const managementType = await prismaService_1.default.management_types.create({
                data: {
                    name: managementTypeData.name,
                    is_active: isActive
                }
            });
            return {
                success: true,
                message: 'Management type created successfully',
                data: managementType
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to create management type',
                error: error.message
            };
        }
    }
    async updateManagementType(id, managementTypeData) {
        try {
            const isActive = managementTypeData.is_active !== undefined ? managementTypeData.is_active : true;
            const updatedManagementType = await prismaService_1.default.management_types.update({
                where: { id },
                data: {
                    name: managementTypeData.name,
                    is_active: isActive,
                    updated_at: new Date()
                }
            });
            // Use the method that can retrieve inactive management types for admin updates
            return {
                success: true,
                message: 'Management type updated successfully',
                data: updatedManagementType
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to update management type',
                error: error.message
            };
        }
    }
    async deleteManagementType(id) {
        try {
            const result = await prismaService_1.default.management_types.update({
                where: { id },
                data: { is_active: false }
            });
            if (result.is_active === true) { // Check if the update was successful (i.e., not already inactive)
                return {
                    success: false,
                    message: 'Management type not found or already inactive'
                };
            }
            return {
                success: true,
                message: 'Management type deleted successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete management type',
                error: error.message
            };
        }
    }
    async hardDeleteManagementType(id) {
        try {
            // Check if management type is being used by any school
            const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE management = (SELECT name FROM management_types WHERE id = ?)';
            const checkResult = await prismaService_1.default.management_types.findUnique({
                where: { id }
            });
            const count = checkResult.count;
            if (count > 0) {
                return {
                    success: false,
                    message: 'Cannot delete management type',
                    error: `Management type is being used by ${count} school(s)`
                };
            }
            // Hard delete - remove from database
            const result = await prismaService_1.default.management_types.delete({
                where: { id }
            });
            if (!result) {
                return {
                    success: false,
                    message: 'Management type not found'
                };
            }
            return {
                success: true,
                message: 'Management type permanently deleted'
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to delete management type',
                error: error.message
            };
        }
    }
}
exports.ManagementTypeService = ManagementTypeService;
//# sourceMappingURL=managementTypeService.js.map