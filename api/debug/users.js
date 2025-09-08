const { connectDB } = require('../_lib/db');
const { User } = require('../_lib/models');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    
    if (req.method === 'POST') {
      // Test login credentials
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      return res.status(200).json({
        message: 'Login test',
        input: { username, password },
        userFound: !!user,
        storedPassword: user ? user.password : 'N/A',
        passwordMatch: user ? user.password === password : false,
        userDetails: user ? { username: user.username, role: user.role } : null
      });
    }
    
    // Get all users
    const users = await User.find({});
    
    // If no users, create default admin
    if (users.length === 0) {
      const defaultUser = new User({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      await defaultUser.save();
      
      return res.status(200).json({
        message: 'Created default admin user',
        users: [{ username: defaultUser.username, role: defaultUser.role, password: defaultUser.password }],
        totalUsers: 1
      });
    }
    
    return res.status(200).json({
      message: 'Users found',
      users: users.map(u => ({ username: u.username, role: u.role, password: u.password })),
      totalUsers: users.length
    });
    
  } catch (error) {
    console.error('Debug Error:', error);
    return res.status(500).json({ 
      error: 'Database error', 
      details: error.message,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    });
  }
};