#!/bin/bash

echo "🚀 Setting up MongoDB for Maid Agency CMS..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed. Please install it first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Check if MongoDB is already installed
if brew list mongodb-community &> /dev/null; then
    echo "✅ MongoDB is already installed"
else
    echo "📦 Installing MongoDB..."
    
    # Check Command Line Tools
    if ! xcode-select -p &> /dev/null; then
        echo "⚠️  Command Line Tools not found. Installing..."
        xcode-select --install
        echo "📋 Please complete the Command Line Tools installation and run this script again."
        exit 1
    fi
    
    # Try to install MongoDB
    brew tap mongodb/brew
    if ! brew install mongodb-community; then
        echo "❌ MongoDB installation failed. Trying alternative methods..."
        echo ""
        echo "🔧 Alternative options:"
        echo "1. Use MongoDB Atlas (cloud - recommended):"
        echo "   - Go to https://www.mongodb.com/atlas"
        echo "   - Create free account and cluster"
        echo "   - Get connection string"
        echo "   - Set: export MONGODB_URI='your-connection-string'"
        echo ""
        echo "2. Use Docker:"
        echo "   docker run -d -p 27017:27017 --name mongodb mongo:latest"
        echo ""
        echo "3. Manual installation:"
        echo "   - Download from https://www.mongodb.com/try/download/community"
        echo ""
        exit 1
    fi
fi

# Create data directory
echo "📁 Creating MongoDB data directory..."
mkdir -p /opt/homebrew/var/mongodb 2>/dev/null || mkdir -p ~/mongodb-data

# Start MongoDB service
echo "🔄 Starting MongoDB service..."
if ! brew services start mongodb/brew/mongodb-community; then
    echo "⚠️  Service start failed. Trying manual start..."
    mongod --dbpath ~/mongodb-data --fork --logpath ~/mongodb.log
fi

# Wait a moment for MongoDB to start
sleep 5

# Check if MongoDB is running
if pgrep mongod > /dev/null; then
    echo "✅ MongoDB is running successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Run: cd server && npm run seed"
    echo "2. Run: npm run dev"
    echo "3. Open: http://localhost:3000"
    echo ""
    echo "🔑 Admin login:"
    echo "   Username: admin"
    echo "   Password: admin123"
else
    echo "❌ MongoDB failed to start."
    echo ""
    echo "🔧 Quick fix - Use MongoDB Atlas instead:"
    echo "1. Go to https://www.mongodb.com/atlas"
    echo "2. Create a free account"
    echo "3. Create a cluster"
    echo "4. Get connection string"
    echo "5. Run: export MONGODB_URI='your-connection-string'"
    echo "6. Run: npm run dev"
    echo ""
    echo "Or try Docker:"
    echo "docker run -d -p 27017:27017 --name mongodb mongo:latest"
fi