# MongoDB Realm Web - Quick Start

## Installation Complete ✓

- `realm-web` library installed
- `src/db/mongodb.ts` updated with Realm authentication
- `.dev.vars` configured with Realm environment variables
- `MONGODB_REALM_SETUP.md` contains detailed setup instructions

## Quick Setup (2 minutes)

1. **Get your Realm App ID:**
   - Go to [MongoDB Atlas Console](https://cloud.mongodb.com)
   - Select your project → App Services → Your App → Settings
   - Copy the App ID

2. **Update `.dev.vars`:**
   ```
   REALM_APP_ID="your-app-id-here"
   MONGODB_DATABASE="docuforge"
   ```

3. **Enable Anonymous Authentication** (recommended for Workers):
   - In App Services → Authentication → Providers
   - Enable "Anonymous"
   - Create security rules for your collections

4. **Start using it:**

```typescript
import { connectToDatabase, getMongoDBClient } from './src/db/mongodb';

// In your Worker handler
await connectToDatabase(); // Authenticates anonymously

const client = getMongoDBClient();
const users = await client.findDocuments('users');
```

## Common Operations

```typescript
import { getMongoDBClient, connectToDatabase } from './src/db/mongodb';

// Initialize
await connectToDatabase();
const client = getMongoDBClient();

// Find
const users = await client.findDocuments('users', { status: 'active' });
const user = await client.findOneDocument('users', { _id: 'userId' });

// Create
const id = await client.insertOneDocument('users', {
  name: 'John',
  email: 'john@example.com'
});

// Update
await client.updateOneDocument('users', 
  { _id: id },
  { lastLogin: new Date() }
);

// Delete
await client.deleteOneDocument('users', { _id: id });

// Cleanup
await client.logout();
```

## Why realm-web?

✅ **Worker Compatible** - No punycode errors, no Node.js dependencies  
✅ **Stateless** - Perfect for serverless environments  
✅ **Built-in Auth** - Anonymous, Email/Password (no API key management)  
✅ **Secure** - Credentials handled by MongoDB Realm  

## No punycode Error!

The realm-web library doesn't use Node.js-specific modules, so it runs cleanly in Cloudflare Workers without triggering the deprecated `punycode` module error.

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `REALM_APP_ID` | Yes | `myapp-12345abcdef` |
| `MONGODB_DATABASE` | No | `docuforge` |
| `MONGODB_REALM_API_KEY` | No | For API auth |
| `MONGODB_REALM_EMAIL` | No | For Email/Password |
| `MONGODB_REALM_PASSWORD` | No | For Email/Password |

## Authentication Methods

### Anonymous (Simple, Recommended)
```typescript
await connectToDatabase(); // Auto-authenticates anonymously
```

### Email/Password (Secure)
```typescript
import { authenticateWithEmailPassword } from './src/db/mongodb';

await authenticateWithEmailPassword('user@example.com', 'password');
```

## Production Deployment

For production, use wrangler secrets:

```bash
# Set your Realm App ID as a secret
wrangler secret put REALM_APP_ID --env production

# Deploy
wrangler deploy --env production
```

## Troubleshooting

**"Realm App ID not configured"**
- Ensure REALM_APP_ID is in .dev.vars or wrangler.json

**"Anonymous authentication failed"**
- Check Anonymous provider is enabled in App Services
- Verify security rules allow anonymous access

**Database Queries Fail**
- Make sure collection security rules are set up
- Check MONGODB_DATABASE name matches your database

## See Also

- [MONGODB_REALM_SETUP.md](./MONGODB_REALM_SETUP.md) - Detailed configuration guide
- [Realm Web SDK Docs](https://www.mongodb.com/docs/realm/web/)
- [MongoDB Atlas App Services](https://www.mongodb.com/docs/atlas/app-services/)
