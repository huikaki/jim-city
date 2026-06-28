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

    const MAX_ATTEMPTS = 5;
    const LOCK_MINUTES = 15;

    const user = await User.findOne({ username });

    // Account lockout after too many failed attempts (brute-force protection)
    if (user && user.lockUntil && user.lockUntil > new Date()) {
      return res.status(429).json({ error: 'Account temporarily locked. Try again later.' });
    }

    // Compare password using bcrypt (always run a comparison to avoid
    // user-enumeration via timing differences)
    const hash = user ? user.password : '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva';
    const isPasswordValid = await bcrypt.compare(password || '', hash);

    if (!user || !isPasswordValid) {
      if (user) {
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        if (user.failedAttempts >= MAX_ATTEMPTS) {
          user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
          user.failedAttempts = 0;
        }
        await user.save();
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login — clear any failure counters
    if (user.failedAttempts || user.lockUntil) {
      user.failedAttempts = 0;
      user.lockUntil = null;
      await user.save();
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