# Frontend Verification & Testing Guide

## Quick Start

### Step 1: Verify Dependencies
```powershell
cd "c:\Users\LENOVO\Downloads\My new app"
npm list react react-dom @vitejs/plugin-react jspdf docx
```

### Step 2: Create Environment File
Ensure `.env.local` exists in project root with:
```
VITE_API_URL=http://localhost:5000
```

### Step 3: Start Backend Server
```powershell
# Terminal 1 - Backend
cd "c:\Users\LENOVO\Downloads\My new app"
npm run start
```
Expected output:
```
✅ Server running on http://localhost:5000
✅ Connected to MongoDB Atlas
```

### Step 4: Start Frontend Dev Server
```powershell
# Terminal 2 - Frontend
cd "c:\Users\LENOVO\Downloads\My new app"
npm run dev
```
Expected output:
```
  VITE v7.3.1  ready in 523 ms
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Test Scenarios

### Scenario 1: Home Page Rendering ✅

**Steps:**
1. Open http://localhost:5173 in browser
2. Wait 2-3 seconds for page to load

**Expected Result:**
- [ ] Page displays DocuForge logo
- [ ] Hero section with "Create Professional Documents Intelligently"
- [ ] Features section with 6 feature cards
- [ ] "How It Works" section with 3 steps
- [ ] CTA section with "Create Free Account" button
- [ ] Navigation with "Sign In" and "Get Started" buttons
- [ ] Footer with copyright

**Troubleshooting if Blank:**
- Open Browser DevTools (F12)
- Check Console tab for errors
- Common errors and fixes:
  - "Cannot find module '@radix-ui/...'" → Run `npm install`
  - "API_BASE_URL undefined" → Check .env.local file
  - "React is not defined" → Should be fixed (removed React import)

---

### Scenario 2: Navigate to Register Page ✅

**Steps:**
1. From home page, click "Get Started" or "Sign up" link
2. Should navigate to /register

**Expected Result:**
- [ ] Register form displays
- [ ] Form has fields: Email, Password, Confirm Password, Name (optional)
- [ ] "Sign up" button appears
- [ ] "Already have an account? Sign in" link present
- [ ] Form validation works (try submitting empty form)

**Test Registration:**
1. Enter test email: `test@example.com`
2. Enter password: `Test@12345`
3. Confirm password: `Test@12345`
4. Name: `John Doe` (optional)
5. Click "Register"

**Expected:**
- [ ] Success message or redirect to dashboard
- [ ] Can see user greeting: "Welcome back, John!"

---

### Scenario 3: Login Flow ✅

**Steps:**
1. If already registered, go to http://localhost:5173/login
2. Enter credentials from Scenario 2
3. Click "Sign In"

**Expected Result:**
- [ ] Request sent to `http://localhost:5000/api/auth/login`
- [ ] User cookie set in browser
- [ ] Redirects to `/dashboard`
- [ ] User greeting shows "Welcome back, [Name]! 👋"

**Verification in DevTools:**
1. Open DevTools → Application tab
2. Check Cookies → Should see auth token
3. Network tab → Check login request status (200 or 201)

---

### Scenario 4: Dashboard Page ✅

**Steps:**
1. After successful login, verify at http://localhost:5173/dashboard
2. Should see template gallery

**Expected Result:**
- [ ] Page displays DocuForge logo in header
- [ ] User avatar/dropdown in top right
- [ ] Welcome message: "Welcome back, [FirstName]! 👋"
- [ ] Quick stats cards showing:
  - [ ] Available Templates: (number)
  - [ ] Export Formats: 2 (PDF & Word)
  - [ ] Status: Ready
- [ ] Template gallery grid with cards:
  - [ ] Resume card
  - [ ] Invoice card
  - [ ] Offer Letter card
  - [ ] Report card
  - [ ] Certificate card
  - [ ] Syllabus card
- [ ] Each card shows: Template name, description, field count, section count
- [ ] Each card has "Create Document" button

---

### Scenario 5: Template Editor ✅

**Steps:**
1. On Dashboard, click "Create Document" on any template (e.g., Resume)
2. Should navigate to `/editor/resume`

**Expected Result:**
- [ ] Split-screen layout loads:
  - **Left**: Form with template fields
  - **Right**: Document preview
- [ ] Form has input fields matching template placeholders
- [ ] Preview updates in real-time as you type
- [ ] Document preview shows formatted text with replacements

**Test Form Filling:**
1. Fill in Resume fields:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "555-1234"
   - Summary: "8 years of experience"
   - Skills: "React, TypeScript, Node.js"
2. Watch preview update in real-time
3. Check that {{fullName}} is replaced with "John Doe"

**Verification:**
- [ ] Preview shows "John Doe" instead of {{fullName}}
- [ ] Preview shows "john@example.com" instead of {{email}}
- [ ] All filled fields appear in preview

---

### Scenario 6: PDF Export ✅

**Steps:**
1. From Template Editor with filled form
2. Click "Export as PDF" button
3. Wait for download (should see Loader icon)

**Expected Result:**
- [ ] Button shows loader while exporting
- [ ] File downloads as `[document-name].pdf`
- [ ] File opens in PDF reader
- [ ] PDF contains:
  - [ ] Filled form data (no {{placeholders}})
  - [ ] Proper margins and spacing
  - [ ] Text properly formatted
  - [ ] Multiple pages if needed (page breaks working)

**PDF Verification:**
1. Open downloaded PDF
2. Check text rendering quality
3. Verify no placeholder markers ({{key}}) appear
4. Check margins are properly applied

---

### Scenario 7: Word Export ✅

**Steps:**
1. From Template Editor with filled form
2. Click "Export as Word" button
3. Wait for download

**Expected Result:**
- [ ] Button shows loader while exporting
- [ ] File downloads as `[document-name].docx`
- [ ] File opens in Word/LibreOffice
- [ ] Document contains:
  - [ ] Filled form data
  - [ ] Proper formatting preserved
  - [ ] Margins correctly applied
  - [ ] Line spacing correct
  - [ ] Font sizes appropriate

**Word Verification:**
1. Open downloaded .docx file
2. Check formatting is preserved
3. Verify margins match settings
4. Check no placeholder markers appear
5. Verify image/text rendering

---

### Scenario 8: Protected Routes ✅

**Steps:**
1. Logout (click user avatar → Logout)
2. Try to access `/dashboard` directly in URL bar

**Expected Result:**
- [ ] Redirects to `/login` page
- [ ] Cannot access protected routes without authentication

**Test Each Protected Route:**
- [ ] http://localhost:5173/dashboard → Redirects to /login
- [ ] http://localhost:5173/editor/resume → Redirects to /login

---

### Scenario 9: Logout Flow ✅

**Steps:**
1. On Dashboard, click user avatar in top right
2. Click "Logout" in dropdown menu

**Expected Result:**
- [ ] User session cleared
- [ ] Redirects to home page (/)
- [ ] Auth cookie removed
- [ ] Cannot access /dashboard without re-login

**Verification:**
1. Check DevTools Network tab
2. Verify logout request sent to `/api/logout`
3. Check Cookies → Auth cookie should be removed

---

### Scenario 10: Error Handling ✅

**Test Invalid Inputs:**

1. **Register with weak password:**
   - Enter password: "123"
   - Expected: Error "Password must be at least 8 characters"
   - [ ] Stays on register page

2. **Register with mismatched passwords:**
   - Password: "Test@12345"
   - Confirm: "Test@12346"
   - Expected: Error "Passwords do not match"
   - [ ] Stays on register page

3. **Login with wrong credentials:**
   - Email: "test@example.com"
   - Password: "WrongPassword"
   - Expected: Error message from server
   - [ ] Stays on login page

4. **Network error handling:**
   - Disconnect internet or stop backend server
   - Try to login
   - Expected: "Cannot reach backend..." error message
   - [ ] Shows helpful error
   - [ ] Doesn't crash app

---

## Browser Console Checks

When page loads, check Console tab (F12) for these logs:

**HomeOkay** (no login):
```
✅ No critical errors
✅ No red errors
⚠️ May see some CSS warnings (ignore @theme and @apply)
```

**Afterurthermore** (after login success):
```
📡 Fetching user data from: http://localhost:5000/api/users/me
✅ User data received: {id: "...", email: "...", name: "..."}
```

**Template Editor** (on preview):
```
(Should see no errors, only form input logs if enabled)
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank white screen | TypeScript errors | Check console for errors, rebuild with `npm run dev` |
| "Cannot find module" | Missing dependencies | Run `npm install` |
| API_BASE_URL undefined | Missing .env.local | Create .env.local with `VITE_API_URL=http://localhost:5000` |
| Port 5173 in use | Vite process still running | Kill node process: `taskkill /IM node.exe /F` |
| Port 5000 in use | Backend still running | Kill node process or close backend terminal |
| Login not redirecting | Auth endpoint failed | Check backend server running on port 5000 |
| Preview not updating | Form onChange not firing | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| PDF not downloading | jsPDF export error | Check console for detailed error message |
| Word not downloading | docx export error | Check console for detailed error message |

---

## Performance Checks

1. **Initial Load Time**
   - Should load in < 3 seconds
   - Check Network tab for slow resources

2. **Dashboard Load**
   - Should render in < 1 second
   - Check for N+1 API calls

3. **Template Preview**
   - Should update without delay as you type
   - No lag in real-time preview

---

## Deployment Checklist

Before deploying to production:

- [ ] Remove all `console.log` statements (or disable in production)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (responsive design)
- [ ] Verify all error messages are user-friendly
- [ ] Check dark mode styling works
- [ ] Verify CORS headers are correct
- [ ] Test with slow network (DevTools Network throttling)
- [ ] Check accessibility (keyboard navigation, screen readers)

---

## Success Metrics

✅ **All scenarios pass**
✅ **No console errors** (only warnings about CSS)
✅ **PDF exports working** with proper formatting
✅ **Word exports working** with correct styling
✅ **Authentication flows** properly
✅ **Protected routes** block unauthenticated users
✅ **Error handling** shows helpful messages
✅ **No blank screens** during normal operation

---

**Last Updated:** February 22, 2026
**Status:** Ready for QA Testing
