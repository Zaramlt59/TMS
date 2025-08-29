import { database } from '../database/connection';
import { Medium, ApiResponse } from '../types';

export class MediumService {
  async getAllMediums(): Promise<ApiResponse<Medium[]>> {
    try {
      const sql = 'SELECT * FROM mediums ORDER BY name';
      const mediums = await database.query<Medium[]>(sql);
      
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
      const sql = 'SELECT * FROM mediums WHERE is_active = TRUE ORDER BY name';
      const mediums = await database.query<Medium[]>(sql);
      
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
      const sql = 'SELECT * FROM mediums WHERE id = ? AND is_active = TRUE';
      const mediums = await database.query<Medium[]>(sql, [id]);
      
      if (mediums.length === 0) {
        return {
          success: false,
          message: 'Medium not found'
        };
      }

      return {
        success: true,
        message: 'Medium retrieved successfully',
        data: mediums[0]
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
      const sql = 'SELECT * FROM mediums WHERE id = ?';
      const mediums = await database.query<Medium[]>(sql, [id]);
      
      if (mediums.length === 0) {
        return {
          success: false,
          message: 'Medium not found'
        };
      }

      return {
        success: true,
        message: 'Medium retrieved successfully',
        data: mediums[0]
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
      const sql = 'INSERT INTO mediums (name, is_active) VALUES (?, ?)';
      const isActive = mediumData.is_active !== undefined ? mediumData.is_active : true;
      await database.query(sql, [mediumData.name, isActive]);
      
      return {
        success: true,
        message: 'Medium created successfully',
        data: { ...mediumData, is_active: isActive }
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
      const sql = 'UPDATE mediums SET name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const isActive = mediumData.is_active !== undefined ? mediumData.is_active : true;
      await database.query(sql, [mediumData.name, isActive, id]);
      
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
      const sql = 'UPDATE mediums SET is_active = FALSE WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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
      const checkResult = await database.query(checkSql, [id]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete medium',
          error: `Medium is being used by ${count} school(s)`
        };
      }
      
      // Hard delete - remove from database
      const sql = 'DELETE FROM mediums WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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