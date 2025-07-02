const express = require('express');
const router = express.Router();

const leaveController = require('../controllers/leaveController');
const authenticate = require('../middleware/authMiddleware');
const { authorizeAdmin, authorizeEmployee } = require('../middleware/roleMiddleware');

// EMPLOYEE
router.post('/submit', authenticate, authorizeEmployee, leaveController.submitLeave);
router.get('/my', authenticate, authorizeEmployee, leaveController.getMyLeaves);

// ADMIN
router.get('/all', authenticate, authorizeAdmin, leaveController.getAllLeaves);
router.patch('/:id/status', authenticate, authorizeAdmin, leaveController.updateLeaveStatus);

module.exports = router;
