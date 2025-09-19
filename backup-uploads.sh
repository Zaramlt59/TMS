#!/bin/bash

# Backup script for TMS uploads and exports
# Usage: ./backup-uploads.sh

# Set backup directory
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup filename
BACKUP_FILE="tms-backup-$DATE.tar.gz"

echo "🔄 Starting backup process..."

# Create backup of uploads and exports
tar -czf "$BACKUP_DIR/$BACKUP_FILE" uploads/ exports/

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully: $BACKUP_FILE"
    echo "📁 Backup location: $BACKUP_DIR/$BACKUP_FILE"
    
    # Get file size
    FILE_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "📊 Backup size: $FILE_SIZE"
    
    # List recent backups
    echo "📋 Recent backups:"
    ls -lh "$BACKUP_DIR"/*.tar.gz | tail -5
else
    echo "❌ Backup failed!"
    exit 1
fi

echo "🎉 Backup process completed!"
