const { connectDB } = require('../../_lib/db');
const { Maid } = require('../../_lib/models');
const { verifyToken, applyCors } = require('../../_lib/auth');
const { parseForm } = require('../../_lib/parseForm');

module.exports = async (req, res) => {
  if (applyCors(req, res, 'GET, PUT, DELETE, OPTIONS')) return;

  const { id } = req.query;

  try {
    await connectDB();

    if (req.method === 'GET') {
      const maid = await Maid.findById(id);
      if (!maid) return res.status(404).json({ error: 'Maid not found' });
      return res.status(200).json(maid);
    }

    if (req.method === 'PUT') {
      if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });

      const updateData = await parseForm(req);
      // Don't overwrite the photo with null when no new file was sent
      if (!updateData.profilePhoto) delete updateData.profilePhoto;

      const maid = await Maid.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!maid) return res.status(404).json({ error: 'Maid not found' });
      return res.status(200).json(maid);
    }

    if (req.method === 'DELETE') {
      if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' });

      const maid = await Maid.findByIdAndDelete(id);
      if (!maid) return res.status(404).json({ error: 'Maid not found' });
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('maid [id] API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
