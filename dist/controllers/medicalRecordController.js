"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalRecordController = void 0;
const express_validator_1 = require("express-validator");
const prismaService_1 = __importDefault(require("../services/prismaService"));
function handleValidation(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
        return false;
    }
    return true;
}
exports.medicalRecordController = {
    // POST /api/medical-records
    async create(req, res) {
        if (!handleValidation(req, res))
            return;
        try {
            const { teacherId, ailmentName, severity, diagnosisDate, treatmentStatus, remarks, documents } = req.body;
            const enteredById = req.user.userId;
            const record = await prismaService_1.default.medical_records.create({
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
            });
            await prismaService_1.default.medical_record_logs.create({
                data: {
                    medical_record_id: record.id,
                    action: 'created',
                    changed_by_id: enteredById
                }
            });
            res.status(201).json({ success: true, message: 'Medical record created', data: record });
        }
        catch (e) {
            // If forbidden by middleware, this won't hit; but catch role/logic errors
            res.status(500).json({ success: false, message: e.message || 'Failed to create record' });
        }
    },
    // GET /api/medical-records (all records)
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const [records, totalCount] = await Promise.all([
                prismaService_1.default.medical_records.findMany({
                    where: { deleted_at: null },
                    include: {
                        teachers: {
                            select: {
                                id: true,
                                teacher_name: true,
                                school_id: true
                            }
                        }
                    },
                    orderBy: { created_at: 'desc' },
                    skip,
                    take: limit
                }),
                prismaService_1.default.medical_records.count({
                    where: { deleted_at: null }
                })
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            res.json({
                success: true,
                data: records,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            });
        }
        catch (e) {
            console.error('Error fetching all medical records:', e);
            res.status(500).json({ success: false, message: e.message || 'Failed to fetch records' });
        }
    },
    // GET /api/medical-records/teachers-without-records
    async getTeachersWithoutRecords(req, res) {
        try {
            const teachersWithoutRecords = await prismaService_1.default.teachers.findMany({
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
                },
                orderBy: { teacher_name: 'asc' }
            });
            res.json({ success: true, data: teachersWithoutRecords });
        }
        catch (e) {
            console.error('Error fetching teachers without medical records:', e);
            res.status(500).json({ success: false, message: e.message || 'Failed to fetch teachers' });
        }
    },
    // GET /api/medical-records/:teacherId
    async getByTeacher(req, res) {
        if (!handleValidation(req, res))
            return;
        try {
            const teacherId = Number(req.params.teacherId);
            // For now, allow all authenticated users to view medical records
            // TODO: Implement proper permission system based on user-teacher relationship
            const records = await prismaService_1.default.medical_records.findMany({
                where: { teacher_id: teacherId, deleted_at: null },
                include: {
                    teachers: {
                        select: {
                            id: true,
                            teacher_name: true,
                            school_id: true
                        }
                    }
                },
                orderBy: { created_at: 'desc' }
            });
            res.json({ success: true, data: records });
        }
        catch (e) {
            console.error('Error fetching medical records:', e);
            res.status(500).json({ success: false, message: e.message || 'Failed to fetch records' });
        }
    },
    // PUT /api/medical-records/:id
    async update(req, res) {
        if (!handleValidation(req, res))
            return;
        try {
            const id = Number(req.params.id);
            const { ailmentName, severity, diagnosisDate, treatmentStatus, remarks, documents } = req.body;
            const changedById = req.user.userId;
            const updated = await prismaService_1.default.medical_records.update({
                where: { id },
                data: {
                    ...(ailmentName ? { ailment_name: ailmentName } : {}),
                    ...(severity ? { severity } : {}),
                    ...(diagnosisDate !== undefined ? { diagnosis_date: diagnosisDate ? new Date(diagnosisDate) : null } : {}),
                    ...(treatmentStatus !== undefined ? { treatment_status: treatmentStatus || null } : {}),
                    ...(remarks !== undefined ? { remarks } : {}),
                    ...(documents !== undefined ? { documents } : {})
                }
            });
            await prismaService_1.default.medical_record_logs.create({
                data: {
                    medical_record_id: id,
                    action: 'updated',
                    changed_by_id: changedById
                }
            });
            res.json({ success: true, message: 'Medical record updated', data: updated });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message || 'Failed to update record' });
        }
    },
    // DELETE /api/medical-records/:id
    async remove(req, res) {
        if (!handleValidation(req, res))
            return;
        try {
            const id = Number(req.params.id);
            const changedById = req.user.userId;
            const deleted = await prismaService_1.default.$transaction(async (tx) => {
                const now = new Date();
                const rec = await tx.medical_records.update({ where: { id }, data: { deleted_at: now } });
                await tx.medical_record_logs.create({
                    data: {
                        medical_record_id: id,
                        action: 'deleted',
                        changed_by_id: changedById
                    }
                });
                return rec;
            });
            res.json({ success: true, message: 'Medical record deleted', data: deleted });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message || 'Failed to delete record' });
        }
    }
};
//# sourceMappingURL=medicalRecordController.js.map