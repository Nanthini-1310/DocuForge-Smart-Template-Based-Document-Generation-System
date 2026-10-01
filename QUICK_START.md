# DocuForge - Quick Start Guide

## 🚀 Get Your App Running in 2 Minutes

### Prerequisites
- Node.js installed
- MongoDB Atlas account configured
- Both `.env` and `.env.local` files created

---

## Step 1: Verify Environment Files

### Backend `.env` (already updated ✅)
```
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend `.env.local` (created ✅)
```
VITE_API_URL=http://localhost:5000
```

---

## Step 2: Start Backend Server

Open Terminal 1:

```bash
cd "c:\Users\LENOVO\Downloads\My new app"

# Install dependencies (if not already installed)
npm install

# Start backend
node server.js
```

**Expected Output:**
```
✅ Server running at http://localhost:5000
📚 API Documentation:
   POST   /api/auth/register - Register new user
   POST   /api/auth/login    - Login user
   GET    /api/health        - Health check
   GET    /api/db-status     - Database status
```

---

## Step 3: Start Frontend (New Terminal)

Open Terminal 2:

```bash
cd "c:\Users\LENOVO\Downloads\My new app"

# Start Vite dev server
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:5173/
```

---

## Step 4: Test Registration

1. Open browser: `http://localhost:5173/register`
2. Fill in the form
3. Click "Create Account"
4. Check Terminal 1 for backend logs showing successful request

---

## ✅ Connection Setup Verification

### Terminal 1 (Backend) Should Show:
```
📤 2024-02-21T10:30:45.123Z POST /api/auth/register
📥 User registered successfully
```

### Browser Console Should Show:
```
📤 Sending registration request to: http://localhost:5000/api/auth/register
📥 Response status: 201
✅ Registration successful
```

### Success Indicators:
- No "Failed to fetch" error ✅
- Form clears and redirects to dashboard ✅
- Backend terminal shows the request ✅
- No CORS errors in browser console ✅

---

## 🛠️ Common Issues

### Issue: "Failed to fetch"
```
Solution: Check if backend is running
  → Terminal 1 should show running server
```

### Issue: Port already in use
```
Windows Command Line:
  netstat -ano | findstr :5000
  taskkill /F /PID <process_id>
```

### Issue: Database connection fails
```
Check MongoDB URI in .env is correct
  → Should start with: mongodb+srv://
```

### Issue: CORS errors in browser console
```
Verify .env has:
  FRONTEND_URL=http://localhost:5173
```

---

## 📋 Files Modified

✅ `.env` - Updated PORT and FRONTEND_URL
✅ `.env.local` - Created with VITE_API_URL
✅ `src/react-app/pages/Register.tsx` - Updated fetch logic
✅ `server.js` - CORS already configured correctly

---

## 🌐 API Endpoints Ready

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check server status |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/db-status` | GET | Check MongoDB connection |

---

## 💡 Next Steps

1. **Test Registration** - Create a test account
2. **Monitor Logs** - Watch both terminals during registration
3. **Check Network Tab** - F12 → Network to verify requests
4. **Add Login** - Similar setup to registration
5. **Add Dashboard** - Implement user dashboard page

---

## 📞 Need Help?

Check `FRONTEND_BACKEND_CONNECTION.md` for:
- Complete code examples
- Detailed configuration explanation
- Production setup guide
- Troubleshooting section

---

**Your app is ready! Backend and frontend can now communicate. 🎉**
