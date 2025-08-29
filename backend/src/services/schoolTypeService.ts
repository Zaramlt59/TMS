import { database } from '../database/connection';
import { ApiResponse } from '../types';

interface SchoolType {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class SchoolTypeService {
  async getAllSchoolTypes(): Promise<ApiResponse<SchoolType[]>> {
    try {
      const sql = 'SELECT * FROM school_types ORDER BY name ASC';
      const schoolTypes = await database.query<SchoolType[]>(sql);
      
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

  async getActiveSchoolTypes(): Promise<ApiResponse<SchoolType[]>> {
    try {
      const sql = 'SELECT * FROM school_types WHERE is_active = TRUE ORDER BY name ASC';
      const schoolTypes = await database.query<SchoolType[]>(sql);
      
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

  async getSchoolTypeById(id: number): Promise<ApiResponse<SchoolType>> {
    try {
      const sql = 'SELECT * FROM school_types WHERE id = ? AND is_active = TRUE';
      const schoolTypes = await database.query<SchoolType[]>(sql, [id]);
      
      if (schoolTypes.length === 0) {
        return {
          success: false,
          message: 'School type not found',
          error: 'School type with the specified ID does not exist'
        };
      }
      
      return {
        success: true,
        message: 'School type retrieved successfully',
        data: schoolTypes[0]
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
      const sql = 'SELECT * FROM school_types WHERE id = ?';
      const schoolTypes = await database.query<SchoolType[]>(sql, [id]);
      
      if (schoolTypes.length === 0) {
        return {
          success: false,
          message: 'School type not found',
          error: 'School type with the specified ID does not exist'
        };
      }
      
      return {
        success: true,
        message: 'School type retrieved successfully',
        data: schoolTypes[0]
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve school type',
        error: error.message
      };
    }
  }

  async createSchoolType(schoolTypeData: SchoolType): Promise<ApiResponse<SchoolType>> {
    try {
      const sql = 'INSERT INTO school_types (name, is_active) VALUES (?, ?)';
      const isActive = schoolTypeData.is_active !== undefined ? schoolTypeData.is_active : true;
      const result = await database.query(sql, [schoolTypeData.name, isActive]);
      const insertId = (result as any).insertId;
      
      const newSchoolType = await this.getSchoolTypeById(insertId);
      return newSchoolType;
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
      const sql = 'UPDATE school_types SET name = ?, is_active = ? WHERE id = ?';
      const isActive = schoolTypeData.is_active !== undefined ? schoolTypeData.is_active : true;
      await database.query(sql, [schoolTypeData.name, isActive, id]);
      
      // Use the method that can retrieve inactive school types for admin updates
      const updatedSchoolType = await this.getSchoolTypeByIdIncludingInactive(id);
      return updatedSchoolType;
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
      const checkResult = await database.query(checkSql, [id]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete school type',
          error: `School type is being used by ${count} school(s)`
        };
      }
      
      // Soft delete - set is_active to false
      const sql = 'UPDATE school_types SET is_active = FALSE WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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
      const checkResult = await database.query(checkSql, [id]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete school type',
          error: `School type is being used by ${count} school(s)`
        };
      }
      
      // Hard delete - remove from database
      const sql = 'DELETE FROM school_types WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
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
}
