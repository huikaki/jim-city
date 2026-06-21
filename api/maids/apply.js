const { connectDB } = require('../_lib/db');
const { Maid } = require('../_lib/models');
const { applyCors } = require('../_lib/auth');
const { parseForm } = require('../_lib/parseForm');

module.exports = async (req, res) => {
  if (applyCors(req, res, 'POST, OPTIONS')) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const maidData = await parseForm(req);
    maidData.status = 'pending'; // public applications are always pending

    const maid = new Maid(maidData);
    await maid.save();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      maidId: maid.maidId,
      status: maid.status
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
