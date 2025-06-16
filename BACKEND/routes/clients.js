const express = require('express');
const router = express.Router();


const clientController = require('../controllers/clientController');

const authenticate = require('../middleware/authMiddleware');
const { authorizeAdmin, authorizeEmployee  } = require('../middleware/roleMiddleware');

// Add new client (employee)
router.post('/', authenticate, authorizeEmployee, clientController.addClient);

// Get all clients of this employee
router.get('/my-projects', authenticate, authorizeEmployee, clientController.getMyClients);

// Admin updates status
router.patch('/:id/status', authenticate, authorizeAdmin, clientController.updateProjectStatus);

// ✅ New route: Get all clients (Admin only)
router.get('/', authenticate, authorizeAdmin, clientController.getAllClients);

// Update client info (admin and employee)
router.put('/:id', authenticate, clientController.updateClientInfo);


module.exports = router;
