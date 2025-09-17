import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { generateOTP, storeOTP, verifyOTP, sendOTPEmail, sendOTPSMS, cleanupExpiredOTPs } from '../services/otpService'
import userService from '../services/userService'
import { getClientIP } from '../utils/ipExtractor'

const prisma = new PrismaClient()

// Send OTP to teacher
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      })
    }

    // Validate phone number format if provided
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10 digits'
      })
    }

    // Clean up expired OTPs first
    await cleanupExpiredOTPs()

    // Generate OTP
    const otp = generateOTP()

    // Store OTP in database
    if (email) {
      await storeOTP(email, otp)
    } else if (phone) {
      await storeOTP(phone, otp)
    }

    // Send OTP via email
    if (email) {
      const emailSent = await sendOTPEmail(email, otp)
      if (!emailSent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP via email'
        })
      }
    }

    // Send OTP via SMS
    if (phone) {
      const smsSent = await sendOTPSMS(phone, otp)
      if (!smsSent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP via SMS'
        })
      }
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    })

  } catch (error: any) {
    console.error('Error sending OTP:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    })
  }
}

// Verify OTP and login teacher
export const verifyOTPLogin = async (req: Request, res: Response) => {
  try {
    const { email, phone, otp } = req.body

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required'
      })
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      })
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(email || phone, otp)
    
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      })
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
    })

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found or inactive'
      })
    }

    // Update last login time
    await userService.updateLastLogin(teacher.id)

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: teacher.id, 
        userId: teacher.id,
        username: teacher.username, 
        role: teacher.role,
        email: teacher.email,
        school_id: teacher.school_id,
        district: teacher.district,
        rd_block: teacher.rd_block
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

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
    })

  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    })
  }
}

// Resend OTP
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number is required'
      })
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
    })

    // Debug logging for tests
    if (process.env.NODE_ENV === 'test') {
      console.log('🔍 Resend OTP Debug:', {
        phone,
        email,
        teacherFound: !!teacher,
        teacherId: teacher?.id,
        teacherRole: teacher?.role,
        teacherActive: teacher?.is_active
      })
    }

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found or inactive'
      })
    }

    // Generate new OTP
    const otp = generateOTP()

    // Store OTP in database
    if (email) {
      await storeOTP(email, otp)
    } else if (phone) {
      await storeOTP(phone, otp)
    }

    // Send OTP via email
    if (email) {
      const emailSent = await sendOTPEmail(email, otp)
      if (!emailSent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP via email'
        })
      }
    }

    // Send OTP via SMS
    if (phone) {
      const smsSent = await sendOTPSMS(phone, otp)
      if (!smsSent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP via SMS'
        })
      }
    }

    res.json({
      success: true,
      message: 'OTP resent successfully',
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    })

  } catch (error: any) {
    console.error('Error resending OTP:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    })
  }
}
