import prisma from './prismaService';
import { Religion, ApiResponse } from '../types';

export class ReligionService {
  async getAllReligions(): Promise<ApiResponse<Religion[]>> {
    try {
      const religions = await prisma.religions.findMany({
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Religions retrieved successfully',
        data: religions
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve religions',
        error: error.message
      };
    }
  }

  async getReligionById(id: number): Promise<ApiResponse<Religion>> {
    try {
      const religion = await prisma.religions.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve religion',
        error: error.message
      };
    }
  }

  async getReligionByIdIncludingInactive(id: number): Promise<ApiResponse<Religion>> {
    try {
      const religion = await prisma.religions.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve religion',
        error: error.message
      };
    }
  }

  async getActiveReligions(): Promise<ApiResponse<Religion[]>> {
    try {
      const religions = await prisma.religions.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Active religions retrieved successfully',
        data: religions
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve active religions',
        error: error.message
      };
    }
  }

  async createReligion(religionData: Religion): Promise<ApiResponse<Religion>> {
    try {
      const isActive = religionData.is_active !== undefined ? religionData.is_active : true;
      const religion = await prisma.religions.create({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create religion',
        error: error.message
      };
    }
  }

  async updateReligion(id: number, religionData: Partial<Religion>): Promise<ApiResponse<Religion>> {
    try {
      const isActive = religionData.is_active !== undefined ? religionData.is_active : true;
      const religion = await prisma.religions.update({
        where: { id },
        data: {
          name: religionData.name,
          is_active: isActive
        }
      });
      
      // Use the method that can retrieve inactive religions for admin updates
      const updatedReligion = await this.getReligionByIdIncludingInactive(id);
      return updatedReligion;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update religion',
        error: error.message
      };
    }
  }

  async deleteReligion(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if religion is being used by any teacher
      const checkSql = 'SELECT COUNT(*) as count FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ?)';
      const checkResult = await prisma.religions.findUnique({ where: { id } });
      const count = (checkResult as any).count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete religion',
          error: `Religion is being used by ${count} teacher(s)`
        };
      }
      
      // Soft delete - set is_active to false
      const religion = await prisma.religions.update({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete religion',
        error: error.message
      };
    }
  }

  async hardDeleteReligion(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if religion is being used by any teacher
      const checkResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ${id})`;
      const count = Array.isArray(checkResult) && checkResult.length > 0 ? (checkResult[0] as any).count : 0;
      
      if (count > 0) {
        // Get more details about which teachers are using this religion
        const detailResult = await prisma.$queryRaw`SELECT teacher_name FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ${id}) LIMIT 5`;
        const teacherNames = Array.isArray(detailResult) ? detailResult.map((t: any) => t.teacher_name).join(', ') : '';
        
        return {
          success: false,
          message: 'Cannot delete religion',
          error: `Religion is being used by ${count} teacher(s). Some examples: ${teacherNames}`
        };
      }
      
      // Hard delete - remove from database
      const religion = await prisma.religions.delete({ where: { id } });
      
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete religion',
        error: error.message
      };
    }
  }

  async forceDeleteReligion(id: number): Promise<ApiResponse<null>> {
    try {
      // Force delete - remove from database without validation
      const religion = await prisma.religions.delete({ where: { id } });
      
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to force delete religion',
        error: error.message
      };
    }
  }

  async hardDelete(id: number): Promise<ApiResponse<void>> {
    try {
      const religion = await prisma.religions.delete({ where: { id } });
      
      return {
        success: true,
        message: 'Religion deleted permanently'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete religion permanently',
        error: error.message
      };
    }
  }
}
