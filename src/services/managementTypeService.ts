import prisma from './prismaService';
import { ManagementType, ApiResponse } from '../types';

export class ManagementTypeService {
  async getAllManagementTypes(): Promise<ApiResponse<ManagementType[]>> {
    try {
      const managementTypes = await prisma.management_types.findMany({
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Management types retrieved successfully',
        data: managementTypes
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve management types',
        error: error.message
      };
    }
  }

  async getManagementTypeById(id: number): Promise<ApiResponse<ManagementType>> {
    try {
      const managementType = await prisma.management_types.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve management type',
        error: error.message
      };
    }
  }

  async getManagementTypeByIdIncludingInactive(id: number): Promise<ApiResponse<ManagementType>> {
    try {
      const managementType = await prisma.management_types.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve management type',
        error: error.message
      };
    }
  }

  async getActiveManagementTypes(): Promise<ApiResponse<ManagementType[]>> {
    try {
      const managementTypes = await prisma.management_types.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Active management types retrieved successfully',
        data: managementTypes
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve active management types',
        error: error.message
      };
    }
  }

  async createManagementType(managementTypeData: ManagementType): Promise<ApiResponse<ManagementType>> {
    try {
      const isActive = managementTypeData.is_active !== undefined ? managementTypeData.is_active : true;
      const managementType = await prisma.management_types.create({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create management type',
        error: error.message
      };
    }
  }

  async updateManagementType(id: number, managementTypeData: Partial<ManagementType>): Promise<ApiResponse<ManagementType>> {
    try {
      const isActive = managementTypeData.is_active !== undefined ? managementTypeData.is_active : true;
      const updatedManagementType = await prisma.management_types.update({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update management type',
        error: error.message
      };
    }
  }

  async deleteManagementType(id: number): Promise<ApiResponse<void>> {
    try {
      const result = await prisma.management_types.update({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete management type',
        error: error.message
      };
    }
  }

  async hardDeleteManagementType(id: number): Promise<ApiResponse<void>> {
    try {
      // Check if management type is being used by any school
      const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE management = (SELECT name FROM management_types WHERE id = ?)';
      const checkResult = await prisma.management_types.findUnique({
        where: { id }
      });
      const count = (checkResult as any).count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete management type',
          error: `Management type is being used by ${count} school(s)`
        };
      }
      
      // Hard delete - remove from database
      const result = await prisma.management_types.delete({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete management type',
        error: error.message
      };
    }
  }
} 