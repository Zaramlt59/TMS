"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otpAuthController_1 = require("../controllers/otpAuthController");
const router = (0, express_1.Router)();
// OTP authentication routes
router.post('/send-otp', otpAuthController_1.sendOTP);
router.post('/verify-otp', otpAuthController_1.verifyOTPLogin);
router.post('/resend-otp', otpAuthController_1.resendOTP);
exports.default = router;
//# sourceMappingURL=otpAuthRoutes.js.map