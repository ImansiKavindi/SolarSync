const express = require('express');
const router = express.Router();
const { getEmployeeDashboardData } = require('../controllers/employeedashboard');
const authenticate = require('../middleware/authMiddleware'); // your JWT middleware

// Route: GET /api/employees/dashboard
router.get('/dashboard', authenticate, getEmployeeDashboardData);

module.exports = router;
