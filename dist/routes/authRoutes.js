"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Authentication routes
router.post('/login', authController_1.authLogin);
router.post('/refresh', authController_1.authRefresh);
router.post('/logout', authController_1.authLogout);
router.post('/request-password-reset', authController_1.requestPasswordReset);
router.post('/reset-password', authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map