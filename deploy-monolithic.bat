@echo off
echo 🚀 Deploying TMS Monolithic Application...
echo.

echo 📦 Installing dependencies...
call npm run install:all
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo 🔨 Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.
echo 🌐 Starting monolithic server...
echo 📍 Frontend: http://localhost:5000
echo 📊 API: http://localhost:5000/api
echo 📋 Health: http://localhost:5000/health
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
