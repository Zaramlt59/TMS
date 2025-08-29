import { database } from '../database/connection';
import { District, ApiResponse } from '../types';

export class DistrictService {
  async getAllDistricts(): Promise<ApiResponse<District[]>> {
    try {
      const sql = 'SELECT * FROM districts WHERE is_active = TRUE ORDER BY name';
      const districts = await database.query<District[]>(sql);
      
      return {
        success: true,
        message: 'Districts retrieved successfully',
        data: districts
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve districts',
        error: error.message
      };
    }
  }

  async getAllDistrictsIncludingInactive(): Promise<ApiResponse<District[]>> {
    try {
      const sql = 'SELECT * FROM districts ORDER BY name';
      const districts = await database.query<District[]>(sql);
      
      return {
        success: true,
        message: 'All districts retrieved successfully',
        data: districts
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve all districts',
        error: error.message
      };
    }
  }

  async getActiveDistricts(): Promise<ApiResponse<District[]>> {
    try {
      const sql = 'SELECT * FROM districts WHERE is_active = TRUE ORDER BY name';
      const districts = await database.query<District[]>(sql);
      
      return {
        success: true,
        message: 'Active districts retrieved successfully',
        data: districts
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve active districts',
        error: error.message
      };
    }
  }

  async getDistrictById(id: number): Promise<ApiResponse<District>> {
    try {
      const sql = 'SELECT * FROM districts WHERE id = ? AND is_active = TRUE';
      const districts = await database.query<District[]>(sql, [id]);
      
      if (districts.length === 0) {
        return {
          success: false,
          message: 'District not found'
        };
      }

      return {
        success: true,
        message: 'District retrieved successfully',
        data: districts[0]
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve district',
        error: error.message
      };
    }
  }

  async createDistrict(districtData: District): Promise<ApiResponse<District>> {
    try {
      const sql = 'INSERT INTO districts (name, is_active) VALUES (?, ?)';
      const isActive = districtData.is_active !== undefined ? districtData.is_active : true;
      await database.query(sql, [districtData.name, isActive]);
      
      return {
        success: true,
        message: 'District created successfully',
        data: { ...districtData, is_active: isActive }
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create district',
        error: error.message
      };
    }
  }

  async updateDistrict(id: number, districtData: Partial<District>): Promise<ApiResponse<District>> {
    try {
      const sql = 'UPDATE districts SET name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const isActive = districtData.is_active !== undefined ? districtData.is_active : true;
      await database.query(sql, [districtData.name, isActive, id]);
      
      return {
        success: true,
        message: 'District updated successfully',
        data: { id, name: districtData.name!, is_active: isActive, ...districtData }
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update district',
        error: error.message
      };
    }
  }

  async deleteDistrict(id: number): Promise<ApiResponse<void>> {
    try {
      const sql = 'UPDATE districts SET is_active = FALSE WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          message: 'District not found'
        };
      }

      return {
        success: true,
        message: 'District deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete district',
        error: error.message
      };
    }
  }

  async hardDeleteDistrict(id: number): Promise<ApiResponse<void>> {
    try {
      // Check if district is being used by any RD blocks
      const checkSql = 'SELECT COUNT(*) as count FROM rd_blocks WHERE district_id = ?';
      const checkResult = await database.query(checkSql, [id]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete district',
          error: `District is being used by ${count} RD block(s)`
        };
      }
      
      // Hard delete - remove from database
      const sql = 'DELETE FROM districts WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          message: 'District not found'
        };
      }

      return {
        success: true,
        message: 'District permanently deleted'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete district',
        error: error.message
      };
    }
  }
} 