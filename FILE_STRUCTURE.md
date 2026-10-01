# 🚀 DocuForge Backend - File Structure & API Reference

## 📂 Complete File Organization

```
c:\Users\LENOVO\Downloads\My new app\
│
├── 📄 server.js
│   └── Main Express server with all routes and middleware
│       - Starts on PORT 5000
│       - Connects to MongoDB on startup
│       - Registers all API routes
│       - Handles CORS, cookies, JSON parsing
│
├── 📄 package.json
│   └── Dependencies and npm scripts
│       - express: Web server framework
│       - mongodb: Database driver
│       - jsonwebtoken: JWT generation
│       - bcryptjs: Password hashing
│       - cors, cookie-parser, dotenv
│       - nodemon: Development auto-reload
│
├── 📄 .env
│   └── Environment configuration (KEEP PRIVATE!)
│       - MONGO_URI: MongoDB connection string
│       - JWT_SECRET: Token signing key
│       - PORT, NODE_ENV, FRONTEND_URL
│
├── 📂 config/
│   └── db.js
│       ├── connectDB() - Establish MongoDB connection
│       ├── getDB() - Get database instance
│       ├── getCollection() - Get collection reference
│       └── disconnectDB() - Close connection
│
├── 📂 controllers/
│   └── authController.js
│       ├── register() - Create new user account
│       ├── login() - Authenticate user
│       ├── getCurrentUser() - Fetch user by token
│       ├── logout() - Clear authentication
│       └── generateToken() - Create JWT
│
├── 📂 middleware/
│   └── auth.js
│       └── verifyToken() - Validate JWT from cookies
│
├── 📂 models/
│   └── userModel.js
│       ├── create() - Insert new user
│       ├── findByEmail() - Query user by email
│       ├── findById() - Query user by ID
│       ├── findAll() - Get all users
│       ├── update() - Modify user data
│       └── deleteUser() - Remove user
│
├── 📂 routes/
│   └── auth.js
│       ├── POST /register - New user
│       ├── POST /login - User login
│       └── POST /logout - User logout
│
├── 📂 utils/
│   └── validation.js
│       ├── validateEmail() - Check email format
│       └── validatePassword() - Check password strength
│
├── 📂 src/react-app/ (Frontend)
│   ├── App.tsx - Main routing
│   ├── main.tsx - App entry point
│   ├── pages/
│   │   ├── Login.tsx ✅ Updated
│   │   ├── Register.tsx ✅ Updated
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   └── CreateDocument.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx ✅ Updated
│   └── components/
│       └── ui/ (Shadcn-ui components)
│
├── 📄 BACKEND_README.md ✅ NEW
│   └── Complete backend documentation
│       - Installation guide
│       - API endpoint reference
│       - Testing instructions
│       - Troubleshooting
│       - Deployment guide
│
└── 📄 CONVERSION_SUMMARY.md ✅ NEW
    └── This conversion summary
        - Changes made
        - Quick start
        - Architecture overview
```

## 🔌 API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Create new user |
| POST | `/api/auth/login` | ❌ | Authenticate user |
| GET | `/api/users/me` | ✅ | Get current user |
| POST | `/api/logout` | ❌ | Clear session |
| GET | `/api/health` | ❌ | Health check |
| GET | `/api/db-status` | ❌ | Database status |

## 📊 Database Schema

**Collection**: `docforge` in `docuforge` database

**User Document Structure**:
```javascript
{
  _id: ObjectId,              // Auto-generated MongoDB ID
  email: String,              // Unique email address
  passwordHash: String,       // Bcrypt hashed password
  name: String (optional),    // User full name
  createdAt: Date             // Account creation timestamp
}
```

**Indexes**:
- `_id` (automatic)
- `email` (unique, recommended)

## 🔄 Request/Response Flow

### Registration Example:
```
REQUEST:
POST /api/auth/register HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "Jane Doe"
}

RESPONSE (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}

COOKIE SET:
Set-Cookie: authToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
```

### Login Example:
```
REQUEST:
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

RESPONSE (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}

COOKIE SET:
Set-Cookie: authToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict
```

### Get Current User Example:
```
REQUEST:
GET /api/users/me HTTP/1.1
Cookie: authToken=eyJhbGc...

RESPONSE (200 OK):
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "Jane Doe"
}

ERROR (401 Unauthorized):
{
  "error": "No authentication token"
}
```

## 🔐 Password Requirements

- **Minimum length**: 8 characters
- **Uppercase**: At least 1 (A-Z)
- **Lowercase**: At least 1 (a-z)
- **Numbers**: At least 1 (0-9)

**Valid Examples**:
- ✅ `SecurePass123`
- ✅ `MyPassword456`
- ✅ `TestPass789`

**Invalid Examples**:
- ❌ `password` (no uppercase/numbers)
- ❌ `Pass1` (too short)
- ❌ `PASS1234` (no lowercase)

## 🎯 Key Files to Know

### Must Edit:
- `.env` - Add your MongoDB URI and JWT secret

### Important to Understand:
- `server.js` - Main server configuration
- `config/db.js` - Database connection logic
- `models/userModel.js` - User database operations

### Safe to Ignore:
- `node_modules/` - Dependencies (auto-generated)
- `.git/` - Version control (if using Git)
- `package-lock.json` - Dependency lock file

## 🚀 Quick Command Reference

```bash
# Install dependencies
npm install

# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process on port 5000 (Windows)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
```

## 🌐 Frontend Integration

React pages that work with this backend:
- ✅ `src/react-app/pages/Login.tsx` - Uses `/api/auth/login`
- ✅ `src/react-app/pages/Register.tsx` - Uses `/api/auth/register`
- ✅ `src/react-app/contexts/AuthContext.tsx` - Calls `/api/users/me` and `/api/logout`

All frontend API calls use:
```javascript
fetch('/api/...', {
  credentials: 'include'  // Include cookies
})
```

## ⚙️ Environment Variables Explained

```env
# Server runs on this port
PORT=5000

# MongoDB connection (from MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Database name in MongoDB
DB_NAME=docuforge

# Collection name in MongoDB
DB_COLLECTION=docforge

# Secret key for signing JWT tokens (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# How long JWT tokens are valid
JWT_EXPIRES=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# development or production
NODE_ENV=development

# Logging detail level
LOG_LEVEL=debug
```

## 🐛 Debugging Tips

### Check Server is Running:
```bash
curl http://localhost:5000/api/health
```

### Check Database Connection:
```bash
curl http://localhost:5000/api/db-status
```

### View Request Logs:
- Look at terminal output while server is running
- Format: `TIMESTAMP METHOD PATH`

### Check User Data in Database:
1. Open MongoDB Compass
2. Connect with your MONGO_URI
3. Navigate to `docuforge` → `docforge` collection
4. View/edit user documents

### View Cookies in Browser:
1. Open DevTools (F12)
2. Go to Application tab
3. Cookies → http://localhost:3000
4. Look for `authToken` cookie

## 📈 Performance Considerations

✅ **Connection Pooling**: MongoDB driver pools connections (default 10)
✅ **Cookie-based Auth**: No session database needed
✅ **Stateless API**: Can scale horizontally
✅ **Password Hashing**: Async (bcryptjs uses 10 rounds)
✅ **JWT Validation**: Fast cryptographic verification

## 🔒 Security Checklist

Before deploying:
- [ ] Change JWT_SECRET to random 32-char string
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL in production
- [ ] Update FRONTEND_URL to production URL
- [ ] Add rate limiting (future feature)
- [ ] Review CORS origins
- [ ] Never commit .env to git
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB IP whitelist

---

**Last Updated**: 2026-02-21
**Backend Status**: ✅ Production Ready
