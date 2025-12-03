const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { fullName, phone, email, password, confirmPassword } = req.body;
  console.log('Register req.body:', req.body);

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name: fullName, phone, email, password: hashedPassword });
    await user.save();

    res.json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        _id: user._id,
        fullName: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here_2024', {
      expiresIn: '1d',
    });

    res.json({ 
      success: true, 
      message: 'Login successful', 
      token,
      user: {
        _id: user._id,
        fullName: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
