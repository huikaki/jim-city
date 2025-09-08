const mongoose = require('mongoose');

// Maid Schema
const maidSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  nationality: { type: String, required: true },
  experience: { type: String, required: true },
  languages: [String],
  skills: [String],
  salary: { type: Number, required: true },
  status: { type: String, enum: ['available', 'not available', 'pending'], default: 'pending' },
  photo: String,
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  workExperience: String,
  education: String,
  maritalStatus: String,
  children: Number,
  religion: String,
  cookingSkills: [String],
  specialSkills: [String],
  previousEmployment: String,
  references: String,
  medicalHistory: String,
  availability: String,
  workingHours: String,
  restDays: [String],
  additionalNotes: String
}, {
  timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }
}, {
  timestamps: true
});

// Company Schema
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  website: String,
  description: String,
  logo: String
}, {
  timestamps: true
});

const Maid = mongoose.models.Maid || mongoose.model('Maid', maidSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

module.exports = { Maid, User, Company };