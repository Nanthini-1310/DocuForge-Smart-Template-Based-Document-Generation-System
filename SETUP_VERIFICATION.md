# ✅ DocuForge Backend - Setup Verification Checklist

Use this checklist to verify your Node.js backend is properly configured and ready to use.

## 🔍 Pre-Startup Checks

### 1. File Structure
- [ ] `server.js` exists in project root
- [ ] `config/db.js` exists
- [ ] `controllers/authController.js` exists
- [ ] `middleware/auth.js` exists
- [ ] `models/userModel.js` exists
- [ ] `routes/auth.js` exists
- [ ] `utils/validation.js` exists
- [ ] `node_modules/` folder exists
- [ ] `package.json` contains all dependencies
- [ ] `.env` file exists with configuration

### 2. Dependencies Installed
```bash
npm list express mongodb jsonwebtoken bcryptjs cors cookie-parser dotenv
```

Expected output: All packages should show versions

- [ ] express: ^4.18.2 (or later)
- [ ] mongodb: ^6.3.0 (or later)
- [ ] jsonwebtoken: ^8.5.1 (or later)
- [ ] bcryptjs: ^2.4.3 (or later)
- [ ] cors: ^2.8.5 (or later)
- [ ] cookie-parser: ^1.4.6 (or later)
- [ ] dotenv: ^16.3.1 (or later)
- [ ] nodemon: ^3.0.2 (dev dependency)

### 3. Environment Variables (.env)
Check that `.env` file contains:

```bash
# Create a simple check script
node -p "require('dotenv').config(); JSON.stringify(process.env, null, 2)"
```

Required variables:
- [ ] `MONGO_URI` - Your MongoDB Atlas connection string
- [ ] `PORT` - Should be 5000
- [ ] `NODE_ENV` - Should be "development"
- [ ] `JWT_SECRET` - Should be set (not empty)
- [ ] `DB_NAME` - Should be "docuforge"
- [ ] `DB_COLLECTION` - Should be "docforge"
- [ ] `FRONTEND_URL` - Should be http://localhost:3000

### 4. MongoDB Atlas Configuration
- [ ] MongoDB Atlas account created
- [ ] Cluster is running
- [ ] Database user created with password
- [ ] Connection string copied correctly
- [ ] IP whitelist includes your computer (or 0.0.0.0 for testing)
- [ ] `docuforge` database exists (or will be created on first insert)

**Test MongoDB Connection**:
```bash
# Use MongoDB Compass or connect from command line
npm run dev
# Then check: curl http://localhost:5000/api/db-status
```

## 🚀 Startup Verification

### 5. Start the Server
```bash
npm run dev
```

Expected output in terminal:
```
🚀 Starting DocuForge Backend Server...
📊 Connecting to MongoDB Atlas...
✅ Connected to MongoDB Atlas
✅ Server running at http://localhost:5000
📚 API Documentation:
   POST   /api/auth/register - Register new user
   POST   /api/auth/login    - Login user
   GET    /api/health        - Health check
   GET    /api/db-status     - Database status
```

Verification:
- [ ] Server starts without errors
- [ ] No "MONGO_URI is not set" error
- [ ] No "MongoDB connection failed" error
- [ ] Server listening on port 5000
- [ ] No "address already in use" error

### 6. Test API Endpoints

#### Health Check
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{"status":"OK","message":"Server is running"}
```
- [ ] Returns 200 OK status
- [ ] Responds with status: "OK"

#### Database Status
```bash
curl http://localhost:5000/api/db-status
```
Expected response:
```json
{"status":"connected","message":"Connected to MongoDB"}
```
- [ ] Returns 200 OK status
- [ ] Shows status: "connected"
- [ ] Confirms MongoDB connection

#### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'
```
Expected response:
```json
{
  "success":true,
  "message":"User registered successfully",
  "data":{"id":"...","email":"test@example.com","name":"Test User"}
}
```
- [ ] Returns 201 Created status
- [ ] User ID is returned
- [ ] User data saved correctly

#### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}' \
  -c cookies.txt
```
Expected response:
```json
{
  "success":true,
  "message":"Login successful",
  "data":{"id":"...","email":"test@example.com","name":"Test User"}
}
```
- [ ] Returns 200 OK status
- [ ] User data returned
- [ ] Cookie saved to cookies.txt (check with `cat cookies.txt`)

#### Check Authentication
```bash
curl http://localhost:5000/api/users/me \
  -b cookies.txt
```
Expected response:
```json
{
  "id":"...",
  "email":"test@example.com",
  "name":"Test User"
}
```
- [ ] Returns 200 OK status
- [ ] Shows authenticated user data
- [ ] Cookie-based authentication works

#### Verify No Auth Returns Error
```bash
curl http://localhost:5000/api/users/me
```
Expected response:
```json
{"error":"No authentication token"}
```
- [ ] Returns 401 Unauthorized status
- [ ] Blocks unauthenticated requests

## 🗄️ Database Verification

### 7. Check MongoDB Data

Option A: Using MongoDB Compass
- [ ] Download MongoDB Compass
- [ ] Connect with your MONGO_URI
- [ ] Navigate to: `docuforge` → `docforge` collection
- [ ] See at least 1 user document (from registration test)
- [ ] Document has fields: `_id`, `email`, `passwordHash`, `name`, `createdAt`
- [ ] `email` matches what you registered

Option B: Using MongoDB Atlas Web Console
- [ ] Go to MongoDB Atlas web dashboard
- [ ] Select cluster → Collections
- [ ] Navigate to `docuforge.docforge`
- [ ] See user documents stored

### 8. Verify Password Security
```javascript
// The passwordHash should be a bcryptjs hash, like:
// $2a$10$abcXYZ...LongStringOfCharacters...
```
- [ ] Password NOT stored in plain text
- [ ] passwordHash starts with `$2a$10$`
- [ ] passwordHash is 60 characters long

## 🔐 Security Configuration

### 9. JWT Configuration
- [ ] `JWT_SECRET` is not the default value
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] `JWT_EXPIRES` is set to "7d" (or your preference)

**Generate a new JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then update `.env`:
```env
JWT_SECRET=<paste_the_generated_string_here>
```

### 10. CORS Configuration
- [ ] FRONTEND_URL is set in .env
- [ ] Frontend requests include `credentials: 'include'`
- [ ] No CORS errors in browser console

## 🧪 Integration Testing

### 11. React Frontend Integration
- [ ] Start React app in separate terminal: `npm run dev` (from src folder)
- [ ] Frontend loads at http://localhost:3000
- [ ] Click "Register" link
- [ ] Fill in registration form
- [ ] Submit registration

Expected behavior:
- [ ] Registration successful
- [ ] Redirected to dashboard
- [ ] User data stored in MongoDB
- [ ] authToken cookie visible in DevTools

### 12. Login Test
- [ ] Click logout (if logged in)
- [ ] Go to login page
- [ ] Use same credentials from registration
- [ ] Login successful
- [ ] Redirected to dashboard
- [ ] User data displays correctly

## 🔄 Continuous Operation

### 13. Server Stability
- [ ] Server runs for extended period without crashing
- [ ] No memory leaks (check Task Manager)
- [ ] No console errors after 5+ minutes
- [ ] Handles multiple requests without issues

### 14. Error Handling
Test with invalid data:
```bash
# Wrong password
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"WrongPassword123"}'
```
- [ ] Returns 401 Unauthorized
- [ ] Error message: "Invalid email or password"

```bash
# Duplicate email
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```
- [ ] Returns 409 Conflict
- [ ] Error message: "User with this email already exists"

```bash
# Weak password
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"weak"}'
```
- [ ] Returns 400 Bad Request
- [ ] Error message about password requirements

## 🛑 Troubleshooting Checklist

If something isn't working:

### Server Won't Start
- [ ] Check if port 5000 is already in use: `netstat -ano | findstr :5000`
- [ ] Kill other process: `Stop-Process -Id <PID>`
- [ ] Or change PORT in .env
- [ ] Check Node.js version: `node --version` (should be 16+)
- [ ] Run: `npm install` to ensure all dependencies present

### MongoDB Connection Fails
- [ ] Verify MONGO_URI in .env
- [ ] Check MongoDB Atlas cluster is running
- [ ] Verify credentials in connection string
- [ ] Add your IP to MongoDB Atlas IP whitelist
- [ ] Test connection separately: `node config/db.js`

### Registration Fails
- [ ] Check password meets requirements (8+ chars, uppercase, lowercase, number)
- [ ] Check email is valid format
- [ ] Check email not already registered
- [ ] Check MongoDB connection working

### Authentication Fails
- [ ] Check authToken cookie exists in browser
- [ ] Check cookie not expired (7 day default)
- [ ] Check JWT_SECRET matches between requests
- [ ] Clear cookies and try login again

### Frontend Can't Connect
- [ ] Check backend server running on 5000
- [ ] Check FRONTEND_URL in .env matches frontend URL
- [ ] Check CORS is not blocking requests
- [ ] Check browser console for error messages

## ✨ Success Indicators

You'll know everything is working when:

- ✅ Server starts without errors
- ✅ Health endpoint responds
- ✅ Database connection confirmed
- ✅ User registration works
- ✅ User login works
- ✅ User data appears in MongoDB
- ✅ Authentication middleware protects endpoints
- ✅ Frontend and backend communicate
- ✅ All API tests pass
- ✅ No console errors

## 📋 Final Checklist

Before considering your backend ready:

- [ ] All 14 main verification steps completed
- [ ] No errors in server console
- [ ] No errors in browser console
- [ ] All API endpoints respond correctly
- [ ] User data visible in MongoDB
- [ ] Frontend and backend communicating
- [ ] Authentication working end-to-end
- [ ] Error handling tested
- [ ] Passwords properly hashed
- [ ] JWT tokens working
- [ ] CORS configured correctly
- [ ] Server stable for extended use

---

## 🎉 Ready to Deploy!

Once all checks pass, your DocuForge backend is ready for:
- ✅ Local development & testing
- ✅ Staging environment
- ✅ Production deployment

Next steps:
1. Review [BACKEND_README.md](BACKEND_README.md) for deployment guide
2. Deploy to Heroku, Railway, or Render
3. Update environment variables for production
4. Test deployed backend with frontend
5. Monitor logs and user activity

**Created**: 2026-02-21
**Status**: Ready for Verification ✅
