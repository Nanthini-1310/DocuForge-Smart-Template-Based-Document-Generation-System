# Google OAuth Setup Guide

## Prerequisites
- Google OAuth credentials (Client ID and Client Secret)
  - Get them from: https://console.cloud.google.com/
  - Create a new OAuth 2.0 Client ID (Web application)

## Step 1: Install Dependencies
```bash
npm install
```

This project uses:
- **Vite 6.x** for frontend bundling (compatible with @vitejs/plugin-react@4.4.1)
- **Hono** for the Cloudflare Worker backend API
- **React 19** for the UI framework

## Step 2: Configure Google OAuth for Development

### Create Local Development Secrets File
Create a `.env.local.wrangler` file in the root directory:

```env
GOOGLE_CLIENT_ID=your_development_oauth_client_id
GOOGLE_CLIENT_SECRET=your_development_oauth_client_secret
```

> ⚠️ **IMPORTANT**: Never commit this file. It's in `.gitignore` by default.

### Add Authorized Origins to Google OAuth
In your Google Cloud Console OAuth settings, add these authorized redirect URIs:

**URLs for Development:**
- Authorized JavaScript origins: `http://localhost:5174`
- Authorized redirect URIs: `http://localhost:5174/auth/callback`

**URLs for Production:**
- Authorized JavaScript origins: `https://yourdomain.com`
- Authorized redirect URIs: `https://yourdomain.com/auth/callback`

## Step 3: Run Development Server

### Frontend + Backend
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5174 (Vite dev server with React)
- **Backend**: Cloudflare Workers emulation on the same URL

### Testing Google Sign-In
1. Go to http://localhost:5174
2. Click "Sign In with Google"
3. You'll be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected to `/dashboard`

## Step 4: Deploy to Cloudflare

### Set Production Secrets
```bash
wrangler secret put GOOGLE_CLIENT_ID
# Enter your production Client ID

wrangler secret put GOOGLE_CLIENT_SECRET
# Enter your production Client Secret
```

### Deploy
```bash
npm run check  # Validates build
wrangler deploy  # Deploys to Cloudflare
```

## Environment Variable Reference

### Server-Side (Worker/Backend)
- `GOOGLE_CLIENT_ID` - OAuth Client ID (managed by Cloudflare Secrets)
- `GOOGLE_CLIENT_SECRET` - OAuth Client Secret (managed by Cloudflare Secrets)
- `DB` - D1 Database binding
- `R2_BUCKET` - R2 Object Storage binding

### Client-Side (React)
Currently, the client doesn't need environment variables. OAuth is handled server-to-server with Google.

## Troubleshooting

### Error: "Server configuration error: GOOGLE_CLIENT_ID not set"
**Solution**: Make sure your `.env.local.wrangler` file is created with the correct variables and you're running `wrangler dev`.

### OAuth redirect URI mismatch
**Solution**: Ensure the Authorized Redirect URIs in Google Cloud Console match:
- Development: `http://localhost:5174/auth/callback`
- Production: `https://yourdomain.com/auth/callback`

### Session/Cookies not working
**Solution**: Make sure your Google OAuth credentials are for the correct origin and HTTPS is used in production.

## Project Structure

```
src/
├── react-app/          # React frontend
│   ├── pages/         # Page components (Login, Dashboard, etc.)
│   ├── components/    # Reusable UI components
│   ├── contexts/      # AuthContext - custom auth management
│   └── App.tsx        # Main app component
│
└── worker/            # Cloudflare Worker backend
    └── index.ts       # API routes, OAuth handling
```

## Key Files
- `.env.example` - Example environment variables for reference
- `wrangler.json` - Cloudflare Worker configuration with detailed comments
- `src/worker/index.ts` - Backend API with Google OAuth handling
- `src/react-app/contexts/AuthContext.tsx` - React authentication context
- `src/react-app/pages/Login.tsx` - Login page with Google Sign-In button

## For More Information
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Cloudflare Secrets: https://developers.cloudflare.com/workers/configuration/secrets/
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Hono Framework: https://hono.dev/
- Vite: https://vitejs.dev/
