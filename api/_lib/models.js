const mongoose = require('mongoose');

// ============================================================
//  Maid schema — kept in sync with server/models/Maid.js
//  (single shape used by both the local Express server and the
//   Vercel serverless functions, so data is consistent everywhere)
// ============================================================
const maidSchema = new mongoose.Schema({
  maidId: { type: String, unique: true, required: false },
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date, required: false },
  numberOfChildren: { type: String, required: false },
  numberOfBrothers: { type: Number, required: false },
  numberOfSisters: { type: Number, required: false },
  address: { type: String, required: false },
  educationLevel: { type: String, required: true },
  nationality: { type: String, required: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  chineseZodiac: { type: String, required: true },
  religion: { type: String, required: true },
  horoscope: { type: String, required: true },
  workExperience: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  languages: [{ language: String, level: String }],
  skills: [{ skill: String, value: Boolean }],
  previousEmployment: [{
    employerName: String,
    period: String,
    location: String,
    duties: String,
    skills: [{ skill: String, value: Boolean }],
    reasonForLeave: String,
    noOfAdults: Number,
    noOfNewBorn: Number,
    noOfElderly: Number,
    noOfChildrenWithAge: String
  }],
  specialSkills: [{ skill: String, experienced: Boolean, accepted: Boolean }],
  personalInformation: [{ question: String, answer: String }],
  profilePhoto: { type: String, default: null },
  status: { type: String, enum: ['available', 'pending', 'not available'], default: 'available' }
}, { timestamps: true });

// Auto-generate maidId (e.g. AA0001) before validation
maidSchema.pre('validate', async function (next) {
  if (!this.maidId) {
    try {
      const count = await this.constructor.countDocuments();
      let attempts = 0;
      let maidId;
      do {
        const letters = String.fromCharCode(
          65 + Math.floor((count + attempts) / 9999),
          65 + Math.floor(((count + attempts) % 9999) / 99)
        );
        const numbers = String(count + attempts + 1).padStart(4, '0');
        maidId = letters + numbers;
        const existing = await this.constructor.findOne({ maidId });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);
      this.maidId = maidId;
    } catch (error) {
      const randomNum = Math.floor(Math.random() * 9999) + 1;
      this.maidId = 'AA' + String(randomNum).padStart(4, '0');
    }
  }
  next();
});

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }
}, { timestamps: true });

// Company schema
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  website: String,
  description: String,
  logo: String
}, { timestamps: true });

const Maid = mongoose.models.Maid || mongoose.model('Maid', maidSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

module.exports = { Maid, User, Company };
