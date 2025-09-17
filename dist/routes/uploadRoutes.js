"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Ensure upload directory exists
const baseDir = path_1.default.join(__dirname, '../../uploads/medical-records');
fs_1.default.mkdirSync(baseDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, baseDir);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
        const ts = Date.now();
        cb(null, `${name}_${ts}${ext}`);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
// Upload medical record file
router.post('/medical-records', auth_1.authenticateToken, auth_1.requireAdmin, upload.single('file'), (req, res) => {
    const mreq = req;
    if (!mreq.file) {
        return res.status(400).json({ success: false, message: 'No file provided' });
    }
    const rel = `/uploads/medical-records/${mreq.file.filename}`;
    const host = req.get('host') || 'localhost';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const abs = `${protocol}://${host}${rel}`;
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
    });
});
// Get uploaded file info
router.get('/medical-records/:filename', auth_1.authenticateToken, (req, res) => {
    const { filename } = req.params;
    const filePath = path_1.default.join(baseDir, filename);
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    const stats = fs_1.default.statSync(filePath);
    const rel = `/uploads/medical-records/${filename}`;
    const host = req.get('host') || 'localhost';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const abs = `${protocol}://${host}${rel}`;
    res.json({
        success: true,
        data: {
            filename,
            url: abs,
            relativeUrl: rel,
            size: stats.size,
            uploadedAt: stats.birthtime
        }
    });
});
// Delete uploaded file
router.delete('/medical-records/:filename', auth_1.authenticateToken, auth_1.requireAdmin, (req, res) => {
    const { filename } = req.params;
    const filePath = path_1.default.join(baseDir, filename);
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    try {
        fs_1.default.unlinkSync(filePath);
        res.json({ success: true, message: 'File deleted successfully' });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
});
// List uploaded files
router.get('/', auth_1.authenticateToken, (req, res) => {
    try {
        const files = fs_1.default.readdirSync(baseDir).map(filename => {
            const filePath = path_1.default.join(baseDir, filename);
            const stats = fs_1.default.statSync(filePath);
            const rel = `/uploads/medical-records/${filename}`;
            const host = req.get('host') || 'localhost';
            const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
            const abs = `${protocol}://${host}${rel}`;
            return {
                filename,
                url: abs,
                relativeUrl: rel,
                size: stats.size,
                uploadedAt: stats.birthtime
            };
        });
        res.json({
            success: true,
            message: 'Files retrieved successfully',
            data: files
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to list files',
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map