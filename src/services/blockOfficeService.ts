import prisma from './prismaService';
import { BlockOffice, ApiResponse } from '../types';

export class BlockOfficeService {
  async getAllBlockOffices(): Promise<ApiResponse<BlockOffice[]>> {
    try {
      const blockOffices = await prisma.block_offices.findMany({
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Block offices retrieved successfully',
        data: blockOffices
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve block offices',
        error: error.message
      };
    }
  }

  async getActiveBlockOffices(): Promise<ApiResponse<BlockOffice[]>> {
    try {
      const blockOffices = await prisma.block_offices.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      
      return {
        success: true,
        message: 'Active block offices retrieved successfully',
        data: blockOffices
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve active block offices',
        error: error.message
      };
    }
  }

  async getBlockOfficeById(id: number): Promise<ApiResponse<BlockOffice>> {
    try {
      const blockOffice = await prisma.block_offices.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve block office',
        error: error.message
      };
    }
  }

  async getBlockOfficeByIdIncludingInactive(id: number): Promise<ApiResponse<BlockOffice>> {
    try {
      const blockOffice = await prisma.block_offices.findUnique({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve block office',
        error: error.message
      };
    }
  }

  async createBlockOffice(blockOfficeData: BlockOffice): Promise<ApiResponse<BlockOffice>> {
    try {
      const isActive = blockOfficeData.is_active !== undefined ? blockOfficeData.is_active : true;
      const blockOffice = await prisma.block_offices.create({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create block office',
        error: error.message
      };
    }
  }

  async updateBlockOffice(id: number, blockOfficeData: Partial<BlockOffice>): Promise<ApiResponse<BlockOffice>> {
    try {
      const isActive = blockOfficeData.is_active !== undefined ? blockOfficeData.is_active : true;
      const updatedBlockOffice = await prisma.block_offices.update({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update block office',
        error: error.message
      };
    }
  }

  async deleteBlockOffice(id: number): Promise<ApiResponse<void>> {
    try {
      const result = await prisma.block_offices.update({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete block office',
        error: error.message
      };
    }
  }

  async hardDeleteBlockOffice(id: number): Promise<ApiResponse<void>> {
    try {
      // Check if block office is being used by any schools or teachers
      const checkSql = 'SELECT COUNT(*) as count FROM schools WHERE block_office = (SELECT name FROM block_offices WHERE id = ?) UNION SELECT COUNT(*) as count FROM teachers WHERE block_office = (SELECT name FROM block_offices WHERE id = ?)';
      const checkResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM schools WHERE block_office = (SELECT name FROM block_offices WHERE id = ${id}) UNION SELECT COUNT(*) as count FROM teachers WHERE block_office = (SELECT name FROM block_offices WHERE id = ${id})`;
      const count = (checkResult as any).reduce((sum: number, row: any) => sum + row.count, 0);
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete block office',
          error: `Block office is being used by ${count} school(s) or teacher(s)`
        };
      }
      
      // Hard delete - remove from database
      const result = await prisma.block_offices.delete({
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
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete block office',
        error: error.message
      };
    }
  }
} 