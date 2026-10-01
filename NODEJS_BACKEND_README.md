# DocuForge Backend - Node.js + Express + MongoDB

A production-ready backend server for DocuForge using Node.js, Express, and MongoDB Atlas.

## 🎯 Overview

- **Framework**: Express.js
- **Database**: MongoDB Atlas (official mongodb driver)
- **Authentication**: JWT-ready with bcryptjs password hashing
- **Environment**: Node.js 16+
- **Architecture**: Clean separation of routes, controllers, and models

## 📁 Project Structure

```
docuforge-backend/
├── server.js                    # Main entry point
├── config/
│   └── db.js                   # MongoDB connection setup
├── routes/
│   └── auth.js                 # Authentication routes
├── controllers/
│   └── authController.js       # Auth business logic
├── models/
│   └── userModel.js            # User database operations
├── utils/
│   └── validation.js           # Input validation utilities
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit `.env` file with your MongoDB Atlas credentials:

```plaintext
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB Atlas URI
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Database Configuration
DB_NAME=docuforge
DB_COLLECTION=docforge
```

**Get your MONGO_URI from MongoDB Atlas:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Connect" on your cluster
3. Choose "Drivers" → "Node.js"
4. Copy the connection string
5. Replace `<password>` with your database password

### 3. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 4. Start Production Server

```bash
npm start
```

Or with environment variable:

```bash
NODE_ENV=production npm start
```

## 📚 API Endpoints

### Health Check
```
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Database Status
```
GET /api/db-status
```

Response:
```json
{
  "status": "connected",
  "message": "Connected to MongoDB"
}
```

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## 🗄️ MongoDB Database Schema

### Database: `docuforge`
### Collection: `docforge`

User Document Structure:
```javascript
{
  _id: ObjectId,
  email: "user@example.com",    // String, lowercase, unique
  passwordHash: "$2b$10...",    // bcrypt hashed password
  name: "John Doe",             // String, optional
  createdAt: 2024-02-21T...     // ISO DateTime
}
```

## 🔐 Password Requirements

Passwords must contain:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

Example valid password: `SecurePass123`

## 🧪 Testing with cURL

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Database Connection
```bash
curl http://localhost:5000/api/db-status
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

## 📊 View Data in MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Connect with your MongoDB URI
3. Navigate to: `docuforge` → `docforge`
4. See all registered users

## 🛠️ Development

### Scripts

- `npm run dev` - Start with nodemon (auto-restart on changes)
- `npm start` - Start production server
- `npm run production` - Start with NODE_ENV=production
- `npm run lint` - Run linter (placeholder)
- `npm test` - Run tests (placeholder)

### File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Express app initialization, middleware setup, error handling |
| `config/db.js` | MongoDB connection management, database utilities |
| `routes/auth.js` | Route definitions for authentication endpoints |
| `controllers/authController.js` | Business logic for register and login |
| `models/userModel.js` | MongoDB operations (CRUD) for users |
| `utils/validation.js` | Email and password validation functions |
| `.env` | Environment variables (sensitive data) |

## 📦 Dependencies

- **express** - Web framework
- **mongodb** - Official MongoDB driver
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **bcryptjs** - Password hashing library

### Dev Dependencies

- **nodemon** - Auto-restart server during development

## 🔗 Integration Points

### Frontend Integration

Update your frontend's API base URL:

```javascript
const API_BASE = 'http://localhost:5000/api';

// Register
fetch(`${API_BASE}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name })
});

// Login
fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### CORS Configuration

The server is configured to accept requests from `http://localhost:3000` in development.

For production, update `FRONTEND_URL` in `.env`:

```plaintext
FRONTEND_URL=https://yourdomain.com
```

## 🐛 Troubleshooting

### MongoDB Connection Failed

**Error**: `MONGO_URI environment variable is not set`
- Solution: Make sure `.env` file exists with `MONGO_URI` configured

**Error**: `connect ECONNREFUSED`
- Solution: Check MongoDB Atlas cluster is active and firewall allows your IP

**Error**: `authentication failed - bad auth`
- Solution: Verify MongoDB username and password in connection string

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`
- Solution: Kill process using port 5000 or set different PORT in `.env`

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS`
- Solution: Update `FRONTEND_URL` in `.env` to match your frontend URL

## 📝 Environment Variables Reference

```plaintext
# Required
MONGO_URI=                         # MongoDB Atlas connection string

# Optional (has defaults)
NODE_ENV=development               # development | production
PORT=5000                         # Server port
FRONTEND_URL=http://localhost:3000 # For CORS
DB_NAME=docuforge                 # Database name
DB_COLLECTION=docforge            # Collection name
LOG_LEVEL=debug                   # Logging level
```

## 🚀 Deployment

### Deploy to Heroku

1. Create `Procfile`:
```
web: npm start
```

2. Set environment variables:
```bash
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set NODE_ENV=production
```

3. Deploy:
```bash
git push heroku main
```

### Deploy to Railway / Render / etc.

1. Push code to GitHub
2. Connect repo to hosting platform
3. Set environment variables in platform dashboard
4. Platform auto-deploys on push

## 📞 API Error Responses

### 400 - Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 409 - Conflict
```json
{
  "error": "User with this email already exists"
}
```

### 401 - Unauthorized
```json
{
  "error": "Invalid email or password"
}
```

### 500 - Server Error
```json
{
  "error": "Registration failed",
  "message": "Internal server error details"
}
```

## 🎓 Next Steps

1. ✅ Start dev server: `npm run dev`
2. ✅ Test endpoints with cURL or Postman
3. ✅ Verify data in MongoDB Compass
4. ⏳ Add JWT token authentication (optional)
5. ⏳ Add email verification (optional)
6. ⏳ Add password reset functionality (optional)
7. ⏳ Add rate limiting and security headers
8. ⏳ Add logging system
9. ⏳ Add database transaction support
10. ⏳ Deploy to production

## 📖 Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Node Driver Docs](https://www.mongodb.com/docs/drivers/node/)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [bcryptjs Docs](https://www.npmjs.com/package/bcryptjs)
- [dotenv Docs](https://www.npmjs.com/package/dotenv)

## 📄 License

ISC

---

**Last Updated**: February 21, 2026
**Status**: Production Ready ✅
