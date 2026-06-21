require('dotenv').config();
const mongoose = require('mongoose');
const Maid = require('./models/Maid');
const User = require('./models/User');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maid-agency', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Make sure you have set the MONGODB_URI environment variable:');
    console.log('export MONGODB_URI="mongodb+srv://admin:admin123@cluster0.onowk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"');
    process.exit(1);
  }
};

const sampleMaids = [
  {
    maidId: 'AA0001',
    name: 'Maria Santos',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Philippines',
    maritalStatus: 'Single',
    height: 160,
    weight: 55,
    chineseZodiac: 'Dragon',
    religion: 'Catholic',
    horoscope: 'Virgo',
    workExperience: 5,
    languages: [
      { language: 'English', level: 'Good' },
      { language: 'Tagalog', level: 'Native' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Johnson Family',
        period: '2019-2023',
        location: 'Hong Kong',
        duties: 'Childcare and household cleaning'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0002',
    name: 'Anna Chen',
    gender: 'Female',
    educationLevel: 'College',
    nationality: 'China',
    maritalStatus: 'Married',
    height: 165,
    weight: 58,
    chineseZodiac: 'Tiger',
    religion: 'Buddhist',
    horoscope: 'Leo',
    workExperience: 8,
    languages: [
      { language: 'Chinese', level: 'Native' },
      { language: 'English', level: 'Fair' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: false },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Wong Family',
        period: '2016-2024',
        location: 'Singapore',
        duties: 'Cooking and elderly care'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0003',
    name: 'Sarah Williams',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Indonesia',
    maritalStatus: 'Single',
    height: 158,
    weight: 52,
    chineseZodiac: 'Rabbit',
    religion: 'Muslim',
    horoscope: 'Gemini',
    workExperience: 3,
    languages: [
      { language: 'Indonesian', level: 'Native' },
      { language: 'English', level: 'Good' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Cooking', value: false },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Lee Family',
        period: '2021-2024',
        location: 'Malaysia',
        duties: 'Childcare and light housework'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0004',
    name: 'Lisa Kumar',
    gender: 'Female',
    educationLevel: 'College',
    nationality: 'India',
    maritalStatus: 'Divorced',
    height: 162,
    weight: 56,
    chineseZodiac: 'Snake',
    religion: 'Hindu',
    horoscope: 'Scorpio',
    workExperience: 10,
    languages: [
      { language: 'Hindi', level: 'Native' },
      { language: 'English', level: 'Excellent' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: true },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Smith Family',
        period: '2014-2024',
        location: 'Dubai',
        duties: 'Full household management'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0005',
    name: 'Jenny Park',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'South Korea',
    maritalStatus: 'Single',
    height: 155,
    weight: 48,
    chineseZodiac: 'Horse',
    religion: 'Christian',
    horoscope: 'Pisces',
    workExperience: 2,
    languages: [
      { language: 'Korean', level: 'Native' },
      { language: 'English', level: 'Fair' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Cooking', value: false },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Kim Family',
        period: '2022-2024',
        location: 'Seoul',
        duties: 'Childcare'
      }
    ],
    status: 'pending'
  },
  {
    maidId: 'AA0006',
    name: 'Rosa Martinez',
    gender: 'Female',
    educationLevel: 'Elementary',
    nationality: 'Philippines',
    maritalStatus: 'Married',
    height: 150,
    weight: 50,
    chineseZodiac: 'Goat',
    religion: 'Catholic',
    horoscope: 'Taurus',
    workExperience: 15,
    languages: [
      { language: 'Tagalog', level: 'Native' },
      { language: 'English', level: 'Good' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: true },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Garcia Family',
        period: '2009-2024',
        location: 'Hong Kong',
        duties: 'Complete household management'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0007',
    name: 'Mei Lin',
    gender: 'Female',
    educationLevel: 'College',
    nationality: 'Taiwan',
    maritalStatus: 'Single',
    height: 163,
    weight: 54,
    chineseZodiac: 'Monkey',
    religion: 'Buddhist',
    horoscope: 'Aquarius',
    workExperience: 6,
    languages: [
      { language: 'Chinese', level: 'Native' },
      { language: 'English', level: 'Excellent' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Chen Family',
        period: '2018-2024',
        location: 'Taipei',
        duties: 'Childcare and cooking'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0008',
    name: 'Priya Sharma',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Nepal',
    maritalStatus: 'Widowed',
    height: 157,
    weight: 53,
    chineseZodiac: 'Rooster',
    religion: 'Hindu',
    horoscope: 'Cancer',
    workExperience: 12,
    languages: [
      { language: 'Nepali', level: 'Native' },
      { language: 'Hindi', level: 'Good' },
      { language: 'English', level: 'Fair' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: false },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Patel Family',
        period: '2012-2024',
        location: 'Qatar',
        duties: 'Cooking and elderly care'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0009',
    name: 'Siti Rahman',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Malaysia',
    maritalStatus: 'Married',
    height: 159,
    weight: 57,
    chineseZodiac: 'Dog',
    religion: 'Muslim',
    horoscope: 'Libra',
    workExperience: 7,
    languages: [
      { language: 'Malay', level: 'Native' },
      { language: 'English', level: 'Good' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Ahmad Family',
        period: '2017-2024',
        location: 'Kuala Lumpur',
        duties: 'Childcare and household management'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0010',
    name: 'Thanh Nguyen',
    gender: 'Female',
    educationLevel: 'College',
    nationality: 'Vietnam',
    maritalStatus: 'Single',
    height: 161,
    weight: 51,
    chineseZodiac: 'Pig',
    religion: 'Buddhist',
    horoscope: 'Aries',
    workExperience: 4,
    languages: [
      { language: 'Vietnamese', level: 'Native' },
      { language: 'English', level: 'Good' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Tran Family',
        period: '2020-2024',
        location: 'Ho Chi Minh City',
        duties: 'Cooking and childcare'
      }
    ],
    status: 'not available'
  },
  {
    maidId: 'AA0011',
    name: 'Grace Lim',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Singapore',
    maritalStatus: 'Single',
    height: 164,
    weight: 59,
    chineseZodiac: 'Rat',
    religion: 'Christian',
    horoscope: 'Sagittarius',
    workExperience: 9,
    languages: [
      { language: 'English', level: 'Native' },
      { language: 'Chinese', level: 'Good' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Cooking', value: false },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Tan Family',
        period: '2015-2024',
        location: 'Singapore',
        duties: 'Childcare and elderly care'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0012',
    name: 'Fatima Ali',
    gender: 'Female',
    educationLevel: 'Elementary',
    nationality: 'Bangladesh',
    maritalStatus: 'Married',
    height: 152,
    weight: 49,
    chineseZodiac: 'Ox',
    religion: 'Muslim',
    horoscope: 'Capricorn',
    workExperience: 11,
    languages: [
      { language: 'Bengali', level: 'Native' },
      { language: 'English', level: 'Fair' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: false },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Hassan Family',
        period: '2013-2024',
        location: 'Dhaka',
        duties: 'Cooking and household cleaning'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0013',
    name: 'Carmen Reyes',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Philippines',
    maritalStatus: 'Divorced',
    height: 156,
    weight: 52,
    chineseZodiac: 'Tiger',
    religion: 'Catholic',
    horoscope: 'Virgo',
    workExperience: 13,
    languages: [
      { language: 'Tagalog', level: 'Native' },
      { language: 'English', level: 'Excellent' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Rodriguez Family',
        period: '2011-2024',
        location: 'Manila',
        duties: 'Complete household management'
      }
    ],
    status: 'pending'
  },
  {
    maidId: 'AA0014',
    name: 'Yuki Tanaka',
    gender: 'Female',
    educationLevel: 'College',
    nationality: 'Japan',
    maritalStatus: 'Single',
    height: 158,
    weight: 50,
    chineseZodiac: 'Rabbit',
    religion: 'Shinto',
    horoscope: 'Gemini',
    workExperience: 5,
    languages: [
      { language: 'Japanese', level: 'Native' },
      { language: 'English', level: 'Good' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Cooking', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Yamamoto Family',
        period: '2019-2024',
        location: 'Tokyo',
        duties: 'Childcare and light housework'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0015',
    name: 'Lakshmi Devi',
    gender: 'Female',
    educationLevel: 'Elementary',
    nationality: 'India',
    maritalStatus: 'Married',
    height: 154,
    weight: 55,
    chineseZodiac: 'Dragon',
    religion: 'Hindu',
    horoscope: 'Leo',
    workExperience: 16,
    languages: [
      { language: 'Tamil', level: 'Native' },
      { language: 'Hindi', level: 'Good' },
      { language: 'English', level: 'Fair' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: true },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Krishnan Family',
        period: '2008-2024',
        location: 'Chennai',
        duties: 'Complete household management'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0016',
    name: 'Niran Kaur',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'India',
    maritalStatus: 'Single',
    height: 160,
    weight: 56,
    chineseZodiac: 'Snake',
    religion: 'Sikh',
    horoscope: 'Scorpio',
    workExperience: 3,
    languages: [
      { language: 'Punjabi', level: 'Native' },
      { language: 'Hindi', level: 'Good' },
      { language: 'English', level: 'Good' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cooking', value: false },
      { skill: 'Cleaning', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Singh Family',
        period: '2021-2024',
        location: 'Amritsar',
        duties: 'Childcare and cleaning'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0017',
    name: 'Dewi Sari',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Indonesia',
    maritalStatus: 'Married',
    height: 157,
    weight: 53,
    chineseZodiac: 'Horse',
    religion: 'Muslim',
    horoscope: 'Pisces',
    workExperience: 8,
    languages: [
      { language: 'Indonesian', level: 'Native' },
      { language: 'English', level: 'Fair' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Wijaya Family',
        period: '2016-2024',
        location: 'Jakarta',
        duties: 'Cooking and childcare'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0018',
    name: 'Sunita Rai',
    gender: 'Female',
    educationLevel: 'College',
    nationality: 'Nepal',
    maritalStatus: 'Single',
    height: 162,
    weight: 54,
    chineseZodiac: 'Goat',
    religion: 'Hindu',
    horoscope: 'Taurus',
    workExperience: 6,
    languages: [
      { language: 'Nepali', level: 'Native' },
      { language: 'English', level: 'Excellent' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Shrestha Family',
        period: '2018-2024',
        location: 'Kathmandu',
        duties: 'Complete household management'
      }
    ],
    status: 'not available'
  },
  {
    maidId: 'AA0019',
    name: 'Aishah Binti Omar',
    gender: 'Female',
    educationLevel: 'High School',
    nationality: 'Malaysia',
    maritalStatus: 'Divorced',
    height: 155,
    weight: 51,
    chineseZodiac: 'Monkey',
    religion: 'Muslim',
    horoscope: 'Aquarius',
    workExperience: 10,
    languages: [
      { language: 'Malay', level: 'Native' },
      { language: 'English', level: 'Good' }
    ],
    skills: [
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Baby Sitting', value: false },
      { skill: 'Elder Care', value: true }
    ],
    previousEmployment: [
      {
        employerName: 'Ibrahim Family',
        period: '2014-2024',
        location: 'Penang',
        duties: 'Cooking and elderly care'
      }
    ],
    status: 'available'
  },
  {
    maidId: 'AA0020',
    name: 'Lily Zhang',
    gender: 'Female',
    educationLevel: 'College',
    nationality: 'China',
    maritalStatus: 'Single',
    height: 165,
    weight: 58,
    chineseZodiac: 'Rooster',
    religion: 'Buddhist',
    horoscope: 'Cancer',
    workExperience: 4,
    languages: [
      { language: 'Chinese', level: 'Native' },
      { language: 'English', level: 'Excellent' }
    ],
    skills: [
      { skill: 'Baby Sitting', value: true },
      { skill: 'Cooking', value: true },
      { skill: 'Cleaning', value: true },
      { skill: 'Elder Care', value: false }
    ],
    previousEmployment: [
      {
        employerName: 'Wang Family',
        period: '2020-2024',
        location: 'Shanghai',
        duties: 'Childcare and cooking'
      }
    ],
    status: 'pending'
  }
];

async function seedDatabase() {
  try {
    // Connect to database first
    await connectDB();
    
    console.log('🧹 Clearing existing data...');
    await Maid.deleteMany({});
    await User.deleteMany({});
    
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      username: 'admin',
      password: 'admin123'
    });
    await adminUser.save();
    console.log('✅ Admin user created: username=admin, password=admin123');
    
    console.log('👥 Inserting sample maids...');
    // Ensure required contact fields exist for every sample record
    const maidsToInsert = sampleMaids.map((maid, i) => ({
      contactNumber: maid.contactNumber || `+852 5${String(1000000 + i).slice(-7)}`,
      email: maid.email || `${(maid.name || 'maid').toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
      ...maid
    }));
    const insertedMaids = await Maid.insertMany(maidsToInsert);
    console.log(`✅ ${insertedMaids.length} sample maids inserted successfully`);
    
    // Show some sample maid IDs
    console.log('\n📋 Sample Maid IDs generated:');
    insertedMaids.slice(0, 3).forEach(maid => {
      console.log(`   - ${maid.maidId}: ${maid.name}`);
    });
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('🔑 Admin Login: username=admin, password=admin123');
    console.log('🌐 Start the app with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.name === 'ValidationError') {
      console.log('📋 Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`   - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
}

seedDatabase();