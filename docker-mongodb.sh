#!/bin/bash

echo "🐳 Setting up MongoDB with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first:"
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Stop and remove existing MongoDB container if it exists
echo "🧹 Cleaning up existing MongoDB container..."
docker stop mongodb 2>/dev/null || true
docker rm mongodb 2>/dev/null || true

# Run MongoDB container
echo "🚀 Starting MongoDB container..."
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Wait for MongoDB to start
echo "⏳ Waiting for MongoDB to start..."
sleep 10

# Check if container is running
if docker ps | grep -q mongodb; then
    echo "✅ MongoDB is running in Docker!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Run: cd server && npm run seed"
    echo "2. Run: npm run dev"
    echo "3. Open: http://localhost:3000"
    echo ""
    echo "🔑 Admin login:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "📝 To stop MongoDB later:"
    echo "   docker stop mongodb"
    echo ""
    echo "📝 To start MongoDB again:"
    echo "   docker start mongodb"
else
    echo "❌ Failed to start MongoDB container"
    docker logs mongodb
fi