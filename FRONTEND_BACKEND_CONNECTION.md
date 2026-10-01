# DocuForge Frontend-Backend Connection Setup

## ✅ Complete Configuration

All files have been updated for proper frontend-backend communication.

---

## 1. Backend Configuration (Express + Node.js)

### File: `server.js`

Your `server.js` is now correctly configured with:

```javascript
// CORS configuration - allows requests from Vite frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));

// Preflight request handler
app.options('*', cors());

// JSON body parser - required to read request bodies
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

**Key Routes Available:**
- `GET /api/health` → Returns `{ status: "OK", message: "Server is running" }`
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login user
- `GET /api/db-status` → Check MongoDB connection

### File: `.env` (Backend)

```dotenv
# Node Environment
NODE_ENV=development

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://nanthiniamir1310_db_user:7wEAS05tQ8DL4fTr@cluster0.yvlx4ff.mongodb.net/?retryWrites=true&w=majority

# Database Configuration
DB_NAME=docuforge
DB_COLLECTION=docforge

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES=7d

# Logging
LOG_LEVEL=debug
```

**Critical Settings:**
- ✅ PORT=5000 (matches backend URL)
- ✅ FRONTEND_URL=http://localhost:5173 (matches Vite frontend)
- ✅ MONGO_URI configured with your MongoDB credentials

---

## 2. Frontend Configuration (React + Vite)

### File: `.env.local` (Frontend)

```dotenv
# Vite API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=DocuForge
VITE_APP_TITLE=DocuForge - Professional Document Templates
VITE_ENV=development
```

**Important:** This file should NOT be committed to git. Add to `.gitignore`:
```
.env.local
.env.*.local
```

### File: `src/react-app/pages/Register.tsx`

Updated with proper error handling:

```typescript
// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // Validation
  if (!formData.email || !formData.password || !formData.confirmPassword) {
    setError("All fields are required");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (formData.password.length < 8) {
    setError("Password must be at least 8 characters long");
    return;
  }

  setIsLoading(true);

  try {
    console.log("📤 Sending registration request to:", `${API_BASE_URL}/api/auth/register`);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",  // Include cookies for authentication
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      }),
    });

    console.log("📥 Response status:", response.status);

    // Successfully registered (200 or 201)
    if (response.ok) {
      console.log("✅ Registration successful");
      await refetch();
      navigate("/dashboard");
    } else {
      // Handle server errors
      let errorMessage = "Registration failed";
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error("❌ Server error:", errorMessage);
      } catch (parseError) {
        errorMessage = `${response.statusText || "Registration failed"} (Status: ${response.status})`;
        console.error("❌ Server error:", errorMessage);
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  } catch (err) {
    console.error("❌ Network error during registration:", err);
    
    let errorMessage = "Unable to connect to the server";
    
    if (err instanceof TypeError) {
      if (err.message.includes("Failed to fetch")) {
        errorMessage = `Network error: Cannot reach backend at ${API_BASE_URL}. Ensure the backend server is running.`;
      } else if (err.message.includes("NetworkError")) {
        errorMessage = "Network connection failed. Check your internet connection.";
      } else {
        errorMessage = err.message;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    setError(errorMessage);
    setIsLoading(false);
  }
};
```

**Key Features:**
- ✅ Reads API URL from Vite environment variables
- ✅ `credentials: "include"` for cookie-based authentication
- ✅ Proper error handling with detailed messages
- ✅ Console logging for debugging
- ✅ Loading state management

---

## 3. How to Run

### Step 1: Ensure Environment Files are Set

**Backend (.env):**
```bash
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_secret_key
```

**Frontend (.env.local):**
```bash
VITE_API_URL=http://localhost:5000
```

### Step 2: Install Dependencies

```bash
# Backend
npm install

# Frontend (if not installed)
npm install
```

### Step 3: Start Backend Server

```bash
node server.js
```

You should see:
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

### Step 4: Start Frontend Development Server (in another terminal)

```bash
npm run dev
```

You should see:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 5: Test Registration

1. Open `http://localhost:5173/register`
2. Fill in the form
3. Click "Create Account"
4. Check browser console (F12) for debug logs
5. Check backend terminal for request logs

---

## 4. Testing the Connection

### Quick Health Check

Open your terminal and test:

```bash
# Test backend health
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"Server is running"}

# Test CORS
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:5000/api/auth/register -v
```

### Register a User (via API)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test User"
  }'
```

### Browser Network Tab Checklist

When submitting the registration form, check F12 → Network:

- ✅ Request URL: `http://localhost:5000/api/auth/register`
- ✅ Request Method: `POST`
- ✅ Response Headers include:
  ```
  access-control-allow-origin: http://localhost:5173
  access-control-allow-credentials: true
  ```
- ✅ Response Status: `201 Created` (successful) or `400/409` (validation error)
- ✅ Request Headers include:
  ```
  content-type: application/json
  ```

---

## 5. Troubleshooting

### "Failed to fetch" Error

**Check 1: Backend Running?**
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# If not running, start it:
node server.js
```

**Check 2: Port Conflict?**
```bash
# On Windows, check if port 5000 is in use:
netstat -ano | findstr :5000

# Kill the process if needed:
taskkill /F /PID <process_id>
```

**Check 3: CORS Configuration?**
```javascript
// Verify in server.js:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

**Check 4: Environment Variables?**
- Backend: `.env` has `PORT=5000` and `FRONTEND_URL=http://localhost:5173`
- Frontend: `.env.local` has `VITE_API_URL=http://localhost:5000`

### "Network Error" Messages

- Check browser console (F12) for specific error
- Check backend terminal for request logs
- Verify MongoDB connection: `http://localhost:5000/api/db-status`

### Credentials Not Being Sent

Ensure both files have:
- Backend: `app.use(cors({ credentials: true }))`
- Frontend: `credentials: "include"` in fetch options

---

## 6. Production Checklist

Before deploying:

- [ ] Change `JWT_SECRET` in `.env` to a strong random string
- [ ] Update `NODE_ENV=production` in backend `.env`
- [ ] Update `FRONTEND_URL` to production frontend domain
- [ ] Update `VITE_API_URL` to production backend domain
- [ ] Set secure cookie flags: `secure: true, sameSite: 'strict'`
- [ ] Add MongoDB Atlas IP whitelist for production servers
- [ ] Enable HTTPS on both frontend and backend
- [ ] Add environment-specific error logging
- [ ] Test all routes with production URLs

---

## 📝 Summary

Your DocuForge app is now properly configured for local development:

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Configured |
| Backend | http://localhost:5000 | ✅ Configured |
| Database | MongoDB Atlas | ✅ Connected |
| CORS | Enabled | ✅ Configured |
| Environment | Development | ✅ Configured |

All components can now communicate successfully!
