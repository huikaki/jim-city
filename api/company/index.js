const { connectDB } = require('../_lib/db');
const { Company } = require('../_lib/models');
const { verifyToken, applyCors } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (applyCors(req, res, 'GET, PUT, OPTIONS')) return;

  try {
    await connectDB();
    if (req.method === 'GET') {
      let company = await Company.findOne({});
      
      // If no company exists, create a default one
      if (!company) {
        company = new Company({
          name: 'Maid Service Agency',
          address: '123 Main Street, City, Country',
          phone: '+1-234-567-8900',
          email: 'info@maidservice.com',
          website: 'https://maidservice.com',
          description: 'Professional maid service agency providing quality domestic help.'
        });
        await company.save();
      }
      
      return res.status(200).json(company);
    }

    if (req.method === 'PUT') {
      if (!verifyToken(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const companyData = req.body;
      let company = await Company.findOne({});
      
      if (company) {
        Object.assign(company, companyData);
        await company.save();
      } else {
        company = new Company(companyData);
        await company.save();
      }
      
      return res.status(200).json(company);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Company API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};