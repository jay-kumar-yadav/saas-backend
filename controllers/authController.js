const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email }).populate('tenantId');
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    
    const isPasswordValid = await user.correctPassword(password);
    
    if (!isPasswordValid) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    
    const token = generateToken(user._id);
    console.log('Login successful for:', email);
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: user.tenantId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('tenantId').select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, getMe };