import { database } from '../database/connection';
import { School, ApiResponse } from '../types';

export class SchoolService {
  async createSchool(schoolData: School): Promise<ApiResponse<School>> {
    try {
      // Validate that the management type is active
      if (schoolData.management) {
        const managementCheckSql = 'SELECT is_active FROM management_types WHERE name = ?';
        const managementResult = await database.query<[{ is_active: boolean }]>(managementCheckSql, [schoolData.management]);
        
        if ((managementResult as any).length === 0) {
          return {
            success: false,
            message: 'Invalid management type specified',
            error: 'Management type not found'
          };
        }
        
        if (!(managementResult as any)[0].is_active) {
          return {
            success: false,
            message: 'Cannot use inactive management type',
            error: `Management type "${schoolData.management}" is inactive`
          };
        }
      }

      const sql = `
        INSERT INTO schools (
          school_id, school_name, school_type, school_level, management, medium,
          pincode, district, rd_block, school_phone, school_email, habitation,
          habitation_class, habitation_category, block_office
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        schoolData.school_id,
        schoolData.school_name,
        schoolData.school_type,
        schoolData.school_level,
        schoolData.management,
        schoolData.medium,
        schoolData.pincode || null,
        schoolData.district || null,
        schoolData.rd_block || null,
        schoolData.school_phone || null,
        schoolData.school_email || null,
        schoolData.habitation || null,
        schoolData.habitation_class || null,
        schoolData.habitation_category || null,
        schoolData.block_office
      ];

      await database.query(sql, params);
      
      return {
        success: true,
        message: 'School created successfully',
        data: schoolData
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create school',
        error: error.message
      };
    }
  }

  async getAllSchools(page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      
      const countSql = 'SELECT COUNT(*) as total FROM schools';
      const countResult = await database.query<[{ total: number }]>(countSql);
      const total = countResult[0].total;

      const sql = `
        SELECT * FROM schools 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      
      const schools = await database.query<School[]>(sql, [limit, offset]);
      
      // No need to parse school_level as it's now a simple string
      const parsedSchools = schools;

      return {
        success: true,
        message: 'Schools retrieved successfully',
        data: {
          schools: parsedSchools,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve schools',
        error: error.message
      };
    }
  }

  async getSchoolById(schoolId: string): Promise<ApiResponse<School>> {
    try {
      const sql = 'SELECT * FROM schools WHERE school_id = ?';
      const schools = await database.query<School[]>(sql, [schoolId]);
      
      if (schools.length === 0) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      const school = schools[0];
      // school_level is now a simple string, no parsing needed

      return {
        success: true,
        message: 'School retrieved successfully',
        data: school
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve school',
        error: error.message
      };
    }
  }

  async updateSchool(schoolId: string, schoolData: Partial<School>): Promise<ApiResponse<School>> {
    try {
      const existingSchool = await this.getSchoolById(schoolId);
      if (!existingSchool.success) {
        return existingSchool;
      }

      // Validate that the management type is active if it's being updated
      if (schoolData.management) {
        const managementCheckSql = 'SELECT is_active FROM management_types WHERE name = ?';
        const managementResult = await database.query<[{ is_active: boolean }]>(managementCheckSql, [schoolData.management]);
        
        if ((managementResult as any).length === 0) {
          return {
            success: false,
            message: 'Invalid management type specified',
            error: 'Management type not found'
          };
        }
        
        if (!(managementResult as any)[0].is_active) {
          return {
            success: false,
            message: 'Cannot use inactive management type',
            error: `Management type "${schoolData.management}" is inactive`
          };
        }
      }

      const updateFields: string[] = [];
      const params: any[] = [];

      Object.entries(schoolData).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'school_id' && key !== 'created_at' && key !== 'updated_at') {
          if (key === 'school_level') {
            updateFields.push(`${key} = ?`);
            params.push(value);
          } else {
            updateFields.push(`${key} = ?`);
            params.push(value);
          }
        }
      });

      if (updateFields.length === 0) {
        return {
          success: false,
          message: 'No fields to update'
        };
      }

      params.push(schoolId);
      const sql = `UPDATE schools SET ${updateFields.join(', ')} WHERE school_id = ?`;
      
      await database.query(sql, params);
      
      return {
        success: true,
        message: 'School updated successfully',
        data: { ...existingSchool.data, ...schoolData }
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update school',
        error: error.message
      };
    }
  }

  async deleteSchool(schoolId: string): Promise<ApiResponse<void>> {
    try {
      const sql = 'DELETE FROM schools WHERE school_id = ?';
      const result = await database.query(sql, [schoolId]);
      
      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          message: 'School not found'
        };
      }

      return {
        success: true,
        message: 'School deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete school',
        error: error.message
      };
    }
  }

  async searchSchools(query: string): Promise<ApiResponse<School[]>> {
    try {
      const sql = `
        SELECT * FROM schools 
        WHERE school_name LIKE ? OR school_id LIKE ? OR district LIKE ?
        ORDER BY school_name
      `;
      
      const searchTerm = `%${query}%`;
      const schools = await database.query<School[]>(sql, [searchTerm, searchTerm, searchTerm]);
      
      // No need to parse school_level as it's now a simple string
      const parsedSchools = schools;

      return {
        success: true,
        message: 'Schools found successfully',
        data: parsedSchools
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to search schools',
        error: error.message
      };
    }
  }

  async getStats(): Promise<ApiResponse<any>> {
    try {
      const totalSchoolsSql = 'SELECT COUNT(*) as total FROM schools';
      const uniqueDistrictsSql = 'SELECT COUNT(DISTINCT district) as unique_districts FROM schools WHERE district IS NOT NULL AND district != ""';
      
      const [totalResult, districtsResult] = await Promise.all([
        database.query<[{ total: number }]>(totalSchoolsSql),
        database.query<[{ unique_districts: number }]>(uniqueDistrictsSql)
      ]);
      
      const totalSchools = totalResult[0].total;
      const uniqueDistricts = districtsResult[0].unique_districts;

      return {
        success: true,
        message: 'Statistics retrieved successfully',
        data: {
          totalSchools,
          uniqueDistricts
        }
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve statistics',
        error: error.message
      };
    }
  }
}
