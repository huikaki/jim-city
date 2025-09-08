const { connectDB } = require('../_lib/db');
const { Maid } = require('../_lib/models');

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
    const maidData = req.body;
    
    // Set default status for new applications
    maidData.status = 'pending';
    
    const newMaid = new Maid(maidData);
    const savedMaid = await newMaid.save();
    
    return res.status(201).json({ 
      success: true, 
      message: 'Application submitted successfully',
      maid: savedMaid 
    });
  } catch (error) {
    console.error('Application Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to submit application', 
      details: error.message 
    });
  }
};