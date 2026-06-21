const { connectDB } = require('../_lib/db');
const { Maid } = require('../_lib/models');
const { verifyToken, applyCors } = require('../_lib/auth');
const { parseForm } = require('../_lib/parseForm');

module.exports = async (req, res) => {
  if (applyCors(req, res, 'GET, POST, OPTIONS')) return;

  try {
    await connectDB();

    if (req.method === 'GET') {
      const { skills, status, nationality, gender, minExperience, maxExperience } = req.query || {};
      const query = {};

      if (skills) query['skills.skill'] = { $in: String(skills).split(',') };
      if (status) query.status = status;
      if (nationality) query.nationality = nationality;
      if (gender) query.gender = gender;
      if (minExperience) query.workExperience = { ...query.workExperience, $gte: parseInt(minExperience, 10) };
      if (maxExperience) query.workExperience = { ...query.workExperience, $lte: parseInt(maxExperience, 10) };

      const maids = await Maid.find(query).sort({ createdAt: -1 });
      return res.status(200).json(maids);
    }

    if (req.method === 'POST') {
      // Admin-only create
      if (!verifyToken(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const maidData = await parseForm(req);
      const maid = new Maid(maidData);
      await maid.save();
      return res.status(201).json(maid);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('maids API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
