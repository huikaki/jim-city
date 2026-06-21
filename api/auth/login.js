const { connectDB } = require('../_lib/db');
const { User } = require('../_lib/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

    // Bootstrap a default admin the first time if none exists
    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const defaultUser = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      await defaultUser.save();

      if (username === 'admin' && password === 'admin123') {
        user = defaultUser;
      }
    }

    // Compare password using bcrypt
    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
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