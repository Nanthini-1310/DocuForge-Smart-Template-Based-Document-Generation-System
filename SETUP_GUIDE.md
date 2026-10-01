# DocuForge - Complete Setup Guide

## 🎯 Project Status

✅ **Google OAuth removed - MongoDB email/password auth implemented**
✅ **Mongoose with bcryptjs password hashing**
✅ **Vite configured with Node.js modules externalization**
✅ **Ready for development and production**

---

## 📋 What Was Removed

- ❌ `@getmocha/vite-plugins` package
- ❌ `@getmocha/users-service` package
- ❌ All Mocha authentication middleware
- ❌ All Mocha environment references
- ❌ Mocha branding and metadata

---

## ✨ What You Have Now

- ✅ **Custom AuthContext** - Standalone React authentication context
- ✅ **MongoDB Authentication** - Email/password with bcryptjs hashing
- ✅ **Mongoose ODM** - Type-safe MongoDB operations
- ✅ **Vite 6.x with SSR externals** - Properly configured for Node.js modules
- ✅ **Hono Framework** - Lightweight backend for Workers
- ✅ **React 19** - Latest React features
- ✅ **TypeScript** - Full type safety

---

## 🚀 Quick Start

### 1. Setup MongoDB Connection

Create or verify `.dev.vars` in the root directory with your MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/docuforge
API_URL=http://localhost:3000
API_KEY=your_api_key_here
```

**For MongoDB Atlas (cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/docuforge
```

**For local MongoDB:**
```bash
# Install MongoDB locally or start a container
# macOS: brew install mongodb-community
# Windows: Download from mongodb.com
# Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify MongoDB is running
mongosh # or mongo
```

### 2. Install Dependencies

```bash
npm install
```

> ✅ Includes mongoose, bcryptjs, and all Node.js modules properly configured

### 3. Run Development Server

```bash
npm run dev
```

> Starts Vite dev server at `http://localhost:5174`
> Loads MongoDB URI from `.dev.vars`
> Vite properly externalizes Node.js modules (punycode, crypto, etc.)

### 4. Test Authentication

1. Navigate to `http://localhost:5174`
2. Click "Sign Up" to create an account
3. Enter email and password (min 8 characters)
4. Or click "Sign In" with existing credentials
5. Redirected to `/dashboard` after successful login

---

## 🏗️ Architecture

### Frontend (React + Vite)
```
src/react-app/
├── contexts/
│   └── AuthContext.tsx          # ← Handles authentication state
├── pages/
│   ├── Login.tsx               # ← Google sign-in button
│   ├── AuthCallback.tsx        # ← OAuth callback handler
│   ├── Dashboard.tsx           # ← Protected route
│   └── ...
├── components/                 # ← Reusable UI components
├── App.tsx                     # ← Main app with routes
└── main.tsx                    # ← Entry point
```

### Backend (Cloudflare Workers + Hono + MongoDB)
```
src/worker/
└── index.ts                    # ← API endpoints
    ├── /api/auth/register      # ← Create new user
    ├── /api/auth/login         # ← Authenticate user
    ├── /api/users/me           # ← Get current user
    ├── /api/logout             # ← Clear session
    ├── /api/documents/*        # ← Document API
    └── ...

src/db/
└── mongodb.ts                  # ← MongoDB connection manager

src/models/
└── UserSchema.ts               # ← Mongoose User schema with password hashing
```

---

## 🔐 MongoDB Authentication Flow

### Registration
1. User submits email and password
2. Password is hashed with bcryptjs (salt rounds: 10)
3. User document created in MongoDB
4. Session stored in D1 database
5. Session cookie set (httpOnly, secure, sameSite=lax)

### Login
1. User submits email and password
2. User lookup in MongoDB by email
3. Password verified using bcryptjs.compare()
4. Session created upon successful verification
5. Redirected to `/dashboard`

### Session Management
- Sessions stored in D1 database
- Sessions expire after 60 days
- httpOnly cookies prevent XSS attacks
- Verified on every protected API request

### Development Setup

Ensure MongoDB is running before starting the dev server:

```bash
# Option 1: Local MongoDB
mongosh  # verify connection

# Option 2: MongoDB Atlas
# Create a cluster at https://www.mongodb.com/cloud/atlas
# Get connection string and add to .dev.vars
```

### Production Setup

Use MongoDB Atlas or managed MongoDB service:

```bash
# 1. Create MongoDB Atlas account and cluster
# 2. Get connection string: mongodb+srv://user:pass@cluster...
# 3. Store as Cloudflare secret:
wrangler secret put MONGODB_URI
# Enter your MongoDB Atlas connection string when prompted
# 4. Deploy to Cloudflare Workers
wrangler deploy
```

---

## 🔧 Vite Configuration for Node.js Modules

The `vite.config.ts` is configured to properly handle Node.js built-in modules used by MongoDB:

```typescript
ssr: {
  external: [
    'node:punycode', 'punycode',  // DNS-related modules
    'node:crypto', 'crypto',       // Encryption
    'node:stream', 'stream',       // Stream processing
    // ... and many more
    'mongodb', 'mongoose'          // Database drivers
  ]
}
```

This prevents the error: `Dynamic require of punycode is not supported`

**Key configurations:**
- ✅ Node.js built-ins are externalized (not bundled)
- ✅ `.dev.vars` environment variables are loaded
- ✅ `process.env` is properly defined for the worker
- ✅ MongoDB driver dependencies work correctly

---

## 📝 Configuration Files

### `.dev.vars` (Development Environment)
```env
MONGODB_URI=mongodb://localhost:27017/docuforge
API_URL=http://localhost:3000
API_KEY=your_api_key_here
```

**MongoDB URI Examples:**
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/docuforge

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/docuforge?retryWrites=true&w=majority

# Docker MongoDB
MONGODB_URI=mongodb://host.docker.internal:27017/docuforge
```
**Never commit this file** - it's in `.gitignore`

### `wrangler.json` (Cloudflare Worker Config)
```json
{
  "name": "docuforge",
  "main": "./src/worker/index.ts",
  "d1_databases": [...],
  "r2_buckets": [...]
}
```

### `package.json` (Dependencies)
```json
{
  "name": "docuforge",
  "dependencies": {...},
  "devDependencies": {
    "vite": "^6.2.0",  // Compatible with @vitejs/plugin-react
    ...
  }
}
```

---

## 🧪 Testing Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run check

# Lint code
npm run lint

# Knip (unused imports checker)
npm run knip
```

---

## 🚨 Troubleshooting

### "Dynamic require of punycode is not supported" Error

**Problem**: Vite tries to bundle Node.js modules that MongoDB depends on

**Solution**: The `vite.config.ts` is already configured to externalize these modules:
```typescript
ssr: {
  external: ['node:punycode', 'punycode', 'mongodb', 'mongoose', ...]
}
```

If error persists:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev  # Try again
```

### MongoDB Connection Failed

**Problem**: "MONGODB_URI is not set" or connection timeout

**Solution**:
1. Verify `.dev.vars` exists in root directory:
   ```bash
   cat .dev.vars  # Should contain MONGODB_URI
   ```

2. Verify MongoDB is running:
   ```bash
   # For local MongoDB
   mongosh  # Should connect successfully
   
   # For MongoDB Atlas
   # Test connection string in MongoDB Atlas dashboard
   ```

3. Check connection string format:
   ```env
   # Local: mongodb://localhost:27017/dbname
   # Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

4. Restart dev server after fixing:
   ```bash
   npm run dev
   ```

### Password Hashing Issues

**Problem**: Passwords not being hashed or comparison failing

**Cause**: bcryptjs pre-save hook in User schema

**Solution**: Ensure mongoose and bcryptjs are installed:
```bash
npm install mongoose bcryptjs
npm run dev
```

### Environment Variables Not Loading

**Problem**: `.dev.vars` content not available in worker

**Solution**:
1. Verify `loadEnv` is imported in `vite.config.ts`
2. Check `.dev.vars` format (should be `KEY=value`)
3. Restart dev server:
   ```bash
   npm run dev
   ```

### Session Not Persisting

**Problem**: User logged in but session lost on page refresh

**Cause**: D1 database configuration or session cookie issue

**Solution**:
```bash
# Verify cookies are being set
# In browser DevTools → Application → Cookies → localhost
# Should see: session_id cookie with httpOnly flag

# Check browser allows cookies for localhost
# Some privacy modes block cookies
```

### "Database connection failed" Error

**Problem**: Backend returns 503 Database connection failed

**Solution**:
1. Check MongoDB is running
2. Verify MONGODB_URI is correct
3. Check network connectivity (especially for MongoDB Atlas)
4. Review browser console for more details
5. Check server logs for connection error details

---

## 🔄 Development Workflow

### Making Changes to Authentication

**Edited User Schema?**
```bash
# Restart the dev server (schema changes require connection reset)
npm run dev
```

**Edited Password Hashing?**
```bash
# Test existing user login still works
# The pre-save hook only hashes on modifications that include password field
```

**Edited Auth Middleware?**
```bash
# Changes take effect automatically (no restart needed)
```

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| [.dev.vars](.dev.vars) | Environment variables for development |
| [src/db/mongodb.ts](src/db/mongodb.ts) | MongoDB connection manager |
| [src/models/UserSchema.ts](src/models/UserSchema.ts) | User model with bcryptjs |
| [src/react-app/contexts/AuthContext.tsx](src/react-app/contexts/AuthContext.tsx) | React authentication context |
| [src/react-app/pages/Login.tsx](src/react-app/pages/Login.tsx) | Login with email/password |
| [src/react-app/pages/Register.tsx](src/react-app/pages/Register.tsx) | Registration form |
| [src/worker/index.ts](src/worker/index.ts) | API endpoints and auth routes |
| [vite.config.ts](vite.config.ts) | Vite with Node.js modules configured |
| [src/react-app/pages/AuthCallback.tsx](src/react-app/pages/AuthCallback.tsx) | OAuth callback handler |
| [src/worker/index.ts](src/worker/index.ts) | Backend API with OAuth |
| [wrangler.json](wrangler.json) | Cloudflare Worker config |
| [package.json](package.json) | Dependencies (Vite 6.x) |
| [index.html](index.html) | HTML entry point |

---

## 🌐 Deployment

### Deploy to Cloudflare Workers

```bash
# 1. Build the project
npm run build

# 2. Set production secrets
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET

# 3. Deploy
wrangler deploy

# 4. Check deployment
wrangler deployments list
```

### Custom Domain

In `wrangler.json`:
```json
{
  "route": "yourdomain.com/*",
  "zone_id": "your_zone_id"
}
```

---

## ✅ Verification Checklist

- [ ] `.env.local.wrangler` created with Google credentials
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts without errors
- [ ] `http://localhost:5174` loads in browser
- [ ] Google Sign-In button appears on login page
- [ ] Clicking button redirects to Google OAuth
- [ ] After auth, redirected to dashboard
- [ ] User email displayed in dashboard
- [ ] Logout clears session

---

## 📞 Support

For issues or questions:
1. Check [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)
2. Review error messages in browser console
3. Check network requests in DevTools
4. Verify `.env.local.wrangler` has correct values

---

## 🎉 You're All Set!

DocuForge is now fully configured with:
- ✅ Zero Mocha dependencies
- ✅ Standalone Google OAuth
- ✅ Compatible Vite 6.x
- ✅ Production-ready code

**Happy coding! 🚀**
