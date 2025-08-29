import { database } from '../database/connection';
import { ApiResponse } from '../types';

interface Religion {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class ReligionService {
  async getAllReligions(): Promise<ApiResponse<Religion[]>> {
    try {
      const sql = 'SELECT * FROM religions ORDER BY name ASC';
      const religions = await database.query<Religion[]>(sql);
      
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
      const sql = 'SELECT * FROM religions WHERE id = ? AND is_active = TRUE';
      const religions = await database.query<Religion[]>(sql, [id]);
      
      if (religions.length === 0) {
        return {
          success: false,
          message: 'Religion not found',
          error: 'Religion with the specified ID does not exist'
        };
      }
      
      return {
        success: true,
        message: 'Religion retrieved successfully',
        data: religions[0]
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
      const sql = 'SELECT * FROM religions WHERE id = ?';
      const religions = await database.query<Religion[]>(sql, [id]);
      
      if (religions.length === 0) {
        return {
          success: false,
          message: 'Religion not found',
          error: 'Religion with the specified ID does not exist'
        };
      }
      
      return {
        success: true,
        message: 'Religion retrieved successfully',
        data: religions[0]
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
      const sql = 'SELECT * FROM religions WHERE is_active = TRUE ORDER BY name ASC';
      const religions = await database.query<Religion[]>(sql);
      
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
      const sql = 'INSERT INTO religions (name, is_active) VALUES (?, ?)';
      const isActive = religionData.is_active !== undefined ? religionData.is_active : true;
      const result = await database.query(sql, [religionData.name, isActive]);
      const insertId = (result as any).insertId;
      
      const newReligion = await this.getReligionById(insertId);
      return newReligion;
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
      const sql = 'UPDATE religions SET name = ?, is_active = ? WHERE id = ?';
      const isActive = religionData.is_active !== undefined ? religionData.is_active : true;
      await database.query(sql, [religionData.name, isActive, id]);
      
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
      const checkResult = await database.query(checkSql, [id]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete religion',
          error: `Religion is being used by ${count} teacher(s)`
        };
      }
      
      // Soft delete - set is_active to false
      const sql = 'UPDATE religions SET is_active = FALSE WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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
      const checkSql = 'SELECT COUNT(*) as count FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ?)';
      const checkResult = await database.query(checkSql, [id]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        // Get more details about which teachers are using this religion
        const detailSql = 'SELECT teacher_name FROM teachers WHERE religion = (SELECT name FROM religions WHERE id = ?) LIMIT 5';
        const detailResult = await database.query(detailSql, [id]);
        const teacherNames = detailResult.map((t: any) => t.teacher_name).join(', ');
        
        return {
          success: false,
          message: 'Cannot delete religion',
          error: `Religion is being used by ${count} teacher(s). Some examples: ${teacherNames}`
        };
      }
      
      // Hard delete - remove from database
      const sql = 'DELETE FROM religions WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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
      const sql = 'DELETE FROM religions WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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
}
