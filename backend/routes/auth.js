const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updatePreferences 
} = require('../controllers/authController');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', getProfile);

// @route   PUT /api/auth/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', updatePreferences);

module.exports = router;
