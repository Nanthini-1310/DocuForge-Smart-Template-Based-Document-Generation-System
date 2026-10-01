# Quick Start - Data API Connection

## 🚀 Get Your App Running in 5 Minutes

### Step 1: Get Data API Credentials (2 minutes)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your project
3. Click **App Services** in the sidebar
4. Click **Create App** (or open existing)
5. Go to **Data API** section
6. **Copy your Data API URL** - looks like:
   ```
   https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1
   ```

7. Click **Create API Key**
8. Select **Server** (read/write to any database)
9. **Copy the API Key**

### Step 2: Update .dev.vars (1 minute)

Edit `.dev.vars`:

```plaintext
MONGODB_API_URL="https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1"
MONGODB_API_KEY="YOUR_API_KEY_HERE"
MONGODB_DATABASE="sample_mflix"
```

Paste:
- Your Data API URL in `MONGODB_API_URL`
- Your API Key in `MONGODB_API_KEY`

### Step 3: Set Up Database Rules (1 minute)

1. In App Services, go to **Rules**
2. Click **Create Rule** or find `sample_mflix` → `users`
3. Set the rule:
   ```json
   {
     "roles": [{
       "name": "default",
       "apply_when": {},
       "insert": true,
       "read": true,
       "write": true,
       "delete": false
     }]
   }
   ```
4. Save

### Step 4: Start Your App (1 minute)

```bash
npm run dev
```

Visit: http://localhost:8787

### Step 5: Test Registration

1. Click the **Register** link
2. Fill in:
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Name: `Test User`
3. Click **Create Account**
4. It should redirect you to the dashboard

## ✅ Verification

If you see no errors and get redirected to dashboard:
- ✅ Data API is connected
- ✅ User saved to sample_mflix.users
- ✅ Session created
- ✅ All systems working!

## 🧪 Test with Curl

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@test.com",
    "password": "TestPassword123",
    "name": "Curl Test"
  }'
```

Expected response:
```json
{
  "id": "user_id_here",
  "email": "curl@test.com",
  "name": "Curl Test"
}
```

## 🔍 Troubleshooting

### "MongoDB Data API not configured"
- Check `.dev.vars` has both `MONGODB_API_URL` and `MONGODB_API_KEY`
- Restart `npm run dev` after editing

### "Data API error 401"
- API key is wrong or expired
- Get a new key from Atlas → Data API → Create API Key
- Make sure it's type "Server"

### "Data API error 404"
- Collection doesn't exist (that's OK, it's created on first insert)
- Or check rules allow write access to `sample_mflix` database

### Form doesn't submit
- Check browser console for errors
- Check terminal for worker errors
- Try the curl command first to test API directly

## 📝 What Happens When You Register

1. **Browser** → Form submission
2. **Worker** → Validates email & password
3. **Worker** → Hashes password (bcrypt)
4. **Worker** → Makes fetch call to Data API
5. **Data API** → Inserts into `sample_mflix.users`
6. **Database** → User saved with timestamp
7. **Worker** → Creates session in D1
8. **Browser** → Redirected to dashboard ✓

## 🎯 Next Steps

- [ ] Completed registration test
- [ ] User appears in MongoDB Atlas (check Collections)
- [ ] Try login at `/login`
- [ ] Try creating documents at `/create-document`
- [ ] Ready to deploy to production

## 📚 More Info

- Full setup guide: [DATA_API_SETUP.md](./DATA_API_SETUP.md)
- Implementation details: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- Client code: [src/db/mongodb.ts](./src/db/mongodb.ts)

## 🆘 Still Having Issues?

Check these files:
1. **Is .dev.vars correct?**
   - `MONGODB_API_URL` should start with `https://data.mongodb-api.com`
   - `MONGODB_API_KEY` should be 40+ characters
   - `MONGODB_DATABASE` should be `sample_mflix`

2. **Do you have Data API enabled?**
   - Atlas → App Services → Data API → Check "Enable"

3. **Are rules set up?**
   - App Services → Rules → sample_mflix
   - Check `users` collection allows insert/read/write

4. **Is the worker running?**
   - Check `npm run dev` shows "Listening on 0.0.0.0:8787"
   - No TypeScript errors on start

5. **Try rebuilding:**
   ```bash
   npm run build
   ```

---

**Status:** Ready to register users! 🎉
