import { database } from '../database/connection';
import { Teacher, ApiResponse } from '../types';

export class TeacherService {
  async createTeacher(teacherData: Teacher): Promise<ApiResponse<Teacher>> {
    try {
      const connection = await database.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Insert teacher record
      const sql = `
        INSERT INTO teachers (
            teacher_name, date_of_birth, joining_date, phone_number, email, social_group, religion, gender, aadhaar_number, area_village, subjects_taught, classes_taught,
          school_id, current_school_name, school_level, management, medium,
          habitation, pincode, district, rd_block, school_phone,
          habitation_class, habitation_category, block_office
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      // Convert arrays to strings for database storage
      const subjectsTaught = Array.isArray(teacherData.subjects_taught) 
        ? teacherData.subjects_taught.join(', ') 
        : teacherData.subjects_taught;
      
      const classesTaught = Array.isArray(teacherData.classes_taught) 
        ? teacherData.classes_taught.join(', ') 
        : teacherData.classes_taught;

      const params = [
        teacherData.teacher_name,
        teacherData.date_of_birth,
          teacherData.joining_date,
          teacherData.phone_number || null,
          teacherData.email || null,
          teacherData.social_group,
          teacherData.religion,
          teacherData.gender,
          teacherData.aadhaar_number || null,
          teacherData.area_village || null,
        subjectsTaught,
        classesTaught,
        teacherData.school_id,
        teacherData.current_school_name,
        teacherData.school_level,
        teacherData.management,
        teacherData.medium,
        teacherData.habitation || null,
        teacherData.pincode || null,
        teacherData.district || null,
        teacherData.rd_block || null,
        teacherData.school_phone || null,
        teacherData.habitation_class || null,
        teacherData.habitation_category || null,
        teacherData.block_office
      ];

        const [result] = await connection.query(sql, params);
        const teacherId = (result as any).insertId;
        
        // Insert posting history records if any
        if (teacherData.posting_history && teacherData.posting_history.length > 0) {
          const postingHistorySql = `
            INSERT INTO posting_history (
              teacher_id, school_name, school_type, medium, management, block_office, district,
              rd_block, pincode, habitation, habitation_class, habitation_category, from_date, to_date, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          for (const posting of teacherData.posting_history) {
            const postingParams = [
              teacherId,
              posting.school_name,
              posting.school_type,
              posting.medium,
              posting.management,
              posting.block_office,
              posting.district,
              posting.rd_block || null,
              posting.pincode || null,
              posting.habitation || null,
              posting.habitation_class || null,
              posting.habitation_category || null,
              posting.from_date,
              posting.to_date,
              posting.status || 'Active'
            ];
            await connection.query(postingHistorySql, postingParams);
          }
        }
        
        // Insert deputation records if any
        if (teacherData.deputation && teacherData.deputation.length > 0) {
          const deputationSql = `
            INSERT INTO deputation (
              teacher_id, department_name, designation, joining_date, end_date, status
            ) VALUES (?, ?, ?, ?, ?, ?)
          `;
          
          for (const deputation of teacherData.deputation) {
            const deputationParams = [
              teacherId,
              deputation.department_name,
              deputation.designation,
              deputation.joining_date,
              deputation.end_date,
              deputation.status
            ];
            await connection.query(deputationSql, deputationParams);
          }
        }
        
        // Insert attachment records if any
        if (teacherData.attachment && teacherData.attachment.length > 0) {
          const attachmentSql = `
            INSERT INTO attachment (
              teacher_id, department_name, designation, district, rd_block, habitation, joining_date, end_date, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          for (const attachment of teacherData.attachment) {
            const attachmentParams = [
              teacherId,
              attachment.department_name,
              attachment.designation,
              attachment.district,
              attachment.rd_block,
              attachment.habitation || null,
              attachment.joining_date,
              attachment.end_date,
              attachment.status
            ];
            await connection.query(attachmentSql, attachmentParams);
          }
        }
        
        await connection.commit();
      
      return {
        success: true,
        message: 'Teacher created successfully',
          data: { ...teacherData, id: teacherId }
        };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to create teacher',
        error: error.message
      };
    }
  }

  async getAllTeachers(page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    try {
      const offset = (page - 1) * limit;
      
      const countSql = 'SELECT COUNT(*) as total FROM teachers';
      const countResult = await database.query<[{ total: number }]>(countSql);
      const total = countResult[0].total;

      const sql = `
        SELECT t.*, s.school_name as school_name_full 
        FROM teachers t 
        LEFT JOIN schools s ON t.school_id = s.school_id
        ORDER BY t.created_at DESC 
        LIMIT ? OFFSET ?
      `;
      
      const teachers = await database.query<any[]>(sql, [limit, offset]);
      
      // Parse JSON fields and get posting history for each teacher
      const parsedTeachers = await Promise.all(teachers.map(async (teacher) => {
        // Get posting history for this teacher
        const postingHistorySql = 'SELECT * FROM posting_history WHERE teacher_id = ? ORDER BY from_date DESC';
        const postingHistory = await database.query<any[]>(postingHistorySql, [teacher.id]);
        
        // Get deputation for this teacher
        const deputationSql = 'SELECT * FROM deputation WHERE teacher_id = ? ORDER BY joining_date DESC';
        const deputation = await database.query<any[]>(deputationSql, [teacher.id]);
        
        // Get attachment for this teacher
        const attachmentSql = 'SELECT * FROM attachment WHERE teacher_id = ? ORDER BY joining_date DESC';
        const attachment = await database.query<any[]>(attachmentSql, [teacher.id]);
        
        return {
        ...teacher,
        subjects_taught: teacher.subjects_taught ? teacher.subjects_taught.split(',').map(s => s.trim()).filter(s => s) : [],
        classes_taught: teacher.classes_taught ? teacher.classes_taught.split(',').map(c => c.trim()).filter(c => c) : [],
          school_level: teacher.school_level ? teacher.school_level.split(',').map(l => l.trim()).filter(l => l) : [],
          posting_history: postingHistory,
          deputation: deputation,
          attachment: attachment
        };
      }));

      return {
        success: true,
        message: 'Teachers retrieved successfully',
        data: {
          teachers: parsedTeachers,
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
        message: 'Failed to retrieve teachers',
        error: error.message
      };
    }
  }

  async getTeacherById(teacherId: number): Promise<ApiResponse<Teacher>> {
    try {
      const sql = `
        SELECT t.*, s.school_name as school_name_full 
        FROM teachers t 
        LEFT JOIN schools s ON t.school_id = s.school_id
        WHERE t.id = ?
      `;
      const teachers = await database.query<any[]>(sql, [teacherId]);
      
      if (teachers.length === 0) {
        return {
          success: false,
          message: 'Teacher not found'
        };
      }

      const teacher = teachers[0];
      
      // Get posting history for this teacher
      const postingHistorySql = 'SELECT * FROM posting_history WHERE teacher_id = ? ORDER BY from_date DESC';
      const postingHistory = await database.query<any[]>(postingHistorySql, [teacherId]);
      
      // Get deputation for this teacher
      const deputationSql = 'SELECT * FROM deputation WHERE teacher_id = ? ORDER BY joining_date DESC';
      const deputation = await database.query<any[]>(deputationSql, [teacherId]);
      
      // Get attachment for this teacher
      const attachmentSql = 'SELECT * FROM attachment WHERE teacher_id = ? ORDER BY joining_date DESC';
      const attachment = await database.query<any[]>(attachmentSql, [teacherId]);
      
      // Convert comma-separated strings back to arrays for frontend
      teacher.subjects_taught = teacher.subjects_taught ? teacher.subjects_taught.split(',').map(s => s.trim()).filter(s => s) : [];
      teacher.classes_taught = teacher.classes_taught ? teacher.classes_taught.split(',').map(c => c.trim()).filter(c => c) : [];
      teacher.school_level = teacher.school_level ? teacher.school_level.split(',').map(l => l.trim()).filter(l => l) : [];
      
      teacher.posting_history = postingHistory;
      teacher.deputation = deputation;
      teacher.attachment = attachment;

      return {
        success: true,
        message: 'Teacher retrieved successfully',
        data: teacher
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve teacher',
        error: error.message
      };
    }
  }

  async updateTeacher(teacherId: number, teacherData: Partial<Teacher>): Promise<ApiResponse<Teacher>> {
    try {
      console.log('TeacherService.updateTeacher called with:', { teacherId, teacherData });
      
      // Validate required fields
      if (!teacherData || typeof teacherData !== 'object') {
        console.log('Invalid teacher data provided');
        return {
          success: false,
          message: 'Invalid teacher data provided',
          error: 'Teacher data must be an object'
        };
      }
      
      // Check for required fields
      const requiredFields = ['teacher_name', 'date_of_birth', 'joining_date', 'phone_number', 'social_group', 'religion', 'gender', 'aadhaar_number', 'area_village'];
      const missingFields = requiredFields.filter(field => !teacherData[field as keyof typeof teacherData]);
      
      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        return {
          success: false,
          message: 'Missing required fields',
          error: `Required fields missing: ${missingFields.join(', ')}`
        };
      }
      
      const existingTeacher = await this.getTeacherById(teacherId);
      if (!existingTeacher.success) {
        console.log('Existing teacher not found:', existingTeacher);
        return existingTeacher;
      }

      const connection = await database.getConnection();
      if (!connection) {
        console.log('Failed to get database connection');
        return {
          success: false,
          message: 'Database connection failed',
          error: 'Could not establish database connection'
        };
      }
      
      try {
        await connection.beginTransaction();
        console.log('Database transaction started');

      const updateFields: string[] = [];
      const params: any[] = [];

        // Define valid table columns for teachers
        const validColumns = [
          'teacher_name', 'date_of_birth', 'joining_date', 'phone_number', 'email', 'social_group', 'religion', 'gender', 'aadhaar_number', 'area_village', 'subjects_taught', 
          'classes_taught', 'school_id', 'current_school_name', 'school_level', 
          'management', 'medium', 'habitation', 'pincode', 'district', 
          'rd_block', 'school_phone', 'habitation_class', 'habitation_category', 'block_office'
        ];

      Object.entries(teacherData).forEach(([key, value]) => {
          if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'posting_history' &&
              key !== 'deputation' && key !== 'attachment' && validColumns.includes(key) && value !== undefined && value !== null) {
          if ((key === 'subjects_taught' || key === 'classes_taught') && Array.isArray(value)) {
            updateFields.push(`${key} = ?`);
            params.push(value.join(', '));
          } else if (key === 'school_level' && Array.isArray(value)) {
            updateFields.push(`${key} = ?`);
            params.push(value.join(', '));
          } else {
            updateFields.push(`${key} = ?`);
            params.push(value);
          }
        }
      });

        if (updateFields.length > 0) {
          params.push(teacherId);
          const sql = `UPDATE teachers SET ${updateFields.join(', ')} WHERE id = ?`;
          console.log('Updating teachers table with SQL:', sql);
          console.log('Update params:', params);
          await connection.query(sql, params);
          console.log('Teachers table updated successfully');
        } else {
          console.log('No fields to update in teachers table');
        }

        // Handle posting history updates
        if (teacherData.posting_history !== undefined) {
          console.log('Processing posting history updates:', teacherData.posting_history);
          
          // Validate posting history records
          if (Array.isArray(teacherData.posting_history)) {
            for (let i = 0; i < teacherData.posting_history.length; i++) {
              const posting = teacherData.posting_history[i];
              if (!posting.school_name || !posting.from_date) {
                console.log(`Posting history record ${i} missing required fields:`, posting);
                return {
                  success: false,
                  message: 'Invalid posting history data',
                  error: `Posting history record ${i + 1} missing required fields: school_name or from_date`
                };
              }
            }
          } else {
            console.log('Posting history data is not an array:', teacherData.posting_history);
            return {
              success: false,
              message: 'Invalid posting history data',
              error: 'Posting history data must be an array'
            };
          }
          
          try {
            // Delete existing posting history
            await connection.query('DELETE FROM posting_history WHERE teacher_id = ?', [teacherId]);
            console.log('Deleted existing posting history records for teacher:', teacherId);
            
            // Insert new posting history records
            if (teacherData.posting_history.length > 0) {
              const postingHistorySql = `
                INSERT INTO posting_history (
                  teacher_id, school_name, school_type, medium, management, block_office, district,
                  rd_block, pincode, habitation, habitation_class, habitation_category, from_date, to_date, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;
              
              for (const posting of teacherData.posting_history) {
                console.log('Inserting posting history:', posting);
                
                // Auto-set status based on to_date if not provided
                let status = posting.status
                if (!status) {
                  status = posting.to_date ? 'Completed' : 'Active'
                  console.log('Auto-set status to:', status, 'for posting with to_date:', posting.to_date)
                }
                
                const postingParams = [
                  teacherId,
                  posting.school_name,
                  posting.school_type,
                  posting.medium,
                  posting.management,
                  posting.block_office,
                  posting.district,
                  posting.rd_block || null,
                  posting.pincode || null,
                  posting.habitation || null,
                  posting.habitation_class || null,
                  posting.habitation_category || null,
                  posting.from_date,
                  posting.to_date,
                  status
                ];
                console.log('Posting params:', postingParams);
                await connection.query(postingHistorySql, postingParams);
              }
              console.log('Successfully inserted', teacherData.posting_history.length, 'posting history records');
            } else {
              console.log('No posting history records to insert - array is empty');
            }
          } catch (error) {
            console.error('Error processing posting history:', error);
            throw new Error(`Failed to update posting history: ${error.message}`);
          }
        } else {
          console.log('Posting history field not provided in update data');
        }
        
        // Handle deputation updates
        if (teacherData.deputation !== undefined) {
          console.log('Processing deputation updates:', teacherData.deputation);
          console.log('Deputation data structure:', teacherData.deputation.map(d => ({
            department_name: d.department_name,
            designation: d.designation,
            joining_date: d.joining_date,
            end_date: d.end_date,
            status: d.status,
            hasStatus: 'status' in d,
            statusType: typeof d.status
          })));
          
          // Validate deputation records
          if (Array.isArray(teacherData.deputation)) {
            for (let i = 0; i < teacherData.deputation.length; i++) {
              const deputation = teacherData.deputation[i];
              if (!deputation.department_name || !deputation.designation || !deputation.joining_date) {
                console.log(`Deputation record ${i} missing required fields:`, deputation);
                return {
                  success: false,
                  message: 'Invalid deputation data',
                  error: `Deputation record ${i + 1} missing required fields: department_name, designation, or joining_date`
                };
              }
            }
          } else {
            console.log('Deputation data is not an array:', teacherData.deputation);
            return {
              success: false,
              message: 'Invalid deputation data',
              error: 'Deputation data must be an array'
            };
          }
          
          try {
            // Delete existing deputation
            await connection.query('DELETE FROM deputation WHERE teacher_id = ?', [teacherId]);
            console.log('Deleted existing deputation records for teacher:', teacherId);
            
            // Insert new deputation records
            if (teacherData.deputation.length > 0) {
              const deputationSql = `
                INSERT INTO deputation (
                  teacher_id, department_name, designation, joining_date, end_date, status
                ) VALUES (?, ?, ?, ?, ?, ?)
              `;
              
              for (const deputation of teacherData.deputation) {
                console.log('Inserting deputation:', deputation);
                
                // Auto-set status based on end_date if not provided
                let status = deputation.status
                if (!status) {
                  status = deputation.end_date ? 'Completed' : 'Active'
                  console.log('Auto-set status to:', status, 'for deputation with end_date:', deputation.end_date)
                }
                
                const deputationParams = [
                  teacherId,
                  deputation.department_name,
                  deputation.designation,
                  deputation.joining_date,
                  deputation.end_date,
                  status
                ];
                console.log('Deputation params:', deputationParams);
                await connection.query(deputationSql, deputationParams);
              }
              console.log('Successfully inserted', teacherData.deputation.length, 'deputation records');
            } else {
              console.log('No deputation records to insert - array is empty');
            }
          } catch (error) {
            console.error('Error processing deputation:', error);
            throw new Error(`Failed to update deputation: ${error.message}`);
          }
        } else {
          console.log('Deputation field not provided in update data');
        }
        
        // Handle attachment updates
        if (teacherData.attachment !== undefined) {
          console.log('Processing attachment updates:', teacherData.attachment);
          
          // Validate attachment records
          if (Array.isArray(teacherData.attachment)) {
            for (let i = 0; i < teacherData.attachment.length; i++) {
              const attachment = teacherData.attachment[i];
              if (!attachment.department_name || !attachment.designation || !attachment.district || !attachment.rd_block || !attachment.joining_date) {
                console.log(`Attachment record ${i} missing required fields:`, attachment);
                return {
                  success: false,
                  message: 'Invalid attachment data',
                  error: `Attachment record ${i + 1} missing required fields: department_name, designation, district, rd_block, or joining_date`
                };
              }
            }
          } else {
            console.log('Attachment data is not an array:', teacherData.attachment);
        return {
          success: false,
              message: 'Invalid attachment data',
              error: 'Attachment data must be an array'
            };
          }
          
          try {
            // Delete existing attachment
            await connection.query('DELETE FROM attachment WHERE teacher_id = ?', [teacherId]);
            console.log('Deleted existing attachment records for teacher:', teacherId);
            
            // Insert new attachment records
            if (teacherData.attachment.length > 0) {
              const attachmentSql = `
                INSERT INTO attachment (
                  teacher_id, department_name, designation, district, rd_block, habitation, joining_date, end_date, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;
              
              for (const attachment of teacherData.attachment) {
                console.log('Inserting attachment:', attachment);
                
                // Auto-set status based on end_date if not provided
                let status = attachment.status
                if (!status) {
                  status = attachment.end_date ? 'Completed' : 'Active'
                  console.log('Auto-set status to:', status, 'for attachment with end_date:', attachment.end_date)
                }
                
                const attachmentParams = [
                  teacherId,
                  attachment.department_name,
                  attachment.designation,
                  attachment.district,
                  attachment.rd_block,
                  attachment.habitation || null,
                  attachment.joining_date,
                  attachment.end_date,
                  status
                ];
                console.log('Attachment params:', attachmentParams);
                await connection.query(attachmentSql, attachmentParams);
              }
              console.log('Successfully inserted', teacherData.attachment.length, 'attachment records');
            } else {
              console.log('No attachment records to insert - array is empty');
            }
          } catch (error) {
            console.error('Error processing attachment:', error);
            throw new Error(`Failed to update attachment: ${error.message}`);
          }
        } else {
          console.log('Attachment field not provided in update data');
        }
        
        await connection.commit();
        console.log('Database transaction committed successfully');
      
      return {
        success: true,
        message: 'Teacher updated successfully',
        data: { ...existingTeacher.data, ...teacherData }
      };
      } catch (error) {
        console.error('Error during update transaction:', error);
        await connection.rollback();
        console.log('Database transaction rolled back');
        throw error;
      } finally {
        connection.release();
        console.log('Database connection released');
      }
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to update teacher',
        error: error.message
      };
    }
  }

  async deleteTeacher(teacherId: number): Promise<ApiResponse<void>> {
    try {
      const sql = 'DELETE FROM teachers WHERE id = ?';
      const result = await database.query(sql, [teacherId]);
      
      if ((result as any).affectedRows === 0) {
        return {
          success: false,
          message: 'Teacher not found'
        };
      }

      return {
        success: true,
        message: 'Teacher deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to delete teacher',
        error: error.message
      };
    }
  }

  async getTeachersBySchool(schoolId: string): Promise<ApiResponse<Teacher[]>> {
    try {
      const sql = `
        SELECT t.*, s.school_name as school_name_full 
        FROM teachers t 
        LEFT JOIN schools s ON t.school_id = s.school_id
        WHERE t.school_id = ?
        ORDER BY t.teacher_name
      `;
      
      const teachers = await database.query<any[]>(sql, [schoolId]);
      
      // Convert comma-separated strings back to arrays for frontend
      const parsedTeachers = teachers.map(teacher => ({
        ...teacher,
        subjects_taught: teacher.subjects_taught ? teacher.subjects_taught.split(',').map(s => s.trim()).filter(s => s) : [],
        classes_taught: teacher.classes_taught ? teacher.classes_taught.split(',').map(c => c.trim()).filter(c => c) : [],
        school_level: teacher.school_level ? teacher.school_level.split(',').map(l => l.trim()).filter(l => l) : []
      }));

      return {
        success: true,
        message: 'Teachers retrieved successfully',
        data: parsedTeachers
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to retrieve teachers by school',
        error: error.message
      };
    }
  }

  async searchTeachers(query: string): Promise<ApiResponse<Teacher[]>> {
    try {
      const sql = `
        SELECT t.*, s.school_name as school_name_full 
        FROM teachers t 
        LEFT JOIN schools s ON t.school_id = s.school_id
        WHERE t.teacher_name LIKE ? OR t.school_id LIKE ? OR s.school_name LIKE ? OR t.district LIKE ?
        ORDER BY t.teacher_name
      `;
      
      const searchTerm = `%${query}%`;
      const teachers = await database.query<any[]>(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);
      
      // Convert comma-separated strings back to arrays for frontend
      const parsedTeachers = teachers.map(teacher => ({
        ...teacher,
        subjects_taught: teacher.subjects_taught ? teacher.subjects_taught.split(',').map(s => s.trim()).filter(s => s) : [],
        classes_taught: teacher.classes_taught ? teacher.classes_taught.split(',').map(c => c.trim()).filter(c => c) : [],
        school_level: teacher.school_level ? teacher.school_level.split(',').map(l => l.trim()).filter(l => l) : []
      }));

      return {
        success: true,
        message: 'Teachers found successfully',
        data: parsedTeachers
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to search teachers',
        error: error.message
      };
    }
  }
}
