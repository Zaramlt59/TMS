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

// Upload medical record file
router.post('/medical-records', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  const mreq = req as Request & { file?: UploadedFile }
  if (!mreq.file) {
    return res.status(400).json({ success: false, message: 'No file provided' })
  }
  const rel = `/uploads/medical-records/${mreq.file.filename}`
  const host = req.get('host') || 'localhost'
  const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
  const abs = `${protocol}://${host}${rel}`
  res.json({ 
    success: true, 
    message: 'File uploaded successfully',
    data: { 
      url: abs, 
      relativeUrl: rel, 
      originalName: mreq.file.originalname, 
      size: mreq.file.size,
      filename: mreq.file.filename
    } 
  })
})

// Serve medical record file directly (for viewing/downloading)
router.get('/medical-records/:filename', authenticateToken, (req, res) => {
  const { filename } = req.params
  const filePath = path.join(baseDir, filename)
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' })
  }
  
  // Set appropriate headers for file download/viewing
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
  res.setHeader('Content-Type', 'application/pdf')
  
  // Stream the file
  res.sendFile(filePath)
})

// Get uploaded file info (metadata only)
router.get('/medical-records/:filename/info', authenticateToken, (req, res) => {
  const { filename } = req.params
  const filePath = path.join(baseDir, filename)
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' })
  }
  
  const stats = fs.statSync(filePath)
  const rel = `/uploads/medical-records/${filename}`
  const host = req.get('host') || 'localhost'
  const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
  const abs = `${protocol}://${host}${rel}`
  
  res.json({
    success: true,
    data: {
      filename,
      url: abs,
      relativeUrl: rel,
      size: stats.size,
      uploadedAt: stats.birthtime
    }
  })
})

// Delete uploaded file
router.delete('/medical-records/:filename', authenticateToken, requireAdmin, (req, res) => {
  const { filename } = req.params
  const filePath = path.join(baseDir, filename)
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' })
  }
  
  try {
    fs.unlinkSync(filePath)
    res.json({ success: true, message: 'File deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete file',
      error: error.message 
    })
  }
})

// List uploaded files
router.get('/', authenticateToken, (req, res) => {
  try {
    const files = fs.readdirSync(baseDir).map(filename => {
      const filePath = path.join(baseDir, filename)
      const stats = fs.statSync(filePath)
      const rel = `/uploads/medical-records/${filename}`
      const host = req.get('host') || 'localhost'
      const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http'
      const abs = `${protocol}://${host}${rel}`
      
      return {
        filename,
        url: abs,
        relativeUrl: rel,
        size: stats.size,
        uploadedAt: stats.birthtime
      }
    })
    
    res.json({
      success: true,
      message: 'Files retrieved successfully',
      data: files
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to list files',
      error: error.message
    })
  }
})

export default router


