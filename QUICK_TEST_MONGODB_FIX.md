# Quick Test Guide - MongoDB Save Fixes

## Test in 5 Minutes

### 1. Start Server
```bash
npm start  # or: node server.js
```

**Wait for:**
```
✅ Successfully connected to MongoDB database: docuforge
✅ Server running at http://localhost:5000
```

### 2. Test Database Connection
Visit in browser: `http://localhost:5000/api/db-status`

**Expected:** 
```json
{ "status": "connected", "message": "Connected to MongoDB" }
```

### 3. Test Backend Middleware (Postman/curl)

**Endpoint:** POST http://localhost:5000/api/test-save

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "templateType": "resume",
  "documentName": "Test Save",
  "testData": { "title": "Test" }
}
```

**Watch server logs for:**
- ✅ `[Middleware] POST /api/test-save`
- ✅ `[TestEndpoint] Received test save request`
- ✅ `[TestEndpoint] Attempting test insert...`
- ✅ `Test insert successful`
- ✅ `Test save completed successfully`

**Expected Response:**
```json
{
  "success": true,
  "message": "Test save completed successfully",
  "details": {
    "mongodbConnected": true,
    "insertTest": "passed",
    "readTest": "passed"
  }
}
```

### 4. Test Frontend Save

**Login** → **Edit Template** → **Click Save**

**Watch server logs for complete flow:**

```
📨 [Middleware] POST /api/documents/save
📥 [DocumentController] Received request body: ['templateType', 'documentName', 'documentData']
📝 [DocumentModel] Creating document...
✅ [DocumentModel] Document inserted successfully
✅ [DocumentModel] Inserted ID: <ObjectId>
✅ [DocumentController] Document created successfully
📤 [DocumentController] Sending response:
```

**Frontend shows:** ✅ "Document saved successfully! ID: ..."

### 5. Verify in MongoDB Atlas

**Check:** docuforge → documents collection

**You should see:**
- New documents with `templateType`, `documentName`, `documentData` fields
- `userId` field matching logged-in user
- `createdAt` and `updatedAt` timestamps

---

## Quick Troubleshooting

| Problem | Check |
|---------|-------|
| No logs appearing | Is NODE_ENV production? Add `NODE_ENV=development` |
| "DB not connected" | Check MONGO_URI environment variable |
| "unauthorized" | Is auth token passed? Check /api/auth/login |
| Data not in DB | Check userId matches between logs and MongoDB |
| "test-save returns 500" | Check MongoDB permissions and IP whitelist |

---

## Console Log Legend

- ✅ = Success
- ❌ = Error
- 📨 = Middleware
- 📥 = Request input
- 📝 = Database write
- 📋 = Database read
- 🗑️ = Database delete
- ✏️ = Database update
- 🔍 = Searching
- 🧪 = Test operation

---

Once all 5 tests pass ✅, your MongoDB saving is working correctly!
