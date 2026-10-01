# MongoDB Realm Web Setup Guide

This guide explains how to set up MongoDB Realm Web SDK (realm-web) for your Cloudflare Worker to connect to MongoDB Atlas without using the Data API.

## Why realm-web?

- **Worker-compatible**: No Node.js-specific dependencies, no punycode errors
- **Authentication**: Built-in support for Anonymous and Email/Password auth
- **Secure**: Credentials handled through MongoDB Realm, not exposed to client
- **Stateless**: Perfect for serverless/Workers environments

## Prerequisites

1. **MongoDB Atlas Account**: [Create one here](https://www.mongodb.com/cloud/atlas)
2. **Cluster**: An active MongoDB cluster (shared tier is free)
3. **Realm App**: Enabled App Services in Atlas

## Step 1: Enable MongoDB Realm in Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your project
3. In the left sidebar, click **App Services**
4. Click **Create App** if you haven't already
5. Create a new app (name it something like "realms-web-api")

## Step 2: Get Your Realm App ID

1. In your App Services app, go to **Settings** (gear icon)
2. Copy the **App ID** from the displayed information
3. Add it to `.dev.vars`:
   ```
   REALM_APP_ID="YOUR_REALM_APP_ID_HERE"
   ```

## Step 3: Configure Authentication Methods

### Option A: Anonymous Authentication (Recommended for Workers)

Anonymous authentication is the simplest and recommended approach for Cloudflare Workers.

1. In your App Services app, go to **Authentication** → **Providers**
2. Click **Authentication Providers**
3. Find **Anonymous** and click **Enable**
4. Save changes

Your worker can now authenticate using:
```typescript
import { connectToDatabase } from './src/db/mongodb';

// In your worker handler
await connectToDatabase(); // Authenticates anonymously
```

### Option B: Email/Password Authentication

Email/Password auth allows you to authenticate specific users before accessing data.

1. In your App Services app, go to **Authentication** → **Providers**
2. Click **Authentication Providers**
3. Find **Email/Password** and click **Enable**
4. Configure password requirements (or use defaults)
5. Save changes

To create a user:
1. Go to **App Users** in App Services
2. Click **Add User**
3. Enter email and password
4. Save

Then authenticate in your worker:
```typescript
import { authenticateWithEmailPassword } from './src/db/mongodb';

// In your worker handler
await authenticateWithEmailPassword('user@example.com', 'password');
```

## Step 4: Configure Database Access Rules

In your App Services app, you need to set up Rules to allow data access:

1. Go to **Rules** in the left sidebar
2. Click **New Rule**
3. Choose your database and collection
4. Select Apply When: **Authenticated Users** (for Email/Password) or **No additional permissions** (for Anonymous)
5. For anonymous, you might want to set template to **Users - Read/Write own data** or **Everyone - Read and write all data** (use carefully!)
6. Apply the rule

Example rule for Anonymous access to document collection:
```json
{
  "roles": [
    {
      "name": "default",
      "apply_when": {},
      "insert": true,
      "read": true,
      "write": true,
      "delete": true,
      "search": true
    }
  ]
}
```

## Step 5: Update Configuration

Edit `.dev.vars`:

```plaintext
# Your Realm App ID
REALM_APP_ID="your-app-id-12345abcdef"

# Database name
MONGODB_DATABASE="docuforge"

# Optional: API Key (leave empty for Anonymous)
MONGODB_REALM_API_KEY=""

# Optional: Email/Password credentials
MONGODB_REALM_EMAIL=""
MONGODB_REALM_PASSWORD=""
```

## Usage Examples

### Using the Client

```typescript
import { getMongoDBClient, connectToDatabase } from './src/db/mongodb';

// Initialize connection
await connectToDatabase();

const client = getMongoDBClient();

// Find documents
const users = await client.findDocuments('users', { status: 'active' });

// Find one document
const user = await client.findOneDocument('users', { email: 'user@example.com' });

// Insert document
const id = await client.insertOneDocument('users', {
  email: 'newuser@example.com',
  name: 'New User',
  createdAt: new Date()
});

// Update document
const updated = await client.updateOneDocument(
  'users',
  { _id: id },
  { lastLogin: new Date() }
);

// Delete document
const deleted = await client.deleteOneDocument('users', { _id: id });

// Logout
await client.logout();
```

### In a Cloudflare Worker

```typescript
import { Hono } from 'hono';
import { connectToDatabase, getMongoDBClient } from './src/db/mongodb';

const app = new Hono();

app.get('/api/users', async (c) => {
  try {
    // Connect to MongoDB Realm
    await connectToDatabase();
    
    const client = getMongoDBClient();
    const users = await client.findDocuments('users');
    
    return c.json(users);
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ error: 'Database error' }, 500);
  }
});

app.post('/api/users', async (c) => {
  try {
    await connectToDatabase();
    
    const body = await c.req.json();
    const client = getMongoDBClient();
    
    const id = await client.insertOneDocument('users', {
      ...body,
      createdAt: new Date()
    });
    
    return c.json({ id }, 201);
  } catch (error) {
    console.error('Insert error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

export default app;
```

## Troubleshooting

### "Realm App ID not configured"
- Make sure `REALM_APP_ID` is set in `.dev.vars`
- Verify the App ID is copied correctly from App Services Settings

### "Anonymous authentication failed"
- Check that Anonymous provider is enabled in Authentication Settings
- Verify your rules allow anonymous access

### "Email/Password authentication failed"
- Ensure user exists in App Users
- Check that Email/Password provider is enabled
- Verify password is correct

### CORS or Network Errors
- Realm Web SDK should work in Workers
- Check that your Realm app has proper security rules
- Ensure your Worker has access to make HTTPS requests

## Cloudflare Worker Compatibility

The realm-web library works without issues in Cloudflare Workers because:
- ✅ No Node.js-specific dependencies (no punycode issues)
- ✅ Uses standard fetch API for HTTP requests
- ✅ Browser/Worker compatible code
- ✅ No file system access needed
- ✅ Supports Web Crypto API

## Next Steps

1. Test your connection with `npm run dev`
2. Try creating/reading documents
3. Deploy to Cloudflare Workers with `wrangler deploy`
4. Test authentication methods in production

## Resources

- [Realm Web SDK Docs](https://www.mongodb.com/docs/realm/web/)
- [MongoDB Atlas App Services](https://www.mongodb.com/docs/atlas/app-services/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
