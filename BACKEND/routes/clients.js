const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');
const authenticate = require('../middleware/authMiddleware');
const { authorizeAdmin, authorizeEmployee } = require('../middleware/roleMiddleware');

// 🔐 Middleware: All routes require authentication
// Role-specific routes use admin or employee authorization

// ✅ Add a new client (accessible by both admin and employee)
router.post('/', authenticate, clientController.addClient);

// ✅ Get clients for the logged-in employee (employee only)
router.get('/my-projects', authenticate, authorizeEmployee, clientController.getMyClients);

// ✅ Get all clients (admin only)
router.get('/', authenticate, authorizeAdmin, clientController.getAllClients);

// ✅ Update client info (admin can update any; employee only their own — checked in controller)
router.put('/:id', authenticate, clientController.updateClientInfo);

// ✅ Update project status (admin only)
router.patch('/:id/status', authenticate, authorizeAdmin, clientController.updateProjectStatus);

module.exports = router;
