import prisma from './prismaService';
import { Medium, ApiResponse } from '../types';

export class MediumService {
  async getAllMediums(): Promise<ApiResponse<Medium[]>> {
    try {
      const mediums = await prisma.mediums.findMany({
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Mediums retrieved successfully',
        data: mediums
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve mediums',
        error: error.message
      };
    }
  }

  async getActiveMediums(): Promise<ApiResponse<Medium[]>> {
    try {
      const mediums = await prisma.mediums.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Active mediums retrieved successfully',
        data: mediums
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve active mediums',
        error: error.message
      };
    }
  }

  async getMediumById(id: number): Promise<ApiResponse<Medium>> {
    try {
      const medium = await prisma.mediums.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve medium',
        error: error.message
      };
    }
  }

  async getMediumByIdIncludingInactive(id: number): Promise<ApiResponse<Medium>> {
    try {
      const medium = await prisma.mediums.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve medium',
        error: error.message
      };
    }
  }

  async createMedium(mediumData: Medium): Promise<ApiResponse<Medium>> {
    try {
      const isActive = mediumData.is_active !== undefined ? mediumData.is_active : true;
      const medium = await prisma.mediums.create({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create medium',
        error: error.message
      };
    }
  }

  async updateMedium(id: number, mediumData: Partial<Medium>): Promise<ApiResponse<Medium>> {
    try {
      const isActive = mediumData.is_active !== undefined ? mediumData.is_active : true;
      const medium = await prisma.mediums.update({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update medium',
        error: error.message
      };
    }
  }

  async deleteMedium(id: number): Promise<ApiResponse<void>> {
    try {
      const medium = await prisma.mediums.findUnique({
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
      const checkResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM schools WHERE medium = (SELECT name FROM mediums WHERE id = ${id})`;
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete medium',
          error: `Medium is being used by ${count} school(s)`
        };
      }
      
      // Hard delete - remove from database
      const result = await prisma.mediums.delete({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete medium',
        error: error.message
      };
    }
  }

  async hardDeleteMedium(id: number): Promise<ApiResponse<void>> {
    try {
      // Check if medium is being used by any schools
      const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE medium = (SELECT name FROM mediums WHERE id = ?)';
      const checkResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM schools WHERE medium = (SELECT name FROM mediums WHERE id = ${id})`;
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete medium',
          error: `Medium is being used by ${count} school(s)`
        };
      }
      
      // Hard delete - remove from database
      const result = await prisma.mediums.delete({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete medium',
        error: error.message
      };
    }
  }
} 