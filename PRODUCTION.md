# 🚀 TMS Production Deployment Guide

## 📋 Prerequisites

- Docker and Docker Compose installed
- `.env` file configured with database credentials
- At least 2GB free disk space for uploads and backups

## 🚀 Quick Deployment

### 1. **Deploy to Production**
```bash
# Windows PowerShell
.\deploy-production.ps1

# Linux/Mac
chmod +x deploy-production.sh
./deploy-production.sh
```

### 2. **Manual Deployment**
```bash
# Stop existing containers
docker-compose down

# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps
```

## 📁 Directory Structure

```
TMS/
├── uploads/                 # Medical documents (persistent)
│   └── medical-records/
├── exports/                 # Audit log exports (persistent)
│   └── audit-logs/
├── backups/                 # Backup files (persistent)
├── docker-compose.yml       # Production configuration
└── .env                     # Environment variables
```

## 🔧 Configuration

### **Environment Variables (.env)**
```env
# Database
DB_HOST=db
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=ttms_db
DB_PORT=3306

# Application
NODE_ENV=production
PORT=5004
CORS_ORIGIN=http://localhost:3000

# Audit
AUDIT_RETENTION_DAYS=90
AUDIT_ARCHIVE_IMPORTANT=true
```

### **Docker Volumes**
- `./uploads:/app/uploads` - Medical documents
- `./exports:/app/exports` - Audit log exports
- `./.env:/app/.env:ro` - Environment variables

## 📊 Monitoring

### **Check Application Health**
```bash
# Check container status
docker-compose ps

# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f db

# Test API endpoint
curl http://localhost:5004/api/health
```

### **Disk Usage**
```bash
# Check uploads directory size
du -sh uploads/

# Check exports directory size
du -sh exports/

# Check backups directory size
du -sh backups/
```

## 💾 Backup & Recovery

### **Automatic Backup**
```bash
# Windows PowerShell
.\backup-uploads.ps1

# Linux/Mac
./backup-uploads.sh
```

### **Manual Backup**
```bash
# Create backup
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/ exports/

# Restore from backup
tar -xzf backup-20240101.tar.gz
```

### **Backup Schedule (Cron)**
```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * /path/to/backup-uploads.sh
```

## 🔒 Security

### **File Access**
- Medical documents: `/uploads/medical-records/`
- Audit exports: `/exports/audit-logs/`
- Backups: `/backups/`

### **Permissions**
```bash
# Set proper permissions
chmod 755 uploads/
chmod 755 exports/
chmod 755 backups/
```

## 🚨 Troubleshooting

### **Container Won't Start**
```bash
# Check logs
docker-compose logs app

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

### **Database Connection Issues**
```bash
# Check database container
docker-compose logs db

# Restart database
docker-compose restart db
```

### **File Upload Issues**
```bash
# Check uploads directory permissions
ls -la uploads/

# Check disk space
df -h
```

### **Performance Issues**
```bash
# Check container resources
docker stats

# Check database performance
docker-compose exec db mysql -u root -p -e "SHOW PROCESSLIST;"
```

## 📈 Scaling

### **Multiple Instances**
```yaml
# docker-compose.yml
services:
  app:
    deploy:
      replicas: 3
    volumes:
      - nfs_uploads:/app/uploads  # Use NFS for shared storage
```

### **Load Balancer**
```yaml
# Add nginx service
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
```

## 🔄 Updates

### **Application Updates**
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### **Database Migrations**
```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy
```

## 📞 Support

- **Application URL**: http://localhost:5004
- **API Documentation**: http://localhost:5004/api-docs
- **Health Check**: http://localhost:5004/api/health

## 🎯 Production Checklist

- [ ] Docker volumes configured
- [ ] Environment variables set
- [ ] Backup script tested
- [ ] Health checks working
- [ ] File uploads working
- [ ] Audit logs exporting
- [ ] Monitoring in place
- [ ] Security measures applied
- [ ] Backup schedule configured
- [ ] Documentation updated
