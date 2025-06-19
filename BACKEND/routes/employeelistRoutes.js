// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/roleMiddleware');
const { addEmployee, viewEmployee, editEmployee, deleteEmployee ,getAllEmployees } = require('../controllers/employeelistController');

const multer = require('multer');
const path = require('path');

// Multer setup: save files in 'uploads/' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', authenticate, authorizeAdmin, getAllEmployees);
router.post(
  '/add',
  authenticate,
  authorizeAdmin,
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  addEmployee
);
router.get('/:id', authenticate, authorizeAdmin, viewEmployee);
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  editEmployee
);
router.delete('/:id', authenticate, authorizeAdmin, deleteEmployee);

module.exports = router;