# 🚀 Quick Setup Guide

## The Issue You're Facing

The `nodemon app crashed` error occurs because **MongoDB is not installed or running** on your system.

## 🔧 Solution Options (Choose One)

### Option 1: MongoDB Atlas (Cloud) - **RECOMMENDED** ⭐

**Easiest option - no local installation needed!**

1. **Follow the detailed guide:**
   ```bash
   open mongodb-atlas-setup.md
   ```

2. **Quick steps:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free account → Create cluster
   - Get connection string
   - Set environment variable:
     ```bash
     export MONGODB_URI="your-connection-string"
     ```

3. **Start the app:**
   ```bash
   cd server && npm run seed
   npm run dev
   ```

### Option 2: Docker (If you have Docker)

1. **Run the Docker setup:**
   ```bash
   ./docker-mongodb.sh
   ```

2. **Start the app:**
   ```bash
   cd server && npm run seed
   npm run dev
   ```

### Option 3: Local Installation (Advanced)

1. **Fix Command Line Tools first:**
   ```bash
   xcode-select --install
   ```

2. **Run the setup script:**
   ```bash
   ./setup-mongodb.sh
   ```

1. **Create a free MongoDB Atlas account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Get your connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string

3. **Set environment variable:**
   ```bash
   export MONGODB_URI="your-mongodb-atlas-connection-string"
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

## 🎯 Verification

1. **Check if MongoDB is running:**
   ```bash
   brew services list | grep mongodb
   ```

2. **Test the server:**
   ```bash
   curl http://localhost:5001/api/company
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001
   - Admin Login: http://localhost:3000/login

## 🔑 Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

## 🐛 Troubleshooting

### Port 5000 Already in Use
- The server now runs on port **5001** to avoid conflicts
- macOS Control Center uses port 5000 by default

### MongoDB Connection Issues
```bash
# Restart MongoDB
brew services restart mongodb/brew/mongodb-community

# Check MongoDB logs
brew services list
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

### Dependencies Issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# In server directory
cd server
rm -rf node_modules package-lock.json
npm install

# In client directory
cd client
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure After Setup

```
maid-agency-cms/
├── server/                 # Backend (Port 5001)
│   ├── models/            # MongoDB models
│   ├── middleware/        # Auth middleware
│   ├── uploads/          # Uploaded files
│   └── index.js          # Server entry point
├── client/                # Frontend (Port 3000)
│   └── src/components/   # React components
├── setup-mongodb.sh      # MongoDB setup script
└── SETUP.md             # This file
```

## ✅ Success Indicators

When everything is working correctly, you should see:

```bash
✅ Connected to MongoDB
✅ Server running on port 5001
✅ 20 sample maids inserted successfully
✅ Admin user created: username=admin, password=admin123
```

## 🆘 Still Having Issues?

1. **Check system requirements:**
   - Node.js 16+ installed
   - macOS with Homebrew
   - Sufficient disk space

2. **Common fixes:**
   ```bash
   # Kill any processes on port 5001
   lsof -ti:5001 | xargs kill -9
   
   # Reset MongoDB
   brew services stop mongodb/brew/mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```

3. **Start fresh:**
   ```bash
   # Clean everything
   rm -rf node_modules server/node_modules client/node_modules
   npm run install-all
   ./setup-mongodb.sh
   ```



   JWT Token
   c1d91f1a0e7c1d00ebc754df12591ed2