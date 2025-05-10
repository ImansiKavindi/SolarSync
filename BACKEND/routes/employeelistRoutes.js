// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/roleMiddleware');
const { addEmployee, viewEmployee, editEmployee, deleteEmployee } = require('../controllers/employeelistController');

// Admin-only Routes
router.post('/add', authenticate, authorizeAdmin, addEmployee); // Add new employee
router.get('/:id', authenticate, authorizeAdmin, viewEmployee); // View employee profile
router.put('/:id', authenticate, authorizeAdmin, editEmployee); // Edit employee profile
router.delete('/:id', authenticate, authorizeAdmin, deleteEmployee); // Delete employee profile

module.exports = router;
