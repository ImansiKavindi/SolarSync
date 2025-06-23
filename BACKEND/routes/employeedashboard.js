const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authMiddleware');
const {
  getEmployeeDashboardData,
  getEmployeeProfile,
  updateEmployeeProfile,
} = require('../controllers/employeedashboard');

// Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// GET dashboard (profile + stats)
router.get('/dashboard', authenticate, getEmployeeDashboardData);

// GET employee profile
router.get('/profile', authenticate, getEmployeeProfile);

// PUT update employee profile with optional profileImage upload
router.put('/profile', authenticate, upload.single('profileImage'), updateEmployeeProfile);

module.exports = router;
