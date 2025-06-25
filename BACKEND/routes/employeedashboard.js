const express = require('express');
const router = express.Router();

const employeedashboard  = require('../controllers/employeedashboard');
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
router.get('/me', authenticate, authorizeEmployee, employeedashboard.getDashboardInfo);

// ✅ Update profile (username, password, profile image, CV, and other fields)
router.patch(
  '/update',
  authenticate,
  authorizeEmployee,
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  employeedashboard.updateProfile
);

// ✅ Mark attendance (only once per day)
//router.post('/attendance', authenticate, authorizeEmployee, employeedashboard.markAttendance);

router.post('/attendance/arrival', authenticate, authorizeEmployee, employeedashboard.markArrival);
router.post('/attendance/leave', authenticate, authorizeEmployee, employeedashboard.markLeave);



// ✅ Get all attendance records
router.get('/attendance', authenticate, authorizeEmployee, employeedashboard.getAttendance);

// Get stats for charts
router.get('/stats', authenticate, authorizeEmployee, employeedashboard.getStatsForCharts);

router.post('/solar-calc', authenticate, authorizeEmployee, employeedashboard.calculateSolarEstimate);

// GET: Chart stats for employee
router.get('/charts', authenticate, employeedashboard.getStatsForCharts);

module.exports = router;
