#!/bin/bash

# Ghumo Jaipur - Full Stack Setup Script

echo "🎉 Starting Ghumo Jaipur Full Stack Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node -v)"

# Install Backend Dependencies
echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Install Frontend Dependencies
echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Make sure MongoDB is running (mongod)"
echo "2. In terminal 1: cd backend && npm run dev"
echo "3. In terminal 2: cd frontend && npm run dev"
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo "=========================================="
