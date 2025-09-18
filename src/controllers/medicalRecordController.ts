import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../services/prismaService'

function handleValidation(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() })
    return false
  }
  return true
}

export const medicalRecordController = {
  // POST /api/medical-records
  async create(req: Request, res: Response) {
    if (!handleValidation(req, res)) return
    try {
      const { teacherId, ailmentName, severity, diagnosisDate, treatmentStatus, remarks, documents } = req.body
      
      const enteredById = req.user!.userId

      const record = await prisma.medical_records.create({
        data: {
          teacher_id: Number(teacherId),
          ailment_name: ailmentName,
          severity,
          diagnosis_date: diagnosisDate ? new Date(diagnosisDate) : null,
          treatment_status: treatmentStatus || null,
          remarks,
          documents,
          entered_by_id: enteredById
        }
      })

      await prisma.medical_record_logs.create({
        data: {
          medical_record_id: record.id,
          action: 'created',
          changed_by_id: enteredById
        }
      })

      res.status(201).json({ success: true, message: 'Medical record created', data: record })
    } catch (e: any) {
      // If forbidden by middleware, this won't hit; but catch role/logic errors
      res.status(500).json({ success: false, message: e.message || 'Failed to create record' })
    }
  },

  // GET /api/medical-records (all records)
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const skip = (page - 1) * limit

      const [records, totalCount] = await Promise.all([
        prisma.medical_records.findMany({
          where: { deleted_at: null },
          include: {
            teachers: {
              select: {
                id: true,
                teacher_name: true,
                school_id: true
                // teacher_ID: true // Temporarily commented out due to Prisma client type issues
              }
            }
          },
          orderBy: { created_at: 'desc' },
          skip,
          take: limit
        }),
        prisma.medical_records.count({
          where: { deleted_at: null }
        })
      ])

      // Fetch teacher_ID separately using individual queries
      const teacherIdMap = new Map()
      for (const record of records) {
        if (record.teachers) {
          try {
            const result = await prisma.$queryRaw`
              SELECT teacher_ID FROM teachers WHERE id = ${record.teachers.id}
            `
            if (Array.isArray(result) && result.length > 0) {
              teacherIdMap.set(record.teachers.id, (result[0] as any).teacher_ID)
            }
          } catch (error) {
            console.error(`Error fetching teacher_ID for id ${record.teachers.id}:`, error)
            teacherIdMap.set(record.teachers.id, null)
          }
        }
      }

      // Add teacher_ID to each record
      const recordsWithTeacherId = records.map(record => ({
        ...record,
        teachers: record.teachers ? {
          ...record.teachers,
          teacher_ID: teacherIdMap.get(record.teachers.id) || null
        } : null
      }))

      const totalPages = Math.ceil(totalCount / limit)

      res.json({ 
        success: true, 
        data: recordsWithTeacherId,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      })
    } catch (e: any) {
      console.error('Error fetching all medical records:', e)
      res.status(500).json({ success: false, message: e.message || 'Failed to fetch records' })
    }
  },

  // GET /api/medical-records/teachers-without-records
  async getTeachersWithoutRecords(req: Request, res: Response) {
    try {
      const teachersWithoutRecords = await prisma.teachers.findMany({
        where: {
          medical_records: {
            none: {
              deleted_at: null
            }
          }
        },
        select: {
          id: true,
          teacher_name: true,
          school_id: true
          // teacher_ID: true // Temporarily commented out due to Prisma client type issues
        },
        orderBy: { teacher_name: 'asc' }
      })

      // Fetch teacher_ID separately using individual queries
      const teacherIdMap = new Map()
      for (const teacher of teachersWithoutRecords) {
        try {
          const result = await prisma.$queryRaw`
            SELECT teacher_ID FROM teachers WHERE id = ${teacher.id}
          `
          if (Array.isArray(result) && result.length > 0) {
            teacherIdMap.set(teacher.id, (result[0] as any).teacher_ID)
          }
        } catch (error) {
          console.error(`Error fetching teacher_ID for id ${teacher.id}:`, error)
          teacherIdMap.set(teacher.id, null)
        }
      }

      // Add teacher_ID to each teacher
      const teachersWithId = teachersWithoutRecords.map(teacher => ({
        ...teacher,
        teacher_ID: teacherIdMap.get(teacher.id) || null
      }))

      res.json({ success: true, data: teachersWithId })
    } catch (e: any) {
      console.error('Error fetching teachers without medical records:', e)
      res.status(500).json({ success: false, message: e.message || 'Failed to fetch teachers' })
    }
  },

  // GET /api/medical-records/:teacherId
  async getByTeacher(req: Request, res: Response) {
    if (!handleValidation(req, res)) return
    try {
      const teacherId = Number(req.params.teacherId)

      // For now, allow all authenticated users to view medical records
      // TODO: Implement proper permission system based on user-teacher relationship

      const records = await prisma.medical_records.findMany({
        where: { teacher_id: teacherId, deleted_at: null },
        orderBy: { created_at: 'desc' }
      })

      res.json({ success: true, data: records })
    } catch (e: any) {
      console.error('Error fetching medical records:', e)
      res.status(500).json({ success: false, message: e.message || 'Failed to fetch records' })
    }
  },

  // PUT /api/medical-records/:id
  async update(req: Request, res: Response) {
    if (!handleValidation(req, res)) return
    try {
      const id = Number(req.params.id)
      const { ailmentName, severity, diagnosisDate, treatmentStatus, remarks, documents } = req.body
      const changedById = req.user!.userId

      const updated = await prisma.medical_records.update({
        where: { id },
        data: {
          ...(ailmentName ? { ailment_name: ailmentName } : {}),
          ...(severity ? { severity } : {}),
          ...(diagnosisDate !== undefined ? { diagnosis_date: diagnosisDate ? new Date(diagnosisDate) : null } : {}),
          ...(treatmentStatus !== undefined ? { treatment_status: treatmentStatus || null } : {}),
          ...(remarks !== undefined ? { remarks } : {}),
          ...(documents !== undefined ? { documents } : {})
        }
      })

      await prisma.medical_record_logs.create({
        data: {
          medical_record_id: id,
          action: 'updated',
          changed_by_id: changedById
        }
      })

      res.json({ success: true, message: 'Medical record updated', data: updated })
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message || 'Failed to update record' })
    }
  },

  // DELETE /api/medical-records/:id
  async remove(req: Request, res: Response) {
    if (!handleValidation(req, res)) return
    try {
      const id = Number(req.params.id)
      const changedById = req.user!.userId

      const deleted = await prisma.$transaction(async (tx) => {
        const now = new Date()
        const rec = await tx.medical_records.update({ where: { id }, data: { deleted_at: now } })
        await tx.medical_record_logs.create({
          data: {
            medical_record_id: id,
            action: 'deleted',
            changed_by_id: changedById
          }
        })
        return rec
      })

      res.json({ success: true, message: 'Medical record deleted', data: deleted })
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message || 'Failed to delete record' })
    }
  }
}


