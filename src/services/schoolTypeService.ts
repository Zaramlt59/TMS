import prisma from './prismaService';
import { SchoolType, ApiResponse } from '../types';

export class SchoolTypeService {
  async getAllSchoolTypes(): Promise<ApiResponse<SchoolType[]>> {
    try {
      const schoolTypes = await prisma.school_types.findMany({
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'School types retrieved successfully',
        data: schoolTypes
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve school types',
        error: error.message
      };
    }
  }

  async getAllSchoolTypesIncludingInactive(): Promise<ApiResponse<SchoolType[]>> {
    try {
      const schoolTypes = await prisma.school_types.findMany({
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'All school types retrieved successfully',
        data: schoolTypes
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve all school types',
        error: error.message
      };
    }
  }

  async getSchoolTypeById(id: number): Promise<ApiResponse<SchoolType>> {
    try {
      const schoolType = await prisma.school_types.findUnique({
        where: { id, is_active: true }
      });
      
      if (!schoolType) {
        return {
          success: false,
          message: 'School type not found'
        };
      }

      return {
        success: true,
        message: 'School type retrieved successfully',
        data: schoolType
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve school type',
        error: error.message
      };
    }
  }

  async getSchoolTypeByIdIncludingInactive(id: number): Promise<ApiResponse<SchoolType>> {
    try {
      const schoolType = await prisma.school_types.findUnique({
        where: { id }
      });
      
      if (!schoolType) {
        return {
          success: false,
          message: 'School type not found'
        };
      }

      return {
        success: true,
        message: 'School type retrieved successfully',
        data: schoolType
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve school type',
        error: error.message
      };
    }
  }

  async getActiveSchoolTypes(): Promise<ApiResponse<SchoolType[]>> {
    try {
      const schoolTypes = await prisma.school_types.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Active school types retrieved successfully',
        data: schoolTypes
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve active school types',
        error: error.message
      };
    }
  }

  async createSchoolType(schoolTypeData: SchoolType): Promise<ApiResponse<SchoolType>> {
    try {
      const isActive = schoolTypeData.is_active !== undefined ? schoolTypeData.is_active : true;
      const schoolType = await prisma.school_types.create({
        data: {
          name: schoolTypeData.name,
          is_active: isActive
        }
      });
      
      return {
        success: true,
        message: 'School type created successfully',
        data: schoolType
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create school type',
        error: error.message
      };
    }
  }

  async updateSchoolType(id: number, schoolTypeData: Partial<SchoolType>): Promise<ApiResponse<SchoolType>> {
    try {
      const isActive = schoolTypeData.is_active !== undefined ? schoolTypeData.is_active : true;
      const updatedSchoolType = await prisma.school_types.update({
        where: { id },
        data: {
          name: schoolTypeData.name,
          is_active: isActive
        }
      });
      
      return {
        success: true,
        message: 'School type updated successfully',
        data: updatedSchoolType
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update school type',
        error: error.message
      };
    }
  }

  async deleteSchoolType(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if school type is being used by any school
      const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE school_type = (SELECT name FROM school_types WHERE id = ?)';
      const checkResult = await prisma.school_types.findUnique({
        where: { id }
      });
      const count = (checkResult as any).count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete school type',
          error: `School type is being used by ${count} school(s)`
        };
      }
      
      // Soft delete - set is_active to false
      const deletedSchoolType = await prisma.school_types.update({
        where: { id },
        data: { is_active: false }
      });
      
      if (!deletedSchoolType) {
        return {
          success: false,
          message: 'School type not found',
          error: 'School type with the specified ID does not exist'
        };
      }
      
      return {
        success: true,
        message: 'School type deleted successfully',
        data: null
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete school type',
        error: error.message
      };
    }
  }

  async hardDeleteSchoolType(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if school type is being used by any school
      const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE school_type = (SELECT name FROM school_types WHERE id = ?)';
      const checkResult = await prisma.school_types.findUnique({
        where: { id }
      });
      const count = (checkResult as any).count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete school type',
          error: `School type is being used by ${count} school(s)`
        };
      }
      
      // Hard delete - remove from database
      const deletedSchoolType = await prisma.school_types.delete({
        where: { id }
      });
      
      if (!deletedSchoolType) {
        return {
          success: false,
          message: 'School type not found'
        };
      }

      return {
        success: true,
        message: 'School type permanently deleted successfully',
        data: null
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete school type',
        error: error.message
      };
    }
  }

  async hardDelete(id: number): Promise<ApiResponse<void>> {
    try {
      const deletedSchoolType = await prisma.school_types.delete({
        where: { id }
      });
      
      if (!deletedSchoolType) {
        return {
          success: false,
          message: 'School type not found'
        };
      }

      return {
        success: true,
        message: 'School type deleted permanently'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete school type permanently',
        error: error.message
      };
    }
  }
}
