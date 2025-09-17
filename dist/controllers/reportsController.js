"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsController = void 0;
const reportsService_1 = require("../services/reportsService");
const XLSX = __importStar(require("xlsx"));
exports.reportsController = {
    // Get role-specific dashboard statistics
    async getDashboardStats(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const result = await reportsService_1.reportsService.getDashboardStats(req.user.role, req.roleFilters);
            if (result.success) {
                res.json(result);
            }
            else {
                res.status(400).json(result);
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard statistics',
                error: error.message
            });
        }
    },
    // Export data based on user role
    async exportData(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const format = req.query.format || 'excel';
            const result = await reportsService_1.reportsService.exportData(req.user.role, req.roleFilters, format);
            if (!result.success) {
                return res.status(400).json(result);
            }
            // Generate Excel file
            if (format === 'excel') {
                const workbook = XLSX.utils.book_new();
                if (Array.isArray(result.data)) {
                    // Single sheet for array data
                    const worksheet = XLSX.utils.json_to_sheet(result.data);
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
                }
                else if (typeof result.data === 'object') {
                    // Multiple sheets for object data
                    Object.keys(result.data).forEach((key, index) => {
                        const sheetData = Array.isArray(result.data[key]) ? result.data[key] : [result.data[key]];
                        const worksheet = XLSX.utils.json_to_sheet(sheetData);
                        XLSX.utils.book_append_sheet(workbook, worksheet, key);
                    });
                }
                const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
                res.send(buffer);
            }
            else {
                // CSV format
                let csvContent = '';
                if (Array.isArray(result.data)) {
                    if (result.data.length > 0) {
                        const headers = Object.keys(result.data[0]);
                        csvContent += headers.join(',') + '\n';
                        result.data.forEach(row => {
                            csvContent += headers.map(header => `"${row[header] || ''}"`).join(',') + '\n';
                        });
                    }
                }
                else if (typeof result.data === 'object') {
                    // Handle object data for CSV
                    const firstKey = Object.keys(result.data)[0];
                    if (firstKey && Array.isArray(result.data[firstKey])) {
                        const headers = Object.keys(result.data[firstKey][0] || {});
                        csvContent += headers.join(',') + '\n';
                        result.data[firstKey].forEach((row) => {
                            csvContent += headers.map(header => `"${row[header] || ''}"`).join(',') + '\n';
                        });
                    }
                }
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
                res.send(csvContent);
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to export data',
                error: error.message
            });
        }
    },
    // Get teacher performance analytics
    async getTeacherAnalytics(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const { teacherId } = req.params;
            if (!teacherId) {
                return res.status(400).json({
                    success: false,
                    message: 'Teacher ID is required'
                });
            }
            // Get teacher details and related data
            const teacher = await reportsService_1.reportsService.getTeacherDetails(parseInt(teacherId));
            if (!teacher.success) {
                return res.status(404).json(teacher);
            }
            res.json(teacher);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch teacher analytics',
                error: error.message
            });
        }
    },
    // Get school performance analytics
    async getSchoolAnalytics(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const { schoolId } = req.params;
            if (!schoolId) {
                return res.status(400).json({
                    success: false,
                    message: 'School ID is required'
                });
            }
            // Get school details and related data
            const school = await reportsService_1.reportsService.getSchoolDetails(schoolId);
            if (!school.success) {
                return res.status(404).json(school);
            }
            res.json(school);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch school analytics',
                error: error.message
            });
        }
    },
    // Get district performance analytics
    async getDistrictAnalytics(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }
            const { district } = req.params;
            if (!district) {
                return res.status(400).json({
                    success: false,
                    message: 'District name is required'
                });
            }
            // Get district details and related data
            const districtData = await reportsService_1.reportsService.getDistrictDetails(district);
            if (!districtData.success) {
                return res.status(404).json(districtData);
            }
            res.json(districtData);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch district analytics',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=reportsController.js.map