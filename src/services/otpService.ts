import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// OTP configuration
const OTP_EXPIRY_MINUTES = 5
const OTP_LENGTH = 6

// Generate OTP
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString()
}

// Store OTP in database
export const storeOTP = async (identifier: string, otp: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)
  
  // Determine if identifier is email or phone
  const isEmail = identifier.includes('@')
  
  await prisma.otp_verification.upsert({
    where: isEmail ? { email: identifier } : { phone: identifier },
    update: {
      otp,
      expires_at: expiresAt,
      created_at: new Date()
    },
    create: {
      ...(isEmail ? { email: identifier } : { phone: identifier }),
      otp,
      expires_at: expiresAt,
      created_at: new Date()
    }
  })
}

// Verify OTP
export const verifyOTP = async (identifier: string, otp: string): Promise<boolean> => {
  // Determine if identifier is email or phone
  const isEmail = identifier.includes('@')
  
  const otpRecord = await prisma.otp_verification.findUnique({
    where: isEmail ? { email: identifier } : { phone: identifier }
  })

  if (!otpRecord) {
    return false
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.expires_at) {
    // Clean up expired OTP
    await prisma.otp_verification.delete({
      where: isEmail ? { email: identifier } : { phone: identifier }
    })
    return false
  }

  // Check if OTP matches
  if (otpRecord.otp !== otp) {
    return false
  }

  // OTP is valid, clean it up
  await prisma.otp_verification.delete({
    where: isEmail ? { email: identifier } : { phone: identifier }
  })

  return true
}

// Clean up expired OTPs
export const cleanupExpiredOTPs = async (): Promise<void> => {
  await prisma.otp_verification.deleteMany({
    where: {
      expires_at: {
        lt: new Date()
      }
    }
  })
}

// Send OTP via email (mock implementation - replace with actual email service)
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    // TODO: Replace with actual email service (SendGrid, AWS SES, etc.)
    console.log(`📧 OTP Email to ${email}: Your OTP is ${otp} (Valid for ${OTP_EXPIRY_MINUTES} minutes)`)
    
    // For now, we'll just log it to console
    // In production, integrate with email service
    return true
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return false
  }
}

// Send OTP via SMS (mock implementation - replace with actual SMS service)
export const sendOTPSMS = async (phone: string, otp: string): Promise<boolean> => {
  try {
    // TODO: Replace with actual SMS service (Twilio, AWS SNS, etc.)
    console.log(`📱 OTP SMS to ${phone}: Your OTP is ${otp} (Valid for ${OTP_EXPIRY_MINUTES} minutes)`)
    
    // For now, we'll just log it to console
    // In production, integrate with SMS service
    return true
  } catch (error) {
    console.error('Error sending OTP SMS:', error)
    return false
  }
}
