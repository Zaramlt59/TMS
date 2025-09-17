import express from 'express'
import { authLogin, authRefresh, authLogout, requestPasswordReset, resetPassword } from '../controllers/authController'

const router = express.Router()

// Authentication routes
router.post('/login', authLogin)
router.post('/refresh', authRefresh)
router.post('/logout', authLogout)
router.post('/request-password-reset', requestPasswordReset)
router.post('/reset-password', resetPassword)

export default router
