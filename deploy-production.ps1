# Production deployment script for TMS
# Usage: .\deploy-production.ps1

Write-Host "🚀 Starting TMS Production Deployment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running or not installed" -ForegroundColor Red
    exit 1
}

# Check if docker-compose.yml exists
if (!(Test-Path "docker-compose.yml")) {
    Write-Host "❌ docker-compose.yml not found" -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "❌ .env file not found. Please create it with your database credentials" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-deployment checks:" -ForegroundColor Yellow

# Check if uploads directory exists
if (Test-Path "uploads") {
    Write-Host "✅ uploads directory exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating uploads directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "uploads\medical-records" -Force
}

# Check if exports directory exists
if (Test-Path "exports") {
    Write-Host "✅ exports directory exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating exports directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "exports\audit-logs" -Force
}

# Check if backups directory exists
if (Test-Path "backups") {
    Write-Host "✅ backups directory exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating backups directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "backups" -Force
}

Write-Host "`n🔄 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "🔄 Building and starting containers..." -ForegroundColor Yellow
docker-compose up -d --build

# Wait for containers to be healthy
Write-Host "⏳ Waiting for containers to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check container status
Write-Host "`n📊 Container Status:" -ForegroundColor Yellow
docker-compose ps

# Check if app is responding
Write-Host "`n🔍 Testing application health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5004/api/health" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Application is healthy and responding" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Application responded with status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not reach application health endpoint" -ForegroundColor Yellow
    Write-Host "   This might be normal if the app is still starting up" -ForegroundColor Gray
}

Write-Host "`n🎉 Deployment completed!" -ForegroundColor Green
Write-Host "📱 Application URL: http://localhost:5004" -ForegroundColor Cyan
Write-Host "📊 Monitor logs with: docker-compose logs -f app" -ForegroundColor Cyan
Write-Host "🔄 Restart with: docker-compose restart" -ForegroundColor Cyan
Write-Host "🛑 Stop with: docker-compose down" -ForegroundColor Cyan
