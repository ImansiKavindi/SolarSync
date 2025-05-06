const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

const authenticate = require('../middleware/authMiddleware'); // ✅ CORRECT

const { authorizeAdmin, authorizeEmployee } = require('../middleware/roleMiddleware');

// Login route (public)
router.post('/login', (req, res, next) => {
  console.log('📦 Login Request Body:', req.body);
  next();
}, login);

// Admin routes (protected, only accessible by admin)
router.get('/admin-dashboard', authenticate, authorizeAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard' });
});

// Employee routes (protected, only accessible by employee)
router.get('/employee-dashboard', authenticate, authorizeEmployee, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Employee Dashboard' });
});

module.exports = router;
