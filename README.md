# TMS - Teacher Management System

A comprehensive monolithic application for managing school and teacher data with a modern Vue.js frontend and Express.js backend, featuring a modular API documentation system and role-based access control.

## 🏗️ Architecture

This project has been restructured into a **monolithic architecture** where both the frontend and backend are served from a single Express.js server, with a highly modular and maintainable API documentation system.

### Structure
```
TMS/
├── src/                    # Backend source code (moved from backend/src/)
├── frontend/              # Frontend Vue.js application
├── package.json           # Root package.json with combined dependencies
├── tsconfig.json          # TypeScript configuration for backend
├── deploy-monolithic.bat  # Windows deployment script
├── deploy-monolithic.sh   # Unix deployment script
└── README.md
```

### Detailed Project Structure
```
TMS/
├── 📁 src/                          # Backend source code
│   ├── 📁 controllers/              # API route controllers
│   ├── 📁 services/                 # Business logic layer
│   ├── 📁 routes/                   # API route definitions
│   ├── 📁 database/                 # Database connection & schemas
│   ├── 📁 types/                    # TypeScript type definitions
│   ├── 📁 constants/                # Application constants
│   ├── 📁 middleware/               # Express middleware
│   ├── 📁 utils/                    # Utility functions
│   ├── 📁 swagger/                  # Modular API documentation
│   │   ├── 📄 index.js              # Main Swagger entry point
│   │   ├── 📄 authentication.js     # Auth endpoints
│   │   ├── 📄 schools.js            # School management
│   │   ├── 📄 teachers.js           # Teacher management
│   │   ├── 📄 districts.js          # Geographic data
│   │   ├── 📄 reports.js            # Analytics & reporting
│   │   └── 📄 ...                   # 15+ focused modules
│   └── 📄 index.ts                  # Main server entry point
│
├── 📁 frontend/                     # Frontend Vue.js application
│   ├── 📁 src/                      # Frontend source code
│   │   ├── 📁 components/           # Reusable Vue components
│   │   ├── 📁 views/                # Page components
│   │   ├── 📁 services/             # API service layer
│   │   ├── 📁 types/                # TypeScript interfaces
│   │   ├── 📁 router/               # Vue Router configuration
│   │   ├── 📁 constants/            # Frontend constants
│   │   ├── 📁 composables/          # Vue composables
│   │   └── 📁 assests/              # Static assets
│   ├── 📁 dist/                     # Built frontend files (served by backend)
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 vite.config.ts            # Vite configuration
│   └── 📄 tailwind.config.js        # Tailwind CSS configuration
│
├── 📁 docs/                         # Additional documentation
├── 📁 dist/                         # Built backend files
├── 📄 package.json                  # Root package.json (backend + build scripts)
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # Project documentation
├── 📄 deploy-monolithic.bat         # Windows deployment script
└── 📄 deploy-monolithic.sh          # Unix deployment script
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TMS
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5004
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   NODE_ENV=development
   # Optional: Observability
   SENTRY_DSN=
   SENTRY_TRACES_SAMPLE_RATE=0.1
   SENTRY_PROFILES_SAMPLE_RATE=0.1
   ```

   For frontend Sentry, create `frontend/.env`:
   ```env
   VITE_SENTRY_DSN=
   ```

4. **Build and start the application**
   ```bash
   # Build both frontend and backend
   npm run build
   
   # Start the monolithic server
   npm start
   ```

   Or use the deployment scripts:
   - **Windows**: `deploy-monolithic.bat`
   - **Unix/Mac**: `./deploy-monolithic.sh`

## 🌐 Access Points

Once running, access your application at:
- **Frontend**: http://localhost:5004
- **API**: http://localhost:5004/api
- **API Documentation**: http://localhost:5004/api/docs (Swagger UI)
- **Health Check**: http://localhost:5004/health

## 🛡️ Authentication & Security

### Auth Flow
- **Access Token**: JWT (15 minutes) returned in JSON response
- **Refresh Token**: Random string (7 days) stored as HTTP-only cookie
- **CSRF Protection**: Uses X-CSRF-Token header for refresh requests
- **Role-Based Access**: Super Admin, Admin, and Teacher roles with granular permissions

### Security Features
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- Rate limiting and login lockout protection
- SQL injection protection
- OTP-based authentication for teachers

## 📦 Docker
```bash
docker compose up -d --build
```
App on http://localhost:5004, MySQL on 3306.

## 📚 Available Scripts

- `npm run install:all` - Install both root and frontend dependencies
- `npm run build` - Build both backend and frontend
- `npm run build:backend` - Build only the backend
- `npm run build:frontend` - Build only the frontend
- `npm start` - Start the production server
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only backend in development mode
- `npm run dev:frontend` - Start only frontend in development mode

## 🔧 Development

### Backend Development
The backend is written in TypeScript and uses Express.js. Source files are in the `src/` directory.

### Frontend Development
The frontend is a Vue.js 3 application with TypeScript, Tailwind CSS, and Vite. Source files are in the `frontend/src/` directory.

### Database
The application uses MySQL with the following main entities:
- **Schools** - Educational institutions with management types and locations
- **Teachers** - Staff members with qualifications and medical records
- **Geographic Data** - Districts, RD Blocks, Habitations, Block Offices
- **Reference Data** - Subjects, School Types, Management Types, Mediums, Religions, Service Categories
- **User Management** - Role-based access with Super Admin, Admin, and Teacher roles
- **Medical Records** - Teacher health tracking and documentation
- **Session Management** - User sessions and permissions tracking

## 🚀 Deployment

### Production Build
1. Run `npm run build` to build both frontend and backend
2. Start the server with `npm start`

### Development Mode
- **Full Stack**: `npm run dev` (runs both backend and frontend)
- **Backend Only**: `npm run dev:backend`
- **Frontend Only**: `npm run dev:frontend`

## 📖 API Documentation

The project features a **modular Swagger/OpenAPI documentation system** with 21 focused modules:

### Documentation Structure
- **62 total endpoints** across all categories
- **18 data schemas** for comprehensive type definitions
- **Organized by domain** with emoji-categorized tags
- **Interactive Swagger UI** at `/api/docs`

### Module Categories
1. **Authentication & Security** (4 modules)
   - Core authentication, OTP auth, session management, user profiles
2. **User Management** (1 module)
   - Super admin user operations
3. **Core Educational Entities** (3 modules)
   - Schools, teachers, medical records
4. **Geographic & Administrative** (4 modules)
   - Districts, RD blocks, habitations, block offices
5. **Reference Data** (6 modules)
   - Management types, school types, subjects, religions, mediums, service categories
6. **System Features** (3 modules)
   - Cascade protection, file uploads, reports & analytics

## 📱 Features

### Core Management
- **School Management**: Complete CRUD operations with location and type management
- **Teacher Management**: Staff management with qualifications and medical tracking
- **Medical Records**: Health tracking with document uploads and treatment status
- **User Management**: Role-based access control with Super Admin capabilities

### Geographic & Administrative
- **Location Management**: Hierarchical system (Districts → RD Blocks → Habitations)
- **Block Offices**: Administrative office management
- **Reference Data**: Comprehensive lookup tables for all system entities

### System Features
- **OTP Authentication**: Secure phone-based login for teachers
- **Session Management**: Advanced session tracking and permissions
- **Cascade Protection**: Safe deletion with dependency warnings
- **File Uploads**: Document management with category organization
- **Reports & Analytics**: Comprehensive reporting with export capabilities
- **Data Export**: Excel export functionality
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-friendly interface with modern UI components

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Documentation**: Swagger/OpenAPI 3.0 with modular structure
- **Security**: Helmet.js, CORS, rate limiting, input validation

### Frontend
- **Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite
- **State Management**: Vue composables
- **Routing**: Vue Router with role-based guards

### Development & Deployment
- **Build Tools**: TypeScript compiler, Vite
- **Development**: ts-node-dev, concurrently
- **Containerization**: Docker with docker-compose
- **Process Management**: PM2 for production

## 📝 Notes

### Architecture Notes
- The monolithic structure serves the frontend static files from the Express.js server
- All API endpoints are prefixed with `/api`
- Client-side routing is handled by serving `index.html` for non-API routes
- The frontend build output is served from `frontend/dist/`

### API Documentation
- **Modular Structure**: 21 focused modules instead of one large file
- **Maintainable**: Each module is 2-11 KB for easy maintenance
- **Organized**: Emoji-categorized tags for better navigation
- **Complete**: 62 endpoints with comprehensive schemas and examples
- **Interactive**: Full Swagger UI with authentication testing

### Recent Improvements
- ✅ **Modular Swagger Documentation**: Broke down 1,200+ KB monolithic spec into focused modules
- ✅ **Enhanced UI Components**: Updated button styles and modern interface design
- ✅ **Role-Based Access Control**: Granular permissions for different user types
- ✅ **OTP Authentication**: Secure phone-based login system for teachers
- ✅ **Medical Records Management**: Complete health tracking with document uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
