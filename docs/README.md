# TMS API Documentation

This directory contains comprehensive API documentation for the Teacher Management System (TMS) with role-based access control and OTP authentication.

## 📁 Documentation Files

### Core API Documentation
- **`api-overview.yaml`** - Main API overview with all endpoints and comprehensive documentation
- **`authentication.yaml`** - Authentication system including regular login and password reset
- **`otp-auth.yaml`** - OTP-based authentication for teachers
- **`user-management.yaml`** - User management operations for super administrators
- **`roles-permissions.yaml`** - Role hierarchy and permission system

### Existing Documentation
- **`schools.yaml`** - School management operations
- **`teachers.yaml`** - Teacher management operations
- **`medical-records.yaml`** - Medical records management
- **`districts.yaml`** - District management
- **`subjects.yaml`** - Subject management
- **`religions.yaml`** - Religion management
- **`mediums.yaml`** - Medium management
- **`managementTypes.yaml`** - Management type management
- **`schoolTypes.yaml`** - School type management
- **`serviceCategories.yaml`** - Service category management
- **`blockOffices.yaml`** - Block office management
- **`locations.yaml`** - Location management
- **`uploads.yaml`** - File upload management

## 🚀 Quick Start

### 1. View Documentation
The API documentation is available at:
- **Development**: `http://localhost:5004/api/docs`
- **Production**: `https://api.tms.gov.in/api/docs`

### 2. Authentication Methods

#### Regular Login (Admin Roles)
```bash
POST /api/users/login
{
  "username": "admin",
  "password": "admin123"
}
```

#### OTP Login (Teachers)
```bash
# Step 1: Send OTP
POST /api/otp-auth/send-otp
{
  "phone": "6909701606"
}

# Step 2: Verify OTP
POST /api/otp-auth/verify-otp
{
  "phone": "6909701606",
  "otp": "123456"
}
```

### 3. Role-Based Access

#### User Roles Hierarchy
1. **Super Admin** (Level 6) - Full system access
2. **Admin** (Level 5) - Administrative access
3. **DEO** (Level 4) - District Education Officer
4. **SDEO** (Level 3) - Sub-Division Education Officer
5. **HOI** (Level 2) - Head of Institution
6. **Teacher** (Level 1) - Limited access

#### Permission Examples
- **Super Admin**: All permissions including user management
- **Admin**: School and teacher management, reports, analytics
- **DEO/SDEO/HOI**: District/sub-division/institution-level access
- **Teacher**: Own profile and medical records only

## 🔧 API Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- OTP authentication for teachers
- Password reset functionality
- Session management

### User Management
- Complete CRUD operations for users
- Role assignment and management
- User activation/deactivation
- Bulk operations support
- Search and filtering

### OTP System
- 6-digit OTP generation
- Phone number validation
- OTP expiration (5 minutes)
- Resend functionality with cooldown
- Rate limiting protection

### Data Management
- School management
- Teacher management
- Medical records handling
- Master data management
- File upload support

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Pagination
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🔒 Security

### Authentication
- JWT tokens with expiration
- Refresh token support
- CSRF protection
- Rate limiting

### Authorization
- Role-based permissions
- Resource-level access control
- API endpoint protection
- User session validation

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- Secure file uploads

## 🛠️ Development

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis (for session storage)

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tms"
JWT_SECRET="your-jwt-secret"
CORS_ORIGIN="http://localhost:3000"
PORT=5004
```

### Running the API
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## 📝 API Testing

### Using cURL
```bash
# Login
curl -X POST http://localhost:5004/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get users (with token)
curl -X GET http://localhost:5004/api/user-management/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman
1. Import the API collection
2. Set up environment variables
3. Run authentication flow
4. Test protected endpoints

## 🔍 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 📞 Support

For API support and questions:
- **Email**: support@tms.gov.in
- **Documentation**: [API Docs](http://localhost:5004/api/docs)
- **Issues**: GitHub Issues

## 📄 License

This API documentation is part of the TMS (Teacher Management System) project.

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: TMS Development Team
