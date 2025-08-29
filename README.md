# 🏫 TTMS - Teacher and School Management System

## **Production-Ready School Management Solution**

A comprehensive web-based system for managing teachers, schools, and educational data with a modern Vue.js frontend and Node.js backend.

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ LTS
- MySQL 8.0+
- Modern web browser

### **Installation**
```bash
# Clone the repository
git clone <your-repo-url>
cd TTMS-0.1

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **Configuration**
1. Copy `.env.example` to `.env` in backend directory
2. Update database credentials in `.env`
3. Create database and run schema: `mysql -u user -p database < src/database/schema.sql`

### **Running the Application**
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

---

## 🏗️ **Architecture**

### **Frontend**
- **Framework**: Vue.js 3 (Composition API)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Build Tool**: Vite

### **Backend**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Architecture**: Controller-Service pattern
- **Database**: MySQL with connection pooling
- **Validation**: Express-validator

### **Database**
- **Engine**: MySQL 8.0+
- **Schema**: Normalized relational design
- **Features**: Audit trails, foreign key constraints

---

## 📊 **Features**

### **School Management**
- ✅ Add, edit, delete schools
- ✅ Location-based organization
- ✅ School type and level management
- ✅ Contact information tracking

### **Teacher Management**
- ✅ Complete teacher profiles
- ✅ Subject and class assignments
- ✅ Posting and deputation history
- ✅ Professional development tracking

### **Master Data Management**
- ✅ Districts, RD Blocks, Habitations
- ✅ Subjects, Classes, Mediums
- ✅ School Types, Management Types
- ✅ Religions and Social Groups

### **Data Operations**
- ✅ Advanced search and filtering
- ✅ Excel export functionality
- ✅ Pagination and sorting
- ✅ Data validation and integrity

---

## 🔧 **Production Deployment**

### **Backend Deployment**
```bash
# Build for production
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Frontend Deployment**
```bash
# Build for production
npm run build

# Serve with Nginx
# Copy dist/ contents to web server
```

### **Environment Variables**
```env
# Database
DB_HOST=localhost
DB_USER=ttms_user
DB_PASSWORD=your_password
DB_NAME=ttms_db
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=production
JWT_SECRET=your_secret_key
```

---

## 📁 **Project Structure**

```
TTMS-0.1/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── database/       # Database schema
│   │   └── types/          # TypeScript interfaces
│   ├── scripts/            # Production scripts
│   └── package.json
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript interfaces
│   └── package.json
├── development/            # Development tools
├── USER-GUIDE.md          # End-user documentation
└── README.md              # This file
```

---

## 🛠️ **Development**

### **Available Scripts**
```bash
# Backend
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production build

# Frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### **Code Quality**
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Controller-Service architecture

---

## 📚 **Documentation**

- **[USER-GUIDE.md](./USER-GUIDE.md)** - Complete user manual
- **[Backend Scripts](./backend/scripts/README.md)** - Production scripts guide
- **API Documentation** - Available at `/api/docs` when running

---

## 🔒 **Security Features**

- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- JWT authentication (ready for implementation)
- Audit trail logging

---

## 📈 **Performance**

- Database connection pooling
- Efficient query optimization
- Frontend code splitting
- Static asset caching
- Responsive design

---

## 🚨 **Troubleshooting**

### **Common Issues**
1. **Database Connection**: Check credentials and network
2. **Port Conflicts**: Ensure ports 3000 and 5000 are free
3. **Build Errors**: Clear node_modules and reinstall

### **Getting Help**
- Check the user guide for common solutions
- Review application logs
- Contact system administrator

---

## 🤝 **Contributing**

1. Follow the existing code structure
2. Use TypeScript for new features
3. Test thoroughly before submitting
4. Update documentation as needed

---

## 📄 **License**

This project is proprietary software. All rights reserved.

---

## 🏆 **Support**

- **Documentation**: See USER-GUIDE.md
- **Technical Issues**: Contact development team
- **User Training**: Available upon request

---

**🎉 TTMS - Your Complete School Management Solution!**

---

*Last Updated: August 2024*  
*Version: 1.0*  
*System: TTMS - Teacher and School Management System*
