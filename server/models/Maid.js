const mongoose = require('mongoose');

const maidSchema = new mongoose.Schema({
  maidId: {
    type: String,
    unique: true,
    required: false // Will be set before validation
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  numberOfChildren: {
    type: String,
    required: false
  },
  numberOfBrothers: {
    type: Number,
    required: false
  },
  numberOfSisters: {
    type: Number,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  educationLevel: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  chineseZodiac: {
    type: String,
    required: true
  },
  religion: {
    type: String,
    required: true
  },
  horoscope: {
    type: String,
    required: true
  },
  workExperience: {
    type: Number,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  languages: [{
    language: String,
    level: String
  }],
  skills: [{
    skill: String,
    value: Boolean
  }],
  previousEmployment: [{
    employerName: String,
    period: String,
    location: String,
    duties: String,
    skills: [{
      skill: String,
      value: Boolean
    }],
    reasonForLeave: String,
    noOfAdults: Number,
    noOfNewBorn: Number,
    noOfElderly: Number,
    noOfChildrenWithAge: String
  }],
  specialSkills: [{
    skill: String,
    experienced: Boolean,
    accepted: Boolean
  }],
  personalInformation: [{
    question: String,
    answer: String
  }],
  profilePhoto: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'not available'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Auto-generate maidId before validation
maidSchema.pre('validate', async function(next) {
  if (!this.maidId) {
    try {
      console.log('Generating maidId...');
      const count = await this.constructor.countDocuments();
      console.log('Current maid count:', count);
      
      // Generate unique maidId
      let attempts = 0;
      let maidId;
      
      do {
        const letters = String.fromCharCode(65 + Math.floor((count + attempts) / 9999), 65 + Math.floor(((count + attempts) % 9999) / 99));
        const numbers = String(count + attempts + 1).padStart(4, '0');
        maidId = letters + numbers;
        
        // Check if this maidId already exists
        const existing = await this.constructor.findOne({ maidId });
        if (!existing) {
          break;
        }
        attempts++;
      } while (attempts < 10);
      
      this.maidId = maidId;
      console.log('Generated maidId:', this.maidId);
    } catch (error) {
      console.error('Error generating maidId:', error);
      // Fallback if count fails
      const randomNum = Math.floor(Math.random() * 9999) + 1;
      this.maidId = 'AA' + String(randomNum).padStart(4, '0');
      console.log('Fallback maidId:', this.maidId);
    }
  }
  next();
});

module.exports = mongoose.model('Maid', maidSchema);