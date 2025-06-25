const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');
const { authorizeEmployee } = require('../middleware/roleMiddleware');

const multer = require('multer');
const path = require('path');

// Multer setup for file uploads (cv & profile image)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Get dashboard info (employee profile + stats)
router.get('/me', authenticate, authorizeEmployee, dashboardController.getDashboardInfo);

// ✅ Update profile (username, password, profile image, CV, and other fields)
router.patch(
  '/update',
  authenticate,
  authorizeEmployee,
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  dashboardController.updateProfile
);

// ✅ Mark attendance (only once per day)
router.post('/attendance', authenticate, authorizeEmployee, dashboardController.markAttendance);

// ✅ Get all attendance records
router.get('/attendance', authenticate, authorizeEmployee, dashboardController.getAttendance);

// Get stats for charts
router.get('/stats', authenticate, authorizeEmployee, dashboardController.getStatsForCharts);

router.post('/solar-calc', authenticate, authorizeEmployee, dashboardController.calculateSolarEstimate);


module.exports = router;
