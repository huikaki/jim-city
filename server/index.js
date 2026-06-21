require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');

// Models
const Maid = require('./models/Maid');
const User = require('./models/User');
const { auth, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maid-agency', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.log('\n🔧 To fix this issue:');
        console.log('1. Install MongoDB:');
        console.log('   brew tap mongodb/brew');
        console.log('   brew install mongodb-community');
        console.log('2. Start MongoDB:');
        console.log('   brew services start mongodb/brew/mongodb-community');
        console.log('3. Or use MongoDB Atlas (cloud):');
        console.log('   Set MONGODB_URI environment variable');
        console.log('\n⚠️  Server will continue running but database features will not work.\n');
    }
};

connectDB();

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use('/uploads', express.static('uploads')); // still serves any legacy files

// Configure multer to keep the upload in memory, then store it as a base64
// data URI in MongoDB. This keeps photos portable and consistent with the
// Vercel serverless functions (Vercel's filesystem is ephemeral/read-only).
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 } // 4 MB
});

const fileToDataUri = (file) =>
    file ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}` : null;

let companyInfo = {
    name: 'Premium Maid Services',
    description: 'Professional cleaning services with trusted and experienced staff.',
    founded: '2015',
    employees: '50+',
    services: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Move-in/Move-out Cleaning'],
    contact: {
        phone: '+1-555-MAIDS',
        email: 'info@premiummaidservices.com',
        address: '123 Clean Street, City, State 12345'
    }
};

// Routes

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                error: 'Database not available. Please ensure MongoDB is running.',
                message: 'Run: brew services start mongodb/brew/mongodb-community'
            });
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.post('/api/auth/verify', auth, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Company information
app.get('/api/company', (req, res) => {
    res.json(companyInfo);
});

app.put('/api/company', auth, (req, res) => {
    companyInfo = { ...companyInfo, ...req.body };
    res.json(companyInfo);
});

// Maids CRUD operations
app.get('/api/maids', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                error: 'Database not available. Please ensure MongoDB is running.',
                message: 'Run: brew services start mongodb/brew/mongodb-community'
            });
        }

        const { skills, status, nationality, gender, minExperience, maxExperience } = req.query;

        let query = {};

        if (skills) {
            const skillsArray = skills.split(',');
            query['skills.skill'] = { $in: skillsArray };
        }

        if (status) {
            query.status = status;
        }

        if (nationality) {
            query.nationality = nationality;
        }

        if (gender) {
            query.gender = gender;
        }

        if (minExperience) {
            query.workExperience = { ...query.workExperience, $gte: parseInt(minExperience) };
        }

        if (maxExperience) {
            query.workExperience = { ...query.workExperience, $lte: parseInt(maxExperience) };
        }

        const maids = await Maid.find(query).sort({ createdAt: -1 });
        res.json(maids);
    } catch (error) {
        console.error('Error fetching maids:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.get('/api/maids/:id', async (req, res) => {
    try {
        const maid = await Maid.findById(req.params.id);
        if (!maid) {
            return res.status(404).json({ error: 'Maid not found' });
        }
        res.json(maid);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Public maid application endpoint (no authentication required)
app.post('/api/maids/apply', upload.single('profilePhoto'), async (req, res) => {
    try {
        const maidData = {
            ...req.body,
            languages: JSON.parse(req.body.languages || '[]'),
            skills: JSON.parse(req.body.skills || '[]'),
            previousEmployment: JSON.parse(req.body.previousEmployment || '[]'),
            specialSkills: JSON.parse(req.body.specialSkills || '[]'),
            personalInformation: JSON.parse(req.body.personalInformation || '[]'),
            height: parseInt(req.body.height),
            weight: parseInt(req.body.weight),
            workExperience: parseInt(req.body.workExperience),
            numberOfBrothers: req.body.numberOfBrothers ? parseInt(req.body.numberOfBrothers) : undefined,
            numberOfSisters: req.body.numberOfSisters ? parseInt(req.body.numberOfSisters) : undefined,
            dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
            profilePhoto: fileToDataUri(req.file),
            status: 'pending' // Force pending status for public applications
        };

        const maid = new Maid(maidData);
        await maid.save();
        res.status(201).json({
            message: 'Application submitted successfully',
            maidId: maid.maidId,
            status: maid.status
        });
    } catch (error) {
        console.error('Error creating maid application:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Admin-only maid creation endpoint (requires authentication)
app.post('/api/maids', auth, upload.single('profilePhoto'), async (req, res) => {
    try {
        const maidData = {
            ...req.body,
            languages: JSON.parse(req.body.languages || '[]'),
            skills: JSON.parse(req.body.skills || '[]'),
            previousEmployment: JSON.parse(req.body.previousEmployment || '[]'),
            specialSkills: JSON.parse(req.body.specialSkills || '[]'),
            personalInformation: JSON.parse(req.body.personalInformation || '[]'),
            height: parseInt(req.body.height),
            weight: parseInt(req.body.weight),
            workExperience: parseInt(req.body.workExperience),
            numberOfBrothers: req.body.numberOfBrothers ? parseInt(req.body.numberOfBrothers) : undefined,
            numberOfSisters: req.body.numberOfSisters ? parseInt(req.body.numberOfSisters) : undefined,
            dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
            profilePhoto: fileToDataUri(req.file)
        };

        const maid = new Maid(maidData);
        await maid.save();
        res.status(201).json(maid);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.put('/api/maids/:id', auth, upload.single('profilePhoto'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.body.languages) {
            updateData.languages = JSON.parse(req.body.languages);
        }
        if (req.body.skills) {
            updateData.skills = JSON.parse(req.body.skills);
        }
        if (req.body.previousEmployment) {
            updateData.previousEmployment = JSON.parse(req.body.previousEmployment);
        }
        if (req.body.specialSkills) {
            updateData.specialSkills = JSON.parse(req.body.specialSkills);
        }
        if (req.body.personalInformation) {
            updateData.personalInformation = JSON.parse(req.body.personalInformation);
        }
        if (req.body.numberOfBrothers) {
            updateData.numberOfBrothers = parseInt(req.body.numberOfBrothers);
        }
        if (req.body.numberOfSisters) {
            updateData.numberOfSisters = parseInt(req.body.numberOfSisters);
        }
        if (req.body.dateOfBirth) {
            updateData.dateOfBirth = new Date(req.body.dateOfBirth);
        }
        if (req.body.height) {
            updateData.height = parseInt(req.body.height);
        }
        if (req.body.weight) {
            updateData.weight = parseInt(req.body.weight);
        }
        if (req.body.workExperience) {
            updateData.workExperience = parseInt(req.body.workExperience);
        }
        if (req.file) {
            updateData.profilePhoto = fileToDataUri(req.file);
        }

        const maid = await Maid.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!maid) {
            return res.status(404).json({ error: 'Maid not found' });
        }

        res.json(maid);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/maids/:id', auth, async (req, res) => {
    try {
        const maid = await Maid.findByIdAndDelete(req.params.id);
        if (!maid) {
            return res.status(404).json({ error: 'Maid not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Data cleanup endpoint to remove Chinese characters from skill names
app.post('/api/cleanup-skills', async (req, res) => {
    try {
        const maids = await Maid.find({});
        let updatedCount = 0;

        for (const maid of maids) {
            let hasChanges = false;
            
            if (maid.specialSkills && maid.specialSkills.length > 0) {
                maid.specialSkills.forEach(skill => {
                    const originalSkill = skill.skill;
                    const cleanedSkill = originalSkill.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '').replace(/\s+/g, ' ').trim();
                    
                    if (originalSkill !== cleanedSkill) {
                        skill.skill = cleanedSkill;
                        hasChanges = true;
                    }
                });
            }

            if (hasChanges) {
                await maid.save();
                updatedCount++;
            }
        }

        res.json({ 
            message: `Cleaned up skill names for ${updatedCount} maids`,
            updatedCount 
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({ error: 'Server error during cleanup' });
    }
});

// PDF generation endpoint
app.get('/api/maids/:id/pdf', async (req, res) => {
    try {
        const maid = await Maid.findById(req.params.id);
        if (!maid) {
            return res.status(404).json({ error: 'Maid not found' });
        }

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${maid.name.replace(/\s+/g, '_')}_profile.pdf"`);

        doc.pipe(res);

        // Header
        doc.fontSize(24).fillColor('#2c3e50').text('MAID PROFILE', 50, 50, { align: 'center' });
        doc.moveTo(50, 85).lineTo(545, 85).stroke('#3498db');

        let currentY = 110;

        // Profile Image Section
        const drawNoImage = () => {
            doc.rect(450, currentY, 100, 120).stroke('#cccccc');
            doc.fontSize(10).fillColor('#666666').text('No Image', 475, currentY + 55);
        };
        // profilePhoto is a base64 data URI; decode it to a Buffer for PDFKit.
        // (Legacy "/uploads/..." disk paths fall back to a placeholder.)
        const dataUriMatch = typeof maid.profilePhoto === 'string'
            ? maid.profilePhoto.match(/^data:.*?;base64,(.*)$/)
            : null;
        if (dataUriMatch) {
            try {
                const imgBuffer = Buffer.from(dataUriMatch[1], 'base64');
                doc.image(imgBuffer, 450, currentY, { width: 100, height: 120, fit: [100, 120] });
            } catch (imageError) {
                console.log('Error loading profile image:', imageError);
                drawNoImage();
            }
        } else if (maid.profilePhoto && fs.existsSync(path.join(__dirname, maid.profilePhoto))) {
            try {
                doc.image(path.join(__dirname, maid.profilePhoto), 450, currentY, { width: 100, height: 120, fit: [100, 120] });
            } catch (imageError) {
                drawNoImage();
            }
        } else {
            drawNoImage();
        }

        // Personal Information Section (Left Column)
        doc.fontSize(16).fillColor('#2c3e50').text('PERSONAL INFORMATION', 50, currentY);
        currentY += 25;

        // Single column layout for personal information
        doc.fontSize(12).fillColor('#000000');

        // Name
        doc.text('Name:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.name || 'N/A', 150, currentY);
        currentY += 20;

        // Gender
        doc.fillColor('#000000').text('Gender:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.gender || 'N/A', 150, currentY);
        currentY += 20;

        // Nationality
        doc.fillColor('#000000').text('Nationality:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.nationality || 'N/A', 150, currentY);
        currentY += 20;

        // Education
        doc.fillColor('#000000').text('Education:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.educationLevel || 'N/A', 150, currentY);
        currentY += 20;

        // Marital Status
        doc.fillColor('#000000').text('Marital Status:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.maritalStatus || 'N/A', 150, currentY);
        currentY += 20;

        // Work Experience
        doc.fillColor('#000000').text('Work Experience:', 50, currentY);
        doc.fillColor('#2c3e50').text(`${maid.workExperience || 0} years`, 150, currentY);
        currentY += 20;

        // Height
        doc.fillColor('#000000').text('Height:', 50, currentY);
        doc.fillColor('#2c3e50').text(`${maid.height || 'N/A'} cm`, 150, currentY);
        currentY += 20;

        // Weight
        doc.fillColor('#000000').text('Weight:', 50, currentY);
        doc.fillColor('#2c3e50').text(`${maid.weight || 'N/A'} kg`, 150, currentY);
        currentY += 20;

        // Chinese Zodiac
        doc.fillColor('#000000').text('Chinese Zodiac:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.chineseZodiac || 'N/A', 150, currentY);
        currentY += 20;

        // Religion
        doc.fillColor('#000000').text('Religion:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.religion || 'N/A', 150, currentY);
        currentY += 20;

        // Horoscope
        doc.fillColor('#000000').text('Horoscope:', 50, currentY);
        doc.fillColor('#2c3e50').text(maid.horoscope || 'N/A', 150, currentY);
        currentY += 20;

        // Date of Birth
        if (maid.dateOfBirth) {
            doc.fillColor('#000000').text('Date of Birth:', 50, currentY);
            doc.fillColor('#2c3e50').text(new Date(maid.dateOfBirth).toLocaleDateString() || 'N/A', 150, currentY);
            currentY += 20;
        }

        // Number of Children
        if (maid.numberOfChildren) {
            doc.fillColor('#000000').text('Children:', 50, currentY);
            doc.fillColor('#2c3e50').text(maid.numberOfChildren || 'N/A', 150, currentY);
            currentY += 20;
        }

        // Number of Brothers
        if (maid.numberOfBrothers !== undefined) {
            doc.fillColor('#000000').text('Brothers:', 50, currentY);
            doc.fillColor('#2c3e50').text(maid.numberOfBrothers.toString() || '0', 150, currentY);
            currentY += 20;
        }

        // Number of Sisters
        if (maid.numberOfSisters !== undefined) {
            doc.fillColor('#000000').text('Sisters:', 50, currentY);
            doc.fillColor('#2c3e50').text(maid.numberOfSisters.toString() || '0', 150, currentY);
            currentY += 20;
        }

        currentY += 15;

        // Languages Section
        if (maid.languages && maid.languages.length > 0) {
            doc.fontSize(16).fillColor('#2c3e50').text('LANGUAGES', 50, currentY);
            currentY += 25;

            maid.languages.forEach((lang, index) => {
                const col = index % 2;
                const row = Math.floor(index / 2);
                const x = col === 0 ? 50 : 300;
                const y = currentY + (row * 20);

                doc.fontSize(12).fillColor('#000000').text('•', x, y);
                doc.fillColor('#2c3e50').text(`${lang.language}:`, x + 15, y);
                doc.fillColor('#000000').text(`${lang.level}`, x + 100, y);
            });
            currentY += Math.ceil(maid.languages.length / 2) * 20 + 20;
        }

        // Skills Section
        const availableSkills = maid.skills ? maid.skills.filter(skill => skill.value) : [];
        if (availableSkills.length > 0) {
            doc.fontSize(16).fillColor('#2c3e50').text('SKILLS', 50, currentY);
            currentY += 25;

            availableSkills.forEach((skill, index) => {
                const col = index % 3;
                const row = Math.floor(index / 3);
                const x = 50 + (col * 170);
                const y = currentY + (row * 20);

                doc.fontSize(12).fillColor('#000000').text('•', x, y);
                doc.fillColor('#2c3e50').text(skill.skill, x + 15, y);
            });
            currentY += Math.ceil(availableSkills.length / 3) * 20 + 20;
        }

        // Special Skills Section
        if (maid.specialSkills && maid.specialSkills.length > 0) {
            doc.fontSize(16).fillColor('#2c3e50').text('SPECIAL SKILLS', 50, currentY);
            currentY += 25;

            maid.specialSkills.forEach((skill, index) => {
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }

                doc.fontSize(12).fillColor('#000000').text('•', 50, currentY);
                
                // Map skill keys to readable names and handle encoding issues
                const skillTranslations = {
                    'babyCare': 'Baby Care',
                    'changingDiaper': 'Changing Diaper',
                    'feedingMilk': 'Feeding Milk',
                    'babyBathing': 'Baby Bathing',
                    'childCare': 'Child Care',
                    'playingChildren': 'Playing with Children',
                    'tutoringChildren': 'Tutoring Children',
                    'specialCareAbnormal': 'Special Care of Abnormal Children',
                    'elderlyCare': 'Elderly Care',
                    'specialCareDisabled': 'Special Care of Disabled Elderly',
                    'handWashClothes': 'Hand Wash Clothes',
                    'cookingChinese': 'Cooking Chinese Food',
                    'marketing': 'Marketing',
                    'petsCare': 'Pets Care',
                    'gardening': 'Gardening',
                    // Handle mixed language entries
                    'Gardening 園藝': 'Gardening',
                    'Gardening園藝': 'Gardening'
                };
                
                const rawSkillText = (skill.skill || '').toString().trim();
                let skillText = skillTranslations[rawSkillText] || rawSkillText;
                
                // Remove Chinese characters and extra spaces from skill names
                skillText = skillText.replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '').replace(/\s+/g, ' ').trim();
                
                // Debug logging to identify encoding issues
                console.log('Raw skill:', rawSkillText, 'Cleaned:', skillText);
                
                // Clean text to prevent encoding issues - only remove control characters, keep printable ASCII
                const cleanSkillText = skillText.replace(/[\x00-\x1F\x7F-\xFF]/g, '').substring(0, 50);
                doc.fillColor('#2c3e50').text(cleanSkillText, 65, currentY, { width: 180, ellipsis: true });
                
                const statusText = [];
                if (skill.experienced) statusText.push('Experienced');
                
                // Always show acceptance status
                if (skill.accepted) {
                    statusText.push('Accepted');
                } else {
                    statusText.push('Not Accepted');
                }
                
                if (statusText.length > 0) {
                    // Use different colors for accepted vs not accepted
                    const color = skill.accepted ? '#27ae60' : '#e74c3c';
                    doc.fillColor(color).text(`(${statusText.join(', ')})`, 250, currentY, { width: 200 });
                }
                
                currentY += 15;
            });
            currentY += 20;
        }

        // Personal Information Section
        if (maid.personalInformation && maid.personalInformation.length > 0) {
            doc.fontSize(16).fillColor('#2c3e50').text('PERSONAL INFORMATION', 50, currentY);
            currentY += 25;

            maid.personalInformation.forEach((info, index) => {
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }

                doc.fontSize(12).fillColor('#000000').text('•', 50, currentY);
                doc.fillColor('#2c3e50').text(info.question, 65, currentY, { width: 300 });
                doc.fillColor('#27ae60').text(info.answer.toUpperCase(), 400, currentY);
                currentY += 15;
            });
            currentY += 20;
        }

        // Previous Employment Section
        if (maid.previousEmployment && maid.previousEmployment.length > 0) {
            doc.fontSize(16).fillColor('#2c3e50').text('PREVIOUS EMPLOYMENT', 50, currentY);
            currentY += 25;

            maid.previousEmployment.forEach((emp, index) => {
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }

                doc.fontSize(14).fillColor('#2c3e50').text(`Employment ${index + 1}:`, 50, currentY);
                currentY += 20;

                if (emp.employerName) {
                    doc.fontSize(12).fillColor('#000000').text('Employer:', 70, currentY);
                    doc.fillColor('#2c3e50').text(emp.employerName, 150, currentY);
                    currentY += 15;
                }

                if (emp.period) {
                    doc.fillColor('#000000').text('Period:', 70, currentY);
                    doc.fillColor('#2c3e50').text(emp.period, 150, currentY);
                    currentY += 15;
                }

                if (emp.location) {
                    doc.fillColor('#000000').text('Location:', 70, currentY);
                    doc.fillColor('#2c3e50').text(emp.location, 150, currentY);
                    currentY += 15;
                }

                if (emp.duties) {
                    doc.fillColor('#000000').text('Duties:', 70, currentY);
                    const dutiesText = emp.duties || 'N/A';
                    doc.fillColor('#2c3e50').text(dutiesText, 150, currentY, { width: 350 });
                    // Calculate how many lines the duties text will take (approximate)
                    const dutiesHeight = Math.ceil(dutiesText.length / 60) * 15;
                    currentY += Math.max(20, dutiesHeight);
                }

                if (emp.reasonForLeave) {
                    doc.fillColor('#000000').text('Reason for Leave:', 70, currentY);
                    doc.fillColor('#2c3e50').text(emp.reasonForLeave, 200, currentY);
                    currentY += 15;
                }

                // Household composition
                const householdInfo = [];
                if (emp.noOfAdults) householdInfo.push(`Adults: ${emp.noOfAdults}`);
                if (emp.noOfNewBorn) householdInfo.push(`Newborns: ${emp.noOfNewBorn}`);
                if (emp.noOfElderly) householdInfo.push(`Elderly: ${emp.noOfElderly}`);
                if (emp.noOfChildrenWithAge) householdInfo.push(`Children: ${emp.noOfChildrenWithAge}`);
                
                if (householdInfo.length > 0) {
                    doc.fillColor('#000000').text('Household:', 70, currentY);
                    doc.fillColor('#2c3e50').text(householdInfo.join(', '), 150, currentY, { width: 350 });
                    currentY += 15;
                }

                // Employment skills
                if (emp.skills && emp.skills.length > 0) {
                    const empSkills = emp.skills.filter(skill => skill.value).map(skill => skill.skill);
                    if (empSkills.length > 0) {
                        doc.fillColor('#000000').text('Skills:', 70, currentY);
                        doc.fillColor('#2c3e50').text(empSkills.join(', '), 150, currentY, { width: 350 });
                        currentY += 15;
                    }
                }

                currentY += 10;
            });
        }

        // Footer
        const pageHeight = doc.page.height;
        doc.fontSize(10).fillColor('#666666').text(
            `Generated on ${new Date().toLocaleDateString()}`,
            50,
            pageHeight - 50,
            { align: 'center' }
        );

        doc.end();
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Handle React routing in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});