const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token valid for 7 days
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, fullName, resumeText } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Email, password, and full name are required.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email already exists.' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long.' 
      });
    }

    // Create user
    const user = await User.create({ 
      email, 
      password, 
      fullName, 
      resumeText 
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required.' 
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Check password
    const isValidPassword = await User.comparePassword(
      password, 
      user.password
    );
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password.' 
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        resumeText: user.resume_text
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed. Please try again.' 
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found.' 
      });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        resumeText: user.resume_text,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get profile.' 
    });
  }
};

// Update resume
const updateResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ 
        error: 'Resume text is required.' 
      });
    }

    const user = await User.updateResume(req.user.userId, resumeText);

    res.json({
      message: 'Resume updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        resumeText: user.resume_text
      }
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ 
      error: 'Failed to update resume.' 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateResume
};