import { database } from '../database/connection';
import { BlockOffice, ApiResponse } from '../types';

export class BlockOfficeService {
  async getAllBlockOffices(): Promise<ApiResponse<BlockOffice[]>> {
    try {
      const sql = 'SELECT * FROM block_offices ORDER BY name';
      const blockOffices = await database.query<BlockOffice[]>(sql);
      
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
      const sql = 'SELECT * FROM block_offices WHERE is_active = TRUE ORDER BY name';
      const blockOffices = await database.query<BlockOffice[]>(sql);
      
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
      const sql = 'SELECT * FROM block_offices WHERE id = ? AND is_active = TRUE';
      const blockOffices = await database.query<BlockOffice[]>(sql, [id]);
      
      if (blockOffices.length === 0) {
        return {
          success: false,
          message: 'Block office not found'
        };
      }

      return {
        success: true,
        message: 'Block office retrieved successfully',
        data: blockOffices[0]
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
      const sql = 'SELECT * FROM block_offices WHERE id = ?';
      const blockOffices = await database.query<BlockOffice[]>(sql, [id]);
      
      if (blockOffices.length === 0) {
        return {
          success: false,
          message: 'Block office not found'
        };
      }

      return {
        success: true,
        message: 'Block office retrieved successfully',
        data: blockOffices[0]
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
      const sql = 'INSERT INTO block_offices (name, is_active) VALUES (?, ?)';
      const isActive = blockOfficeData.is_active !== undefined ? blockOfficeData.is_active : true;
      const result = await database.query(sql, [blockOfficeData.name, isActive]);
      const insertId = (result as any).insertId;
      
      // Get the newly created block office
      const newBlockOffice = await this.getBlockOfficeById(insertId);
      return newBlockOffice;
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
      const sql = 'UPDATE block_offices SET name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      const isActive = blockOfficeData.is_active !== undefined ? blockOfficeData.is_active : true;
      await database.query(sql, [blockOfficeData.name, isActive, id]);
      
      // Use the method that can retrieve inactive block offices for admin updates
      const updatedBlockOffice = await this.getBlockOfficeByIdIncludingInactive(id);
      return updatedBlockOffice;
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
      const sql = 'UPDATE block_offices SET is_active = FALSE WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          message: 'Block office not found'
        };
      }

      return {
        success: true,
        message: 'Block office deleted successfully'
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
      const checkResult = await database.query(checkSql, [id, id]);
      const count = (checkResult as any).reduce((sum: number, row: any) => sum + row.count, 0);
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete block office',
          error: `Block office is being used by ${count} school(s) or teacher(s)`
        };
      }
      
      // Hard delete - remove from database
      const sql = 'DELETE FROM block_offices WHERE id = ?';
      const result = await database.query(sql, [id]);
      
      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          message: 'Block office not found'
        };
      }

      return {
        success: true,
        message: 'Block office permanently deleted'
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