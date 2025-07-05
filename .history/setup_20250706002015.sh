#!/bin/bash

# SangeetX Setup Script
# This script will help you set up the SangeetX music streaming platform

echo "🎵 Welcome to SangeetX Setup!"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to 18.0.0 or later."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file
if [ ! -f ".env.local" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Environment file created (.env.local)"
    echo "⚠️  Please edit .env.local with your configuration"
else
    echo "✅ Environment file already exists"
fi

# Create uploads directory
mkdir -p public/uploads
echo "✅ Created uploads directory"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your cloud storage credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed setup instructions, see docs/SETUP.md"
echo ""
echo "Cloud Storage Options:"
echo "- Cloudinary (Recommended): https://cloudinary.com"
echo "- Firebase Storage: https://firebase.google.com"
echo "- AWS S3: https://aws.amazon.com/s3/"
echo "- Supabase: https://supabase.com"
echo ""
echo "Happy coding! 🎵"
