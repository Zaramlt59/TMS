import express from 'express'
import type { Request } from 'express'
type UploadedFile = { filename: string; originalname: string; size: number }
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

// Ensure upload directory exists
const baseDir = path.join(__dirname, '../../uploads/medical-records')
fs.mkdirSync(baseDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, baseDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_')
    const ts = Date.now()
    cb(null, `${name}_${ts}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

// POST /api/uploads/medical-records
router.post('/medical-records', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  const mreq = req as Request & { file?: UploadedFile }
  if (!mreq.file) {
    return res.status(400).json({ success: false, message: 'No file provided' })
  }
  const rel = `/uploads/medical-records/${mreq.file.filename}`
  const host = req.get('host') || 'localhost'
  const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
  const abs = `${protocol}://${host}${rel}`
  res.json({ success: true, data: { url: abs, relativeUrl: rel, originalName: mreq.file.originalname, size: mreq.file.size } })
})

export default router


