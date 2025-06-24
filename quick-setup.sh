#!/bin/bash
# Quick setup script for Mutual Fund App

echo "🚀 Setting up Mutual Fund App..."

# Create project structure
mkdir -p mutual-fund-app/client/src/{components,pages,context}
mkdir -p mutual-fund-app/server/{models,routes,middleware,scripts}

echo "📁 Project structure created"

# Navigate to project
cd mutual-fund-app

echo "📋 Next steps:"
echo "1. Copy all files from the code project to respective folders"
echo "2. cd server && npm install"
echo "3. Create .env file with MongoDB URI and JWT secret"
echo "4. cd ../client && npx create-react-app . && npm install react-router-dom axios"
echo "5. Replace React files with provided code"
echo "6. Start backend: npm run dev"
echo "7. Start frontend: npm start"

echo "✅ Setup script completed!"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
