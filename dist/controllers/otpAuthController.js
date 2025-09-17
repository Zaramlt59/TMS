"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = exports.verifyOTPLogin = exports.sendOTP = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpService_1 = require("../services/otpService");
const userService_1 = __importDefault(require("../services/userService"));
const prisma = new client_1.PrismaClient();
// Send OTP to teacher
const sendOTP = async (req, res) => {
    try {
        const { email, phone } = req.body;
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number is required'
            });
        }
        // Validate phone number format if provided
        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be 10 digits'
            });
        }
        // Clean up expired OTPs first
        await (0, otpService_1.cleanupExpiredOTPs)();
        // Generate OTP
        const otp = (0, otpService_1.generateOTP)();
        // Store OTP in database
        if (email) {
            await (0, otpService_1.storeOTP)(email, otp);
        }
        else if (phone) {
            await (0, otpService_1.storeOTP)(phone, otp);
        }
        // Send OTP via email
        if (email) {
            const emailSent = await (0, otpService_1.sendOTPEmail)(email, otp);
            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP via email'
                });
            }
        }
        // Send OTP via SMS
        if (phone) {
            const smsSent = await (0, otpService_1.sendOTPSMS)(phone, otp);
            if (!smsSent) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP via SMS'
                });
            }
        }
        res.json({
            success: true,
            message: 'OTP sent successfully',
            // In development, include OTP for testing
            ...(process.env.NODE_ENV === 'development' && { otp })
        });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
};
exports.sendOTP = sendOTP;
// Verify OTP and login teacher
const verifyOTPLogin = async (req, res) => {
    try {
        const { email, phone, otp } = req.body;
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: 'OTP is required'
            });
        }
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number is required'
            });
        }
        // Verify OTP
        const isValidOTP = await (0, otpService_1.verifyOTP)(email || phone, otp);
        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }
        // Find teacher by email or phone
        const teacher = await prisma.users.findFirst({
            where: {
                role: 'teacher',
                is_active: true,
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : [])
                ]
            }
        });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found or inactive'
            });
        }
        // Update last login time
        await userService_1.default.updateLastLogin(teacher.id);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: teacher.id,
            userId: teacher.id,
            username: teacher.username,
            role: teacher.role,
            email: teacher.email,
            school_id: teacher.school_id,
            district: teacher.district,
            rd_block: teacher.rd_block
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: teacher.id,
                username: teacher.username,
                email: teacher.email,
                role: teacher.role,
                is_active: teacher.is_active
            }
        });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
};
exports.verifyOTPLogin = verifyOTPLogin;
// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { email, phone } = req.body;
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Email or phone number is required'
            });
        }
        // Check if teacher exists
        const teacher = await prisma.users.findFirst({
            where: {
                role: 'teacher',
                is_active: true,
                OR: [
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : [])
                ]
            }
        });
        // Debug logging for tests
        if (process.env.NODE_ENV === 'test') {
            console.log('🔍 Resend OTP Debug:', {
                phone,
                email,
                teacherFound: !!teacher,
                teacherId: teacher?.id,
                teacherRole: teacher?.role,
                teacherActive: teacher?.is_active
            });
        }
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found or inactive'
            });
        }
        // Generate new OTP
        const otp = (0, otpService_1.generateOTP)();
        // Store OTP in database
        if (email) {
            await (0, otpService_1.storeOTP)(email, otp);
        }
        else if (phone) {
            await (0, otpService_1.storeOTP)(phone, otp);
        }
        // Send OTP via email
        if (email) {
            const emailSent = await (0, otpService_1.sendOTPEmail)(email, otp);
            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP via email'
                });
            }
        }
        // Send OTP via SMS
        if (phone) {
            const smsSent = await (0, otpService_1.sendOTPSMS)(phone, otp);
            if (!smsSent) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP via SMS'
                });
            }
        }
        res.json({
            success: true,
            message: 'OTP resent successfully',
            // In development, include OTP for testing
            ...(process.env.NODE_ENV === 'development' && { otp })
        });
    }
    catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP'
        });
    }
};
exports.resendOTP = resendOTP;
//# sourceMappingURL=otpAuthController.js.map