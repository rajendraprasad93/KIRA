# KIRA - Grievance Management System

A comprehensive platform for reporting, managing, and resolving municipal grievances. This is a full-stack application built with React (frontend) and Python FastAPI (backend), supporting multiple user roles including citizens, officers, supervisors, and workers.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Starting the Application](#starting-the-application)
- [Project Structure](#project-structure)

## 🎯 Project Overview

KIRA is a grievance management system that allows:
- **Citizens** to report issues with images and descriptions
- **Officers** to receive, manage, and resolve complaints
- **Supervisors** to oversee and track complaint handling
- **Workers** to execute resolution tasks

The system includes advanced features like:
- Image validation and forensics analysis
- Complaint routing and assignment
- Auto-fill functionality using AI vision analysis
- Real-time status tracking
- Officer SLA monitoring

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v16.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0 or higher) - Comes with Node.js
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)

### Optional APIs (for full functionality)
- **Google Generative AI API key** - for AI-powered analysis
- **Sightengine API** - for image validation
- **AWS S3 credentials** - for image storage (optional)

## 📦 Installation

### Step 1: Clone and Navigate to Project

```bash
cd KIRA
```

### Step 2: Backend Setup

#### 2.1 Create a Python Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv v

# Activate virtual environment
# On Windows:
v\Scripts\activate
# On macOS/Linux:
source v/bin/activate
```

#### 2.2 Install Backend Dependencies

```bash
# Make sure you're in the backend directory with virtual environment activated
pip install -r requirements.txt
```

**Key dependencies installed:**
- FastAPI (web framework)
- Motor (async MongoDB driver)
- PyJWT & Passlib (authentication)
- Pillow & piexif (image processing)
- google-generativeai (AI vision analysis)
- And more... (see requirements.txt)

#### 2.3 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Backend Server
HOST=0.0.0.0
PORT=8000

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=kira

# JWT/Auth
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256

# Optional: AI APIs
GEMINI_API_KEY=your-google-api-key
SIGHTENGINE_API_USER=your-sightengine-user
SIGHTENGINE_API_SECRET=your-sightengine-secret

# Optional: AWS S3
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=your-bucket-name
```

**Note:** For development, you can use mock values. The system has fallbacks.

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

```bash
# From project root
cd frontend
```

#### 3.2 Install Frontend Dependencies

```bash
npm install
```

**Key dependencies installed:**
- React 19
- React Router (navigation)
- React Hook Form (form handling)
- Tailwind CSS (styling)
- Radix UI (component library)
- Leaflet (maps)
- Axios (HTTP requests)

#### 3.3 Configure Frontend API Endpoint

The frontend expects the backend to run on `http://localhost:8000`. This is typically configured in:
- `src/services/api.js`

If you need to change the backend URL, update the API base URL in this file.

## 🚀 Starting the Application

### Option 1: Start Backend and Frontend Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server

```bash
cd backend

# Activate virtual environment (if not already activated)
# On Windows:
v\Scripts\activate
# On macOS/Linux:
source v/bin/activate

# Start the server
python run.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

The backend API will be available at: **http://localhost:8000**

**API Documentation available at:**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

#### Terminal 2 - Start Frontend Development Server

```bash
cd frontend

# Start the development server
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

The frontend will be available at: **http://localhost:3000**

### Option 2: Using npm Scripts (If Configured)

If you have scripts configured in `frontend/package.json`, you may also run:

```bash
cd frontend
npm run start
npm run dev      # If development script exists
npm run build    # To create production build
```

## 📁 Project Structure

```
KIRA/
├── backend/                      # Python FastAPI backend
│   ├── server.py                # Main FastAPI application
│   ├── models.py                # Pydantic data models
│   ├── requirements.txt          # Python dependencies
│   ├── .env                     # Environment variables
│   ├── services/                # Business logic
│   │   ├── vision_service.py    # Image analysis
│   │   ├── decision_engine.py   # Complaint routing
│   │   ├── officer_routing.py   # Officer assignment
│   │   └── ...
│   ├── utils/                   # Utility functions
│   │   └── imageForensics.py    # Image validation
│   ├── config/                  # Configuration files
│   ├── uploads/                 # Temporary file storage
│   └── v/                       # Python virtual environment
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── App.js              # Main app component
│   │   ├── pages/              # Page components
│   │   │   ├── citizen/        # Citizen portal
│   │   │   ├── officer/        # Officer portal
│   │   │   ├── supervisor/     # Supervisor portal
│   │   │   └── worker/         # Worker portal
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API services
│   │   ├── contexts/           # React contexts
│   │   └── hooks/              # Custom hooks
│   ├── package.json            # Node dependencies
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── public/                 # Static assets
│
├── tests/                       # Test files
├── README.md                    # This file
└── SETUP_WORKING_CONFIG.md     # Configuration help
```

## ✨ Initial Setup Checklist

- [ ] MongoDB is running
- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend `.env` file configured
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server started (`python run.py` - listening on port 8000)
- [ ] Frontend development server started (`npm start` - listening on port 3000)
- [ ] Can access http://localhost:3000 in browser

## 🔧 Troubleshooting

### Backend Issues

**ModuleNotFoundError or ImportError:**
```bash
# Make sure virtual environment is activated
# Windows:
v\Scripts\activate
# Then reinstall:
pip install -r requirements.txt
```

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URL in .env file
- Default: `mongodb://localhost:27017`

**Port Already in Use:**
```bash
# Change PORT in .env file or command line:
python run.py --port 8001
```

### Frontend Issues

**npm install fails:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**CORS Errors:**
- Ensure backend is running on http://localhost:8000
- Check API base URL in `src/services/api.js`

**Port 3000 Already in Use:**
```bash
# Use a different port
PORT=3001 npm start
```

## 📚 Additional Resources

- [Backend Setup Guide](./SETUP_WORKING_CONFIG.md)
- [Contracts/API Documentation](./contracts.md)
- [Officer Portal Phase 1](./OFFICER_PORTAL_PHASE1_COMPLETE.md)
- [Officer Portal Phase 3](./OFFICER_PORTAL_PHASE3_COMPLETE.md)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review existing documentation files
3. Check backend logs in terminal
4. Check browser console (F12) for frontend errors
