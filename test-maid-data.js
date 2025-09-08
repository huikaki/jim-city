// Test script to add a maid with all new fields
// Run this in the browser console on the admin panel page

const testMaidData = {
  name: 'Test Maid With New Fields',
  gender: 'Female',
  dateOfBirth: '1990-05-15',
  numberOfChildren: '2 children (ages 5, 8)',
  numberOfBrothers: 2,
  numberOfSisters: 1,
  address: '123 Test Street, Test City, Test Country',
  educationLevel: 'High School',
  nationality: 'Philippines',
  maritalStatus: 'Married',
  height: 160,
  weight: 55,
  chineseZodiac: 'Horse',
  religion: 'Christian',
  horoscope: 'Taurus',
  workExperience: 5,
  contactNumber: '+63 912 345 6789',
  email: 'testmaid@example.com',
  languages: [
    { language: 'English', level: 'Good' },
    { language: 'Filipino', level: 'Native' }
  ],
  skills: [
    { skill: 'Baby Sitting', value: true },
    { skill: 'Cooking', value: true },
    { skill: 'Cleaning', value: true }
  ],
  specialSkills: [
    { skill: 'Baby Care (0-12 months)', experienced: true, accepted: true },
    { skill: 'Changing Diaper', experienced: true, accepted: true },
    { skill: 'Cooking Chinese Food 烹調中國菜', experienced: false, accepted: true },
    { skill: 'Elderly Care', experienced: true, accepted: true }
  ],
  personalInformation: [
    { question: 'Do You Eat Chinese Food?', answer: 'yes' },
    { question: 'Do You Smoke?', answer: 'no' },
    { question: 'Do You Drink Alcohol?', answer: 'no' },
    { question: 'Are you afraid of dog or any pets?', answer: 'no' }
  ],
  previousEmployment: [
    {
      employerName: 'Smith Family',
      location: 'Hong Kong',
      period: '2020-2023',
      duties: 'Childcare and housekeeping',
      reasonForLeave: 'Family relocated',
      noOfAdults: 2,
      noOfNewBorn: 0,
      noOfElderly: 0,
      noOfChildrenWithAge: '2 (ages 3, 6)',
      skills: [
        { skill: 'Baby Sitting', value: true },
        { skill: 'Cleaning', value: true }
      ]
    }
  ],
  status: 'available'
};

console.log('Test maid data:', testMaidData);
console.log('Copy this data and use it to create a test maid in the admin panel');