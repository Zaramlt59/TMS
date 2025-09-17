import { Router } from 'express'
import { sendOTP, verifyOTPLogin, resendOTP } from '../controllers/otpAuthController'

const router = Router()

// OTP authentication routes
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTPLogin)
router.post('/resend-otp', resendOTP)

export default router
