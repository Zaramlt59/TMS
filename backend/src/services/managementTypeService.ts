import { database } from '../database/connection';
import { ManagementType, ApiResponse } from '../types';

export class ManagementTypeService {
  async getAllManagementTypes(): Promise<ApiResponse<ManagementType[]>> {
    try {
      const sql = 'SELECT * FROM management_types ORDER BY name';
      const managementTypes = await database.query<ManagementType[]>(sql);
      
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
      const sql = 'SELECT * FROM management_types WHERE id = ? AND is_active = TRUE';
      const managementTypes = await database.query<ManagementType[]>(sql, [id]);
      
      if (managementTypes.length === 0) {
        return {
          success: false,
          message: 'Management type not found'
        };
      }

      return {
        success: true,
        message: 'Management type retrieved successfully',
        data: managementTypes[0]
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
      const sql = 'SELECT * FROM management_types WHERE id = ?';
      const managementTypes = await database.query<ManagementType[]>(sql, [id]);
      
      if (managementTypes.length === 0) {
        return {
          success: false,
          message: 'Management type not found'
        };
      }

      return {
        success: true,
        message: 'Management type retrieved successfully',
        data: managementTypes[0]
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
      const sql = 'SELECT * FROM management_types WHERE is_active = TRUE ORDER BY name';
      const managementTypes = await database.query<ManagementType[]>(sql);
      
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
      const sql = 'INSERT INTO management_types (name, is_active) VALUES (?, ?)';
      const isActive = managementTypeData.is_active !== undefined ? managementTypeData.is_active : true;
      const result = await database.query(sql, [managementTypeData.name, isActive]);
      const insertId = (result as any).insertId;
      
      const newManagementType = await this.getManagementTypeById(insertId);
      return newManagementType;
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
      const sql = 'UPDATE management_types SET name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const isActive = managementTypeData.is_active !== undefined ? managementTypeData.is_active : true;
      await database.query(sql, [managementTypeData.name, isActive, id]);
      
      // Use the method that can retrieve inactive management types for admin updates
      const updatedManagementType = await this.getManagementTypeByIdIncludingInactive(id);
      return updatedManagementType;
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
      const sql = 'UPDATE management_types SET is_active = FALSE WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          message: 'Management type not found'
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
      const checkResult = await database.query(checkSql, [id]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete management type',
          error: `Management type is being used by ${count} school(s)`
        };
      }
      
      // Hard delete - remove from database
      const sql = 'DELETE FROM management_types WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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