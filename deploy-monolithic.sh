#!/bin/bash

echo "🚀 Deploying TMS Monolithic Application..."
echo

echo "📦 Installing dependencies..."
npm run install:all
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🔨 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo
echo "🌐 Starting monolithic server..."
echo "📍 Frontend: http://localhost:5000"
echo "📊 API: http://localhost:5000/api"
echo "📋 Health: http://localhost:5000/health"
echo
echo "Press Ctrl+C to stop the server"
echo

npm start
