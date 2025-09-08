// Vercel serverless function for API routes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import your existing server code
const serverPath = require('path').join(__dirname, '../server');

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
};

// Simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', service: 'Maid Service API' });
});

// Export for Vercel
module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};