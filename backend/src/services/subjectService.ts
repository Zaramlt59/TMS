import { database } from '../database/connection';
import { ApiResponse } from '../types';

interface Subject {
  id?: number;
  name: string;
  code?: string;
  classes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class SubjectService {
  async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
    try {
      const sql = 'SELECT * FROM subjects ORDER BY name ASC';
      const subjects = await database.query<Subject[]>(sql);
      
      // No need to parse classes field as it's now a simple string
      return {
        success: true,
        message: 'Subjects retrieved successfully',
        data: subjects
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve subjects',
        error: error.message
      };
    }
  }

  async getSubjectById(id: number): Promise<ApiResponse<Subject>> {
    try {
      const sql = 'SELECT * FROM subjects WHERE id = ?';
      const subjects = await database.query<Subject[]>(sql, [id]);
      
      if (subjects.length === 0) {
        return {
          success: false,
          message: 'Subject not found',
          error: 'Subject with the specified ID does not exist'
        };
      }
      
      // No need to parse classes field as it's now a simple string
      const subject = subjects[0];
      
      return {
        success: true,
        message: 'Subject retrieved successfully',
        data: subject
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve subject',
        error: error.message
      };
    }
  }

  async createSubject(subjectData: Subject): Promise<ApiResponse<Subject>> {
    try {
      const sql = 'INSERT INTO subjects (name, code, classes) VALUES (?, ?, ?)';
      const result = await database.query(sql, [
        subjectData.name, 
        subjectData.code || null, 
        subjectData.classes || null
      ]);
      const insertId = (result as any).insertId;
      
      const newSubject = await this.getSubjectById(insertId);
      return newSubject;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create subject',
        error: error.message
      };
    }
  }

  async updateSubject(id: number, subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    try {
      const sql = 'UPDATE subjects SET name = ?, code = ?, classes = ? WHERE id = ?';
      await database.query(sql, [
        subjectData.name, 
        subjectData.code || null, 
        subjectData.classes || null,
        id
      ]);
      
      const updatedSubject = await this.getSubjectById(id);
      return updatedSubject;
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update subject',
        error: error.message
      };
    }
  }

  async deleteSubject(id: number): Promise<ApiResponse<null>> {
    try {
      // Check if subject is being used by any teacher (using LIKE instead of JSON_CONTAINS)
      const checkSql = 'SELECT COUNT(*) as count FROM teachers WHERE subjects_taught LIKE ?';
      const checkResult = await database.query(checkSql, [`%${id}%`]);
      const count = (checkResult as any)[0].count;
      
      if (count > 0) {
        return {
          success: false,
          message: 'Cannot delete subject',
          error: `Subject is being used by ${count} teacher(s)`
        };
      }
      
      const sql = 'DELETE FROM subjects WHERE id = ?';
      await database.query(sql, [id]);
      
      return {
        success: true,
        message: 'Subject deleted successfully',
        data: null
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete subject',
        error: error.message
      };
    }
  }
}
