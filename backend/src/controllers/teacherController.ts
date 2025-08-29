import { Request, Response } from 'express';
import { TeacherService } from '../services/teacherService';

export class TeacherController {
  private teacherService: TeacherService;

  constructor() {
    this.teacherService = new TeacherService();
  }

  // Create teacher
  async createTeacher(req: Request, res: Response) {
    try {
      const result = await this.teacherService.createTeacher(req.body);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all teachers with pagination
  async getAllTeachers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.teacherService.getAllTeachers(page, limit);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Search teachers
  async searchTeachers(req: Request, res: Response) {
    try {
      const result = await this.teacherService.searchTeachers(req.query.q as string);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get teachers by school
  async getTeachersBySchool(req: Request, res: Response) {
    try {
      const result = await this.teacherService.getTeachersBySchool(req.params.schoolId);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get teacher by ID
  async getTeacherById(req: Request, res: Response) {
    try {
      const result = await this.teacherService.getTeacherById(parseInt(req.params.teacherId));
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update teacher
  async updateTeacher(req: Request, res: Response) {
    try {
      console.log('Update teacher request:', {
        teacherId: req.params.teacherId,
        body: req.body,
        bodyKeys: Object.keys(req.body)
      });
      
      const result = await this.teacherService.updateTeacher(parseInt(req.params.teacherId), req.body);
      console.log('Update teacher result:', result);
      
      if (result.success) {
        res.json(result);
      } else {
        console.log('Update teacher failed:', result);
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('Update teacher error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete teacher
  async deleteTeacher(req: Request, res: Response) {
    try {
      const result = await this.teacherService.deleteTeacher(parseInt(req.params.teacherId));
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}
