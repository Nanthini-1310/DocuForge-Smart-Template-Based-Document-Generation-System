# DocuForge Backend - Node.js + Express + MongoDB Atlas

A production-ready Node.js backend for the DocuForge application using Express.js and MongoDB Atlas with the official MongoDB driver.

## 🚀 Architecture

- **Runtime**: Node.js 16+
- **Server**: Express.js
- **Database**: MongoDB Atlas (official mongodb driver)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
- **Password Security**: bcryptjs
- **Environment**: dotenv

## ✨ Features

- ✅ Direct MongoDB Atlas connection (no Data API)
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcryptjs
- ✅ User registration and login
- ✅ User session management
- ✅ CORS enabled for React frontend
- ✅ Error handling and validation
- ✅ Development mode with nodemon

## 📁 Project Structure

```
project-root/
├── server.js                    # Main Express server entry point
├── package.json                 # Dependencies and scripts
├── .env                        # Environment variables
├── config/
│   └── db.js                   # MongoDB connection setup
├── controllers/
│   └── authController.js       # Authentication logic
├── middleware/
│   └── auth.js                 # JWT verification middleware
├── models/
│   └── userModel.js            # User database operations
├── routes/
│   └── auth.js                 # Auth API routes
└── utils/
    └── validation.js           # Email and password validation
```

## 🔧 Installation

### 1. Prerequisites

- Node.js 16 or higher
- MongoDB Atlas account with a database
- Git (optional)

### 2. Clone/Download Project

```bash
cd "c:\Users\LENOVO\Downloads\My new app"
```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages:
- `express` - Web server framework
- `mongodb` - Official MongoDB driver
- `dotenv` - Environment variable management
- `cors` - Cross-Origin Resource Sharing
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `cookie-parser` - Cookie middleware
- `nodemon` - Development auto-reload (dev dependency)

## 🗄️ MongoDB Setup

### MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create/Login to your account
3. Select your cluster
4. Click "Connect" → "Drivers" → "Node.js"
5. Copy the connection string

The connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/
```

### Database & Collection

- **Database Name**: `docuforge`
- **Collection Name**: `docforge`
- **Schema**: User documents with fields:
  - `email` (string) - User email address
  - `passwordHash` (string) - Bcrypt hashed password
  - `name` (string, optional) - User full name
  - `createdAt` (date) - Account creation timestamp
  - `_id` (ObjectId) - MongoDB automatic ID

## 🔐 Environment Variables

Create `.env` file in the project root with these variables:

```env
# Node Environment
NODE_ENV=development

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Database Configuration
DB_NAME=docuforge
DB_COLLECTION=docforge

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES=7d

# Logging Level
LOG_LEVEL=debug
```

### Important Security Notes

- **JWT_SECRET**: Change this to a random string in production (use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- **MONGO_URI**: Keep this confidential, never commit it to version control
- **NODE_ENV**: Set to `production` in production environment
- **FRONTEND_URL**: Update to your deployed frontend URL in production

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Production Mode

```bash
npm run production
```

Or set `NODE_ENV=production` and run:

```bash
npm start
```

## 📊 API Endpoints

### Health Check

**GET** `/api/health`

Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Database Status

**GET** `/api/db-status`

Check MongoDB connection status.

**Response:**
```json
{
  "status": "connected",
  "message": "Connected to MongoDB"
}
```

### Register User

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe" // Optional
}
```

**Response (201 Created):**
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

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Error Response (400):**
```json
{
  "error": "Password must be at least 8 characters long"
}
```

### Login User

**POST** `/api/auth/login`

Login with email and password. Sets JWT token in HTTP-only cookie.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
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

**Headers Sent:**
```
Set-Cookie: authToken=<JWT_TOKEN>; HttpOnly; Secure; SameSite=Strict
```

**Error Response (401):**
```json
{
  "error": "Invalid email or password"
}
```

### Get Current User

**GET** `/api/users/me`

Requires authentication (JWT token in cookie).

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Error Response (401):**
```json
{
  "error": "No authentication token"
}
```

### Logout User

**POST** `/api/logout`

Logout user and clear authentication cookie.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Get Current User
curl -X GET http://localhost:5000/api/users/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:5000/api/logout \
  -b cookies.txt
```

### Using Postman

1. Import endpoints into Postman
2. For authenticated endpoints, enable "Cookie" in the request
3. Send login request first to set the "authToken" cookie
4. Use that cookie for subsequent authenticated requests

### Using REST Client (VS Code)

```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123",
  "name": "Test User"
}

### Login User
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123"
}

### Get Current User
GET http://localhost:5000/api/users/me

### Logout
POST http://localhost:5000/api/logout
```

## 🔍 Viewing Data in MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Connect with your MongoDB Atlas connection string
3. Navigate to: `docuforge` → `docforge` collection
4. View all user documents with their data

## 🛠️ Common Tasks

### Check Server Status

```bash
curl http://localhost:5000/api/health
```

### Check Database Connection

```bash
curl http://localhost:5000/api/db-status
```

### View Active Port

```bash
# Windows (PowerShell)
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000
```

### Kill Process on Port 5000

```bash
# Windows (PowerShell - Admin)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess

# macOS/Linux
kill -9 $(lsof -t -i:5000)
```

## 🚨 Troubleshooting

### "Cannot find module" error

```bash
npm install
```

### "MongoDB connection failed"

- Check your MONGO_URI in `.env`
- Verify MongoDB Atlas cluster is running
- Ensure IP whitelist includes your computer (Atlas → Network Access)
- Check credentials in connection string

### "Port 5000 already in use"

Change PORT in `.env` or kill the process using port 5000.

### "JWT verification failed"

- Ensure JWT_SECRET is consistent
- Check cookie is being sent with requests (use `credentials: 'include'`)
- Verify token hasn't expired (default 7 days)

### "CORS error from frontend"

- Update FRONTEND_URL in `.env` to match your React app URL
- Ensure credentials are sent in fetch requests

## 📦 Package.json Scripts

```bash
npm start          # Run in production mode
npm run dev        # Run with auto-reload (development)
npm run production # Run with NODE_ENV=production
npm run test       # Placeholder for tests
npm run lint       # Placeholder for linting
```

## 🔐 Security Best Practices

✅ Use HTTPS in production (`secure: true` for cookies)
✅ Keep JWT_SECRET strong and random
✅ Never commit `.env` to version control
✅ Use environment variables for sensitive data
✅ Hash passwords with bcryptjs (10 salt rounds)
✅ Validate input on both frontend and backend
✅ Use HTTP-only cookies for tokens
✅ Set SameSite=Strict for CSRF protection
✅ Implement rate limiting (future enhancement)
✅ Log security events

## 🚀 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.com

# Deploy
git push heroku main
```

### Deploy to Vercel (Node.js runtime)

Use `@vercel/node` adapter and configure `vercel.json`.

### Deploy to Railway/Render

Push your code and configure environment variables in the dashboard.

## 📝 License

ISC

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review environment variables
3. Check MongoDB Atlas connection
4. Review logs in the terminal

## ✅ Verification Checklist

Before going to production:

- [ ] MongoDB Atlas cluster created and connected
- [ ] Environment variables set correctly
- [ ] JWT_SECRET changed from default
- [ ] Front-end URL update in CORS config
- [ ] Server starts without errors
- [ ] Registration endpoint working
- [ ] Login endpoint working
- [ ] User data visible in MongoDB Compass
- [ ] Authentication middleware protecting endpoints
- [ ] Logout clearing cookies properly
- [ ] Error handling working for edge cases
- [ ] HTTPS enabled in production

---

**Last Updated**: 2026-02-21
**Status**: Production Ready ✅
