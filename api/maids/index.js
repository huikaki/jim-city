const { connectDB } = require('../_lib/db');
const { Maid } = require('../_lib/models');
const { verifyToken, applyCors } = require('../_lib/auth');
const { parseForm } = require('../_lib/parseForm');
const { sanitizeMaid } = require('../_lib/sanitize');

module.exports = async (req, res) => {
  if (applyCors(req, res, 'GET, POST, OPTIONS')) return;

  try {
    await connectDB();

    if (req.method === 'GET') {
      const isAdmin = !!verifyToken(req);
      const { skills, status, nationality, gender, minExperience, maxExperience } = req.query || {};
      const query = {};

      if (skills) query['skills.skill'] = { $in: String(skills).split(',') };
      if (nationality) query.nationality = nationality;
      if (gender) query.gender = gender;
      if (minExperience) query.workExperience = { ...query.workExperience, $gte: parseInt(minExperience, 10) };
      if (maxExperience) query.workExperience = { ...query.workExperience, $lte: parseInt(maxExperience, 10) };

      // Public callers only ever see available maids; admins can filter by any status.
      if (isAdmin) {
        if (status) query.status = status;
      } else {
        query.status = 'available';
      }

      const maids = await Maid.find(query).sort({ createdAt: -1 });
      return res.status(200).json(isAdmin ? maids : maids.map(sanitizeMaid));
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
