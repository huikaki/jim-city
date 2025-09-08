require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔗 Testing MongoDB connection...');
    console.log('📍 Connection string:', process.env.MONGODB_URI ? 'Set ✅' : 'Not set ❌');
    
    if (!process.env.MONGODB_URI) {
      console.log('\n❌ MONGODB_URI environment variable is not set!');
      console.log('🔧 Set it with:');
      console.log('export MONGODB_URI="mongodb+srv://admin:admin123@cluster0.onowk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ test: 'Connection successful' });
    await testDoc.save();
    await TestModel.deleteOne({ _id: testDoc._id });
    
    console.log('✅ Database write/read test passed!');
    console.log('\n🎯 Ready to seed the database!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication issue - check your username/password in the connection string');
    } else if (error.message.includes('network')) {
      console.log('\n🔧 Network issue - check your internet connection and MongoDB Atlas whitelist');
    }
    
    process.exit(1);
  }
}

testConnection();