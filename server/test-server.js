// Simple server test
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

app.get('/api/company', (req, res) => {
  res.json({
    name: 'Premium Maid Services',
    description: 'Professional cleaning services with trusted and experienced staff.',
    message: 'Server is running without MongoDB - please set up database to access full features'
  });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}/api/test`);
  
  // Auto-close after 5 seconds
  setTimeout(() => {
    console.log('🔄 Closing test server...');
    server.close();
    process.exit(0);
  }, 5000);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use`);
    console.log('🔧 Kill the process with: lsof -ti:3001 | xargs kill -9');
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});