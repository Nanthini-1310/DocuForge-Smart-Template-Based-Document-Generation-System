# MongoDB Data API Setup Guide

## Overview

Your application is now configured to use **MongoDB Data API** with the **sample_mflix** database. This fetch-based approach works perfectly with Cloudflare Workers without any punycode errors.

## ✅ Current Status
- ✓ Sample dataset loaded (sample_mflix)
- ✓ Registration endpoint ready to save users
- ✓ Fetch-based connection (no Node.js dependencies)
- ⏳ **Waiting for**: Data API credentials

## Step 1: Create MongoDB App Services

1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com)
2. Select your project
3. In the left sidebar, click **App Services**
4. Click **Create App** (or use existing if you have one)
5. Name it something like "data-api"
6. Click **Create App**

## Step 2: Enable Data API

1. In your App Services app, go to the left sidebar
2. Look for **HTTP Endpoints** or **Data API**
3. Click to enable Data API
4. It will show you the base URL (something like `https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1`)
5. **Copy this URL** - you'll need it for `.dev.vars`

## Step 3: Create API Key

1. In your App Services app, go to **Data API** section
2. Click **Create API Key**
3. Select permission: **Server (with ability to read/write to any database)**
4. Click **Create**
5. **Copy the API Key** - this is your `MONGODB_API_KEY`

⚠️ **Important**: Store this key securely. Don't commit it to git in production!

## Step 4: Update .dev.vars

Edit `.dev.vars` and replace the placeholders:

```plaintext
# MongoDB Data API Configuration
MONGODB_API_URL="https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1"
MONGODB_API_KEY="YOUR_DATA_API_KEY_HERE"
MONGODB_DATABASE="sample_mflix"
```

Replace:
- `YOUR_APP_ID` - from the Data API URL you copied
- `YOUR_DATA_API_KEY_HERE` - the API key you created

## Step 5: Test Connection

Run the development server:
```bash
npm run dev
```

Try the registration endpoint:
```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test User"
  }'
```

You should see a success response with a user ID.

## Step 6: Set Database Rules (Important!)

For the registration to work, you need to allow writes to the `users` collection:

1. In your App Services app, go to **Rules** (or **Schemas**)
2. Find or create a rule for: `sample_mflix` → `users`
3. Set the rule to allow writes from your API key
4. Example rule:
   ```json
   {
     "roles": [
       {
         "name": "default",
         "apply_when": {},
         "insert": true,
         "read": true,
         "write": true,
         "delete": false
       }
     ]
   }
   ```

## How It Works

### Registration Flow
1. User submits email/password via the Register form
2. Browser sends POST to `/api/auth/register`
3. Worker validates input
4. Worker hashes password
5. Worker makes fetch request to MongoDB Data API
6. New user saved to `sample_mflix.users` collection
7. Session created and user logged in

### Example: Saving a User
```typescript
const client = getMongoDBClient();
const result = await client.insertOne("users", {
  email: "user@example.com",
  passwordHash: "hashed_password",
  name: "User Name",
  createdAt: new Date()
});
console.log("User created with ID:", result.insertedId);
```

### CRUD Operations Available
```typescript
import { getMongoDBClient } from '@/db/mongodb';

const client = getMongoDBClient();

// Create
const { insertedId } = await client.insertOne('users', { email: 'user@test.com' });

// Read
const user = await client.findOne('users', { email: 'user@test.com' });
const users = await client.findDocuments('users', { status: 'active' });

// Update
await client.updateOne('users', 
  { _id: userId },
  { lastLogin: new Date() }
);

// Delete
await client.deleteOne('users', { _id: userId });
```

## Troubleshooting

### "MONGODB_API_URL and MONGODB_API_KEY not configured"
- Make sure both are in `.dev.vars`
- Check spelling exactly matches the file
- Restart `npm run dev` after editing

### "Data API error 401"
- API key is invalid or expired
- Create a new API key in App Services
- Make sure it has the right permissions

### "Data API error 404" on collection
- Collection `users` might not exist yet
- The API will create it when you insert the first document
- Or, ensure your rules allow access to this collection

### "Unauthorized" when registering
- Check that your API key has "Server" permissions
- Make sure the Data API rule allows writes

### Registration form not working
- Check browser console for fetch errors
- Check `.dev.vars` has correct values
- Test with curl command above first

## Production Deployment

For production with Cloudflare Workers:

```bash
# Set secrets (not in git!)
wrangler secret put MONGODB_API_URL --env production
wrangler secret put MONGODB_API_KEY --env production

# Deploy
wrangler deploy --env production
```

Then update `wrangler.json` production env:
```json
{
  "env": {
    "production": {
      "vars": {
        "MONGODB_DATABASE": "sample_mflix"
      }
    }
  }
}
```

## Security Notes

✅ **Good practices:**
- API key stored in `.dev.vars` (not committed to git)
- Passwords hashed before storage (see UserSchema.ts)
- Data API validates all requests
- HTTPS only (data.mongodb-api.com)

⚠️ **Remember:**
- Don't commit `.dev.vars` with real credentials
- Rotate API keys periodically
- Use strong passwords for MongoDB Atlas account
- Monitor API usage in Atlas console

## Sample Database Collections

Your sample_mflix database includes:
- `movies` - Sample movie documents
- `comments` - Sample comments
- `users` - Will store your registered users

You can query any of these collections using the client!

## Next Steps

1. ✅ Get Data API URL and Key from MongoDB Atlas
2. ✅ Update `.dev.vars`
3. ✅ Test registration endpoint
4. ✅ Set database rules for users collection
5. Start your app: `npm run dev`

## Resources

- [MongoDB Data API Docs](https://www.mongodb.com/docs/atlas/app-services/data-api/)
- [Sample Dataset Overview](https://www.mongodb.com/docs/atlas/sample-data/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
