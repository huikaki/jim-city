const PDFDocument = require('pdfkit');
const { connectDB } = require('../../_lib/db');
const { Maid } = require('../../_lib/models');
const { applyCors } = require('../../_lib/auth');

// Decode a base64 data URI (data:image/...;base64,xxxx) into a Buffer.
function dataUriToBuffer(uri) {
  if (typeof uri !== 'string') return null;
  const match = uri.match(/^data:.*?;base64,(.*)$/);
  if (!match) return null;
  try { return Buffer.from(match[1], 'base64'); } catch { return null; }
}

module.exports = async (req, res) => {
  if (applyCors(req, res, 'GET, OPTIONS')) return;

  const { id } = req.query;

  try {
    await connectDB();

    const maid = await Maid.findById(id);
    if (!maid) return res.status(404).json({ error: 'Maid not found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(maid.name || 'maid').replace(/\s+/g, '_')}_profile.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(24).fillColor('#2c3e50').text('MAID PROFILE', 50, 50, { align: 'center' });
    doc.moveTo(50, 85).lineTo(545, 85).stroke('#3498db');

    let currentY = 110;

    // Profile image (base64 data URI) or placeholder
    const imgBuffer = dataUriToBuffer(maid.profilePhoto);
    if (imgBuffer) {
      try {
        doc.image(imgBuffer, 450, currentY, { width: 100, height: 120, fit: [100, 120] });
      } catch {
        doc.rect(450, currentY, 100, 120).stroke('#cccccc');
        doc.fontSize(10).fillColor('#666666').text('No Image', 475, currentY + 55);
      }
    } else {
      doc.rect(450, currentY, 100, 120).stroke('#cccccc');
      doc.fontSize(10).fillColor('#666666').text('No Image', 475, currentY + 55);
    }

    // Personal information
    doc.fontSize(16).fillColor('#2c3e50').text('PERSONAL INFORMATION', 50, currentY);
    currentY += 25;
    doc.fontSize(12).fillColor('#000000');

    const row = (label, value) => {
      doc.fillColor('#000000').text(label, 50, currentY);
      doc.fillColor('#2c3e50').text(value == null || value === '' ? 'N/A' : String(value), 150, currentY);
      currentY += 20;
    };

    row('Name:', maid.name);
    row('Gender:', maid.gender);
    row('Nationality:', maid.nationality);
    row('Education:', maid.educationLevel);
    row('Marital Status:', maid.maritalStatus);
    row('Work Experience:', `${maid.workExperience || 0} years`);
    row('Height:', `${maid.height || 'N/A'} cm`);
    row('Weight:', `${maid.weight || 'N/A'} kg`);
    row('Chinese Zodiac:', maid.chineseZodiac);
    row('Religion:', maid.religion);
    row('Horoscope:', maid.horoscope);
    if (maid.dateOfBirth) row('Date of Birth:', new Date(maid.dateOfBirth).toLocaleDateString());
    if (maid.numberOfChildren) row('Children:', maid.numberOfChildren);
    if (maid.numberOfBrothers !== undefined) row('Brothers:', maid.numberOfBrothers);
    if (maid.numberOfSisters !== undefined) row('Sisters:', maid.numberOfSisters);
    if (maid.contactNumber) row('Contact:', maid.contactNumber);
    if (maid.email) row('Email:', maid.email);

    currentY += 15;

    const ensureSpace = () => {
      if (currentY > 700) { doc.addPage(); currentY = 50; }
    };

    // Languages
    if (maid.languages && maid.languages.length > 0) {
      doc.fontSize(16).fillColor('#2c3e50').text('LANGUAGES', 50, currentY);
      currentY += 25;
      maid.languages.forEach((lang, index) => {
        const col = index % 2;
        const x = col === 0 ? 50 : 300;
        const y = currentY + Math.floor(index / 2) * 20;
        doc.fontSize(12).fillColor('#000000').text('•', x, y);
        doc.fillColor('#2c3e50').text(`${lang.language}:`, x + 15, y);
        doc.fillColor('#000000').text(`${lang.level}`, x + 100, y);
      });
      currentY += Math.ceil(maid.languages.length / 2) * 20 + 20;
    }

    // Skills
    const availableSkills = maid.skills ? maid.skills.filter((s) => s.value) : [];
    if (availableSkills.length > 0) {
      ensureSpace();
      doc.fontSize(16).fillColor('#2c3e50').text('SKILLS', 50, currentY);
      currentY += 25;
      availableSkills.forEach((skill, index) => {
        const col = index % 3;
        const x = 50 + col * 170;
        const y = currentY + Math.floor(index / 3) * 20;
        doc.fontSize(12).fillColor('#000000').text('•', x, y);
        doc.fillColor('#2c3e50').text(skill.skill, x + 15, y);
      });
      currentY += Math.ceil(availableSkills.length / 3) * 20 + 20;
    }

    // Special skills
    if (maid.specialSkills && maid.specialSkills.length > 0) {
      ensureSpace();
      doc.fontSize(16).fillColor('#2c3e50').text('SPECIAL SKILLS', 50, currentY);
      currentY += 25;
      maid.specialSkills.forEach((skill) => {
        ensureSpace();
        const raw = (skill.skill || '').toString().trim();
        const clean = raw.replace(/[一-鿿㐀-䶿]/g, '').replace(/\s+/g, ' ').trim().substring(0, 50);
        doc.fontSize(12).fillColor('#000000').text('•', 50, currentY);
        doc.fillColor('#2c3e50').text(clean, 65, currentY, { width: 180, ellipsis: true });
        const statusText = [];
        if (skill.experienced) statusText.push('Experienced');
        statusText.push(skill.accepted ? 'Accepted' : 'Not Accepted');
        doc.fillColor(skill.accepted ? '#27ae60' : '#e74c3c').text(`(${statusText.join(', ')})`, 250, currentY, { width: 200 });
        currentY += 15;
      });
      currentY += 20;
    }

    // Personal information Q&A
    if (maid.personalInformation && maid.personalInformation.length > 0) {
      ensureSpace();
      doc.fontSize(16).fillColor('#2c3e50').text('ADDITIONAL INFORMATION', 50, currentY);
      currentY += 25;
      maid.personalInformation.forEach((info) => {
        ensureSpace();
        doc.fontSize(12).fillColor('#000000').text('•', 50, currentY);
        doc.fillColor('#2c3e50').text(info.question, 65, currentY, { width: 300 });
        doc.fillColor('#27ae60').text(String(info.answer || '').toUpperCase(), 400, currentY);
        currentY += 15;
      });
      currentY += 20;
    }

    // Previous employment
    if (maid.previousEmployment && maid.previousEmployment.length > 0) {
      ensureSpace();
      doc.fontSize(16).fillColor('#2c3e50').text('PREVIOUS EMPLOYMENT', 50, currentY);
      currentY += 25;
      maid.previousEmployment.forEach((emp, index) => {
        ensureSpace();
        doc.fontSize(14).fillColor('#2c3e50').text(`Employment ${index + 1}:`, 50, currentY);
        currentY += 20;
        const sub = (label, value) => {
          if (!value) return;
          doc.fontSize(12).fillColor('#000000').text(label, 70, currentY);
          doc.fillColor('#2c3e50').text(String(value), 150, currentY, { width: 350 });
          currentY += 15;
        };
        sub('Employer:', emp.employerName);
        sub('Period:', emp.period);
        sub('Location:', emp.location);
        sub('Duties:', emp.duties);
        sub('Reason for Leave:', emp.reasonForLeave);
        currentY += 10;
      });
    }

    // Footer
    doc.fontSize(10).fillColor('#666666').text(
      `Generated on ${new Date().toLocaleDateString()}`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    if (!res.headersSent) res.status(500).json({ error: 'Server error', details: error.message });
  }
};
