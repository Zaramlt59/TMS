"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.authLogout = exports.authRefresh = exports.authLogin = void 0;
const authService_1 = require("../services/authService");
const userService_1 = __importDefault(require("../services/userService"));
const jwt_1 = require("../utils/jwt");
const crypto_1 = require("crypto");
const loginLockout_1 = require("../utils/loginLockout");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auditService_1 = require("../services/auditService");
const ipExtractor_1 = require("../utils/ipExtractor");
const REFRESH_COOKIE_NAME = 'rt';
const CSRF_COOKIE_NAME = 'csrf';
const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TTL_DAYS || 7);
function setRefreshCookie(res, token, expiresAt) {
    const crossSite = process.env.CROSS_SITE_COOKIES === 'true';
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        // In production, cookies should be Secure. For cross-site flows, SameSite must be 'none'.
        secure: process.env.NODE_ENV !== 'development',
        sameSite: crossSite ? 'none' : 'lax',
        expires: expiresAt,
        path: '/'
    });
}
function setCsrfCookie(res) {
    const csrf = (0, crypto_1.randomUUID)();
    res.cookie(CSRF_COOKIE_NAME, csrf, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return csrf;
}
const authLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        // Get real client IP
        const clientIP = (0, ipExtractor_1.getClientIP)(req);
        // Clear any existing failures for tests
        if (process.env.NODE_ENV === 'test') {
            (0, loginLockout_1.clearFailures)(username, clientIP);
        }
        // Check if account is locked (skip for tests)
        if (process.env.NODE_ENV !== 'test') {
            const lock = (0, loginLockout_1.isLocked)(username, clientIP);
            if (lock.locked) {
                // Log failed login attempt due to lockout
                await auditService_1.AuditService.logAuth(0, // Use 0 for failed auth attempts
                'login_failed', clientIP, req.headers['user-agent'], false, `Account locked for ${Math.ceil(lock.msRemaining / 1000)}s`);
                return res.status(429).json({ success: false, message: `Account temporarily locked. Try again in ${Math.ceil(lock.msRemaining / 1000)}s` });
            }
        }
        const user = await userService_1.default.authenticateUser({ username, password });
        if (!user) {
            // Only register failures in non-test environments
            const state = process.env.NODE_ENV !== 'test' ? (0, loginLockout_1.registerFailure)(username, clientIP) : { locked: false, msRemaining: 0 };
            const msg = state.locked ? `Too many attempts. Locked for ${Math.ceil(state.msRemaining / 1000)}s` : 'Invalid username or password';
            // Log failed login attempt
            await auditService_1.AuditService.logAuth(0, // Use 0 for failed auth attempts
            'login_failed', clientIP, req.headers['user-agent'], false, msg);
            return res.status(401).json({ success: false, message: msg });
        }
        (0, loginLockout_1.clearFailures)(username, clientIP);
        const accessToken = jwt_1.JWTUtil.generateToken({
            userId: user.id,
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            school_id: user.school_id,
            district: user.district,
            rd_block: user.rd_block
        });
        const { token: refreshToken, expiresAt } = await authService_1.authService.issueRefreshToken({
            userId: user.id,
            ttlDays: REFRESH_TTL_DAYS,
            deviceId: req.body.deviceId,
            ip: clientIP,
            userAgent: req.headers['user-agent']
        });
        setRefreshCookie(res, refreshToken, expiresAt);
        const csrf = setCsrfCookie(res);
        // Update last login time
        await userService_1.default.updateLastLogin(user.id);
        // Log successful login
        await auditService_1.AuditService.logAuth(user.id, 'login', clientIP, req.headers['user-agent'], true);
        res.json({ success: true, message: 'Login successful', data: { user, token: accessToken, csrf } });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message || 'Login failed' });
    }
};
exports.authLogin = authLogin;
const authRefresh = async (req, res) => {
    try {
        // Get real client IP
        const clientIP = (0, ipExtractor_1.getClientIP)(req);
        // CSRF validation
        const csrfHeader = req.headers['x-csrf-token'] || '';
        const csrfCookie = req.cookies?.[CSRF_COOKIE_NAME];
        if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
            return res.status(403).json({ success: false, message: 'CSRF validation failed' });
        }
        const oldToken = req.cookies?.[REFRESH_COOKIE_NAME];
        if (!oldToken)
            return res.status(401).json({ success: false, message: 'Refresh token missing' });
        const rotated = await authService_1.authService.rotateRefreshToken(oldToken, {
            ttlDays: REFRESH_TTL_DAYS,
            deviceId: req.body?.deviceId,
            ip: clientIP,
            userAgent: req.headers['user-agent']
        });
        if (!rotated)
            return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        const user = await userService_1.default.getUserById(rotated.userId);
        if (!user)
            return res.status(401).json({ success: false, message: 'User not found' });
        const accessToken = jwt_1.JWTUtil.generateToken({
            userId: user.id,
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            school_id: user.school_id,
            district: user.district,
            rd_block: user.rd_block
        });
        setRefreshCookie(res, rotated.token, rotated.expiresAt);
        const csrf = setCsrfCookie(res);
        res.json({ success: true, message: 'Token refreshed', data: { token: accessToken, csrf } });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message || 'Refresh failed' });
    }
};
exports.authRefresh = authRefresh;
const authLogout = async (req, res) => {
    try {
        // Get real client IP
        const clientIP = (0, ipExtractor_1.getClientIP)(req);
        const token = req.cookies?.[REFRESH_COOKIE_NAME];
        if (token)
            await authService_1.authService.revokeToken(token);
        res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
        res.clearCookie(CSRF_COOKIE_NAME, { path: '/' });
        // Log logout if user is authenticated
        if (req.user?.id) {
            await auditService_1.AuditService.logAuth(req.user.id, 'logout', clientIP, req.headers['user-agent'], true);
        }
        res.json({ success: true, message: 'Logged out' });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message || 'Logout failed' });
    }
};
exports.authLogout = authLogout;
// Password reset - request token (in production, email this token)
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email)
            return res.status(400).json({ success: false, message: 'Email is required' });
        // Find user by email
        const users = await userService_1.default.getAllUsers();
        const user = users.find(u => u.email?.toLowerCase() === String(email).toLowerCase());
        if (!user) {
            // Do not reveal user existence
            return res.json({ success: true, message: 'If account exists, a reset link has been issued' });
        }
        const secret = process.env.JWT_SECRET || 'change-me';
        const token = jsonwebtoken_1.default.sign({ userId: user.id, purpose: 'pwd_reset' }, secret, { expiresIn: '15m' });
        // In real deployment: send via email. For now, return for testing.
        res.json({ success: true, message: 'Password reset token issued', data: { token } });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message || 'Failed to issue reset token' });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// Password reset - consume token and set new password
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body || {};
        if (!token || !password)
            return res.status(400).json({ success: false, message: 'Token and password are required' });
        const secret = process.env.JWT_SECRET || 'change-me';
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (!payload || payload.purpose !== 'pwd_reset' || !payload.userId) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }
        // Update password and revoke all refresh tokens
        const updated = await userService_1.default.updateUser(Number(payload.userId), { password });
        if (!updated)
            return res.status(404).json({ success: false, message: 'User not found' });
        await authService_1.authService.revokeAllForUser(Number(payload.userId));
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (e) {
        res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map