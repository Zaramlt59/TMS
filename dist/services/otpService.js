"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPSMS = exports.sendOTPEmail = exports.cleanupExpiredOTPs = exports.verifyOTP = exports.storeOTP = exports.generateOTP = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
// OTP configuration
const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;
// Generate OTP
const generateOTP = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
exports.generateOTP = generateOTP;
// Store OTP in database
const storeOTP = async (identifier, otp) => {
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    if (isEmail) {
        await prisma.otp_verification.upsert({
            where: { email: identifier },
            update: {
                otp,
                expires_at: expiresAt,
                created_at: new Date()
            },
            create: {
                email: identifier,
                phone: null,
                otp,
                expires_at: expiresAt,
                created_at: new Date()
            }
        });
    }
    else {
        await prisma.otp_verification.upsert({
            where: { phone: identifier },
            update: {
                otp,
                expires_at: expiresAt,
                created_at: new Date()
            },
            create: {
                email: null,
                phone: identifier,
                otp,
                expires_at: expiresAt,
                created_at: new Date()
            }
        });
    }
};
exports.storeOTP = storeOTP;
// Verify OTP
const verifyOTP = async (identifier, otp) => {
    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    let otpRecord;
    if (isEmail) {
        otpRecord = await prisma.otp_verification.findUnique({
            where: { email: identifier }
        });
    }
    else {
        otpRecord = await prisma.otp_verification.findUnique({
            where: { phone: identifier }
        });
    }
    if (!otpRecord) {
        return false;
    }
    // Check if OTP is expired
    if (new Date() > otpRecord.expires_at) {
        // Clean up expired OTP
        if (isEmail) {
            await prisma.otp_verification.delete({
                where: { email: identifier }
            });
        }
        else {
            await prisma.otp_verification.delete({
                where: { phone: identifier }
            });
        }
        return false;
    }
    // Check if OTP matches
    if (otpRecord.otp !== otp) {
        return false;
    }
    // OTP is valid, clean it up
    if (isEmail) {
        await prisma.otp_verification.delete({
            where: { email: identifier }
        });
    }
    else {
        await prisma.otp_verification.delete({
            where: { phone: identifier }
        });
    }
    return true;
};
exports.verifyOTP = verifyOTP;
// Clean up expired OTPs
const cleanupExpiredOTPs = async () => {
    await prisma.otp_verification.deleteMany({
        where: {
            expires_at: {
                lt: new Date()
            }
        }
    });
};
exports.cleanupExpiredOTPs = cleanupExpiredOTPs;
// Send OTP via email (mock implementation - replace with actual email service)
const sendOTPEmail = async (email, otp) => {
    try {
        // TODO: Replace with actual email service (SendGrid, AWS SES, etc.)
        console.log(`📧 OTP Email to ${email}: Your OTP is ${otp} (Valid for ${OTP_EXPIRY_MINUTES} minutes)`);
        // For now, we'll just log it to console
        // In production, integrate with email service
        return true;
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};
exports.sendOTPEmail = sendOTPEmail;
// Send OTP via SMS (mock implementation - replace with actual SMS service)
const sendOTPSMS = async (phone, otp) => {
    try {
        // TODO: Replace with actual SMS service (Twilio, AWS SNS, etc.)
        console.log(`📱 OTP SMS to ${phone}: Your OTP is ${otp} (Valid for ${OTP_EXPIRY_MINUTES} minutes)`);
        // For now, we'll just log it to console
        // In production, integrate with SMS service
        return true;
    }
    catch (error) {
        console.error('Error sending OTP SMS:', error);
        return false;
    }
};
exports.sendOTPSMS = sendOTPSMS;
//# sourceMappingURL=otpService.js.map