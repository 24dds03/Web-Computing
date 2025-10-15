const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists - email ya username pehle se hai kya?
    const existingEmail = await User.findByEmail(email);
    const existingUsername = await User.findByUsername(username);
    
    if (existingEmail || existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Naya user banaye
    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// User login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // User ko dhoondhe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Password check kare
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Session create kare (user ko login kare)
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// User logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out'
      });
    }
    
    // Cookie clear kare
    res.clearCookie('connect.sid');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// Check if user is logged in
router.get('/check', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking auth',
      error: error.message
    });
  }
});

module.exports = router;