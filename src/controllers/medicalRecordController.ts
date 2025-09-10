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
      const { teacherId, ailmentName, severity, remarks, documents } = req.body
      const enteredById = req.user!.userId

      const record = await prisma.medical_records.create({
        data: {
          teacher_id: Number(teacherId),
          ailment_name: ailmentName,
          severity,
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
      const { ailmentName, severity, remarks, documents } = req.body
      const changedById = req.user!.userId

      const updated = await prisma.medical_records.update({
        where: { id },
        data: {
          ...(ailmentName ? { ailment_name: ailmentName } : {}),
          ...(severity ? { severity } : {}),
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


