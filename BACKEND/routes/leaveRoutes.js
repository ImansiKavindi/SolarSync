const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');

// Employee sends leave request
router.post('/', async (req, res) => {
  const newLeave = new LeaveRequest(req.body);
  await newLeave.save();
  res.status(201).send(newLeave);
});

// Admin gets all leave requests
router.get('/', async (req, res) => {
  const leaves = await LeaveRequest.find();
  res.send(leaves);
});

// Employee sees only their leaves
router.get('/:employeeId', async (req, res) => {
  const leaves = await LeaveRequest.find({ employeeId: req.params.employeeId });
  res.send(leaves);
});

// Admin updates status
router.patch('/:id', async (req, res) => {
  const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.send(leave);
});

module.exports = router;
