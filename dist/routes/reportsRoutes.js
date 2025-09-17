"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportsController_1 = require("../controllers/reportsController");
const auth_1 = require("../middleware/auth");
const roleBasedFiltering_1 = require("../middleware/roleBasedFiltering");
const router = express_1.default.Router();
// All routes require authentication and role-based filtering
router.use(auth_1.authenticateToken);
router.use(roleBasedFiltering_1.addRoleBasedFilters);
// Get role-specific dashboard statistics
router.get('/dashboard-stats', reportsController_1.reportsController.getDashboardStats);
// Export data based on user role
router.get('/export', reportsController_1.reportsController.exportData);
// Get teacher performance analytics
router.get('/teacher/:teacherId', reportsController_1.reportsController.getTeacherAnalytics);
// Get school performance analytics
router.get('/school/:schoolId', reportsController_1.reportsController.getSchoolAnalytics);
// Get district performance analytics
router.get('/district/:district', reportsController_1.reportsController.getDistrictAnalytics);
exports.default = router;
//# sourceMappingURL=reportsRoutes.js.map