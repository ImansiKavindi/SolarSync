const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admins');
const Employee = require('../models/Employee');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Log the incoming login attempt
    console.log('Login Attempt:', { username, password });

    // Check Admin collection
    let user = await Admin.findOne({ username: username });
    console.log('Found Admin:', user);

    let role = 'admin';
    if (!user) {
      // Check Employee collection if no admin found
      user = await Employee.findOne({ username: username });
      role = 'employee';
      console.log('Found Employee:', user);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      token,
      role,
      user: { id: user._id, username: user.username }
    });

  } catch (err) {
    console.error('Error in login function:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { login };
