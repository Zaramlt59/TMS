# PowerShell backup script for TMS uploads and exports
# Usage: .\backup-uploads.ps1

# Set backup directory
$BACKUP_DIR = "backups"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"

# Create backup directory if it doesn't exist
if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR
}

# Create backup filename
$BACKUP_FILE = "tms-backup-$DATE.zip"

Write-Host "🔄 Starting backup process..." -ForegroundColor Yellow

try {
    # Create backup of uploads and exports
    Compress-Archive -Path "uploads", "exports" -DestinationPath "$BACKUP_DIR\$BACKUP_FILE" -Force
    
    Write-Host "✅ Backup completed successfully: $BACKUP_FILE" -ForegroundColor Green
    Write-Host "📁 Backup location: $BACKUP_DIR\$BACKUP_FILE" -ForegroundColor Cyan
    
    # Get file size
    $FILE_SIZE = (Get-Item "$BACKUP_DIR\$BACKUP_FILE").Length
    $FILE_SIZE_MB = [math]::Round($FILE_SIZE / 1MB, 2)
    Write-Host "📊 Backup size: $FILE_SIZE_MB MB" -ForegroundColor Cyan
    
    # List recent backups
    Write-Host "📋 Recent backups:" -ForegroundColor Yellow
    Get-ChildItem "$BACKUP_DIR\*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 5 | Format-Table Name, LastWriteTime, @{Name="Size(MB)";Expression={[math]::Round($_.Length / 1MB, 2)}} -AutoSize
    
} catch {
    Write-Host "❌ Backup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Backup process completed!" -ForegroundColor Green
