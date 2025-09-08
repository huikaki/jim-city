const { connectDB } = require('../_lib/db');
const { Maid } = require('../_lib/models');

module.exports = async (req, res) => {
  await connectDB();

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const maids = await Maid.find({}).sort({ createdAt: -1 });
      return res.status(200).json(maids);
    }

    if (req.method === 'POST') {
      const maidData = req.body;
      const newMaid = new Maid(maidData);
      const savedMaid = await newMaid.save();
      return res.status(201).json(savedMaid);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};