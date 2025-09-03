# TMS - Teacher Management System

A comprehensive monolithic application for managing school and teacher data with a modern Vue.js frontend and Express.js backend.

## 🏗️ Architecture

This project has been restructured into a **monolithic architecture** where both the frontend and backend are served from a single Express.js server.

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
│   │   └── 📁 assests/              # Static assets
│   ├── 📁 dist/                     # Built frontend files (served by backend)
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 vite.config.ts            # Vite configuration
│   └── 📄 tailwind.config.js        # Tailwind CSS configuration
│
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
## 🛡️ Auth Flow
- Access token (JWT, 15m) returned in JSON; frontend sends in Authorization header.
- Refresh token (random, 7d) stored as HTTP-only cookie; refresh uses CSRF header (X-CSRF-Token).
- Logout revokes refresh token and clears cookies.

## 📦 Docker
```bash
docker compose up -d --build
```
App on http://localhost:5004, MySQL on 3306.

Once running, access your application at:
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

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
- Schools
- Teachers
- Districts
- RD Blocks
- Villages
- Subjects
- School Types
- Management Types
- Mediums
- Religions

## 🚀 Deployment

### Production Build
1. Run `npm run build` to build both frontend and backend
2. Start the server with `npm start`

### Development Mode
- **Full Stack**: `npm run dev` (runs both backend and frontend)
- **Backend Only**: `npm run dev:backend`
- **Frontend Only**: `npm run dev:frontend`

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- Rate limiting
- SQL injection protection

## 📱 Features

- **School Management**: CRUD operations for schools
- **Teacher Management**: CRUD operations for teachers
- **Location Management**: Hierarchical location system (Districts → RD Blocks → Villages)
- **Data Export**: Excel export functionality
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, TypeScript, MySQL
- **Frontend**: Vue.js 3, TypeScript, Tailwind CSS, Vite
- **Database**: MySQL
- **Build Tools**: TypeScript compiler, Vite
- **Development**: ts-node-dev, concurrently

## 📝 Notes

- The monolithic structure serves the frontend static files from the Express.js server
- All API endpoints are prefixed with `/api`
- Client-side routing is handled by serving `index.html` for non-API routes
- The frontend build output is served from `frontend/dist/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
