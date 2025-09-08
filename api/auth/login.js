const { connectDB } = require('../_lib/db');
const { User } = require('../_lib/models');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  await connectDB();

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ username });
    
    // If no users exist, create default admin
    if (!user) {
      const defaultUser = new User({
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        role: 'admin'
      });
      await defaultUser.save();
      
      if (username === 'admin' && password === 'admin123') {
        user = defaultUser;
      }
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};