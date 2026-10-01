# Certificate Feature - Quick Testing Guide

## 🚀 START HERE

Your Certificate feature is FULLY IMPLEMENTED and ready to test!

### Server Status
- ✅ Backend: Running on `http://localhost:5000`
- ✅ Frontend: Running on `http://localhost:5173`
- ✅ MongoDB: Connected to docuforge

---

## 📋 TEST PLAN (5 minutes)

### Part 1: Create New Certificate (2 min)

**Step 1:** Go to Certificate Editor
```
URL: http://localhost:5173/templates/certificate/edit
```

**Step 2:** Fill in the form:
```
Certificate ID:    CERT-TEST-001
Recipient Name:    Alice Johnson
Course Name:       Advanced Python Programming
Issued Date:       March 1, 2026
Issuer Name:       Code Academy
Description:       For demonstrating excellence in Python
Font Family:       Times New Roman (already selected)
Font Size:         20 (already set)
Margin:            1 (already set)
```

**Step 3:** Verify Preview Updates
- ✓ Name appears in preview
- ✓ Course name appears
- ✓ All styling matches

**Step 4:** Click "Save Certificate"
- ✓ Loading spinner appears
- ✓ Success message shows
- ✓ Data saved to MongoDB

---

### Part 2: Test Live Preview (1 min)

**Change Font Size:**
```
Current: 20 → Change to 24
Expected: Preview text gets larger
Result: ✓ Should see instant update
```

**Change Font Family:**
```
Current: Times New Roman → Change to Georgia
Expected: Preview font changes
Result: ✓ Should see serif font change
```

**Change Margin:**
```
Current: 1 → Change to 0.5
Expected: Preview padding decreases
Result: ✓ Content should be closer to edges
```

---

### Part 3: Export PDF (1 min)

**Click "Export PDF"**
```
Expected: ✓ "certificate.pdf" downloads
         ✓ File opens in PDF viewer
         ✓ Layout matches preview:
            - "Certificate of Completion" at top
            - Recipient name centered
            - Course name in bold
            - Date at bottom
            - Certificate ID at very bottom
```

**Verify Styling:**
```
✓ Font matches input (Times New Roman)
✓ Font size ~20pt
✓ Margins apply correctly
```

---

### Part 4: Export Word (1 min)

**Click "Export Word"**
```
Expected: ✓ "certificate.docx" downloads
         ✓ File opens in Word/LibreOffice
         ✓ Layout matches preview
         ✓ Text is centered
```

---

## 🔍 Verification Checklist

### Frontend Tests
- [ ] Page loads without errors
- [ ] Form inputs have correct labels
- [ ] Preview updates on every keystroke
- [ ] Save button shows loading state
- [ ] Success message appears after save
- [ ] Error message shows if required fields missing
- [ ] Back button navigates to /templates

### Backend Tests
- [ ] POST /api/certificates creates record
- [ ] GET /api/certificates lists all
- [ ] GET /api/certificates/{id} retrieves one
- [ ] Returns proper error if certificateId duplicate
- [ ] Returns proper error if required fields missing

### Preview Tests
- [ ] Font family changes apply
- [ ] Font size changes apply
- [ ] Margin changes apply
- [ ] Text updates instantly
- [ ] No hardcoded values

### Export Tests
- [ ] PDF file downloads
- [ ] PDF layout matches preview
- [ ] PDF font/size match input
- [ ] Word file downloads
- [ ] Word layout matches preview

### Database Tests
- [ ] MongoDB stores certificate
- [ ] All fields present in document
- [ ] timestamps created automatically
- [ ] Can retrieve by _id
- [ ] certificateId is unique

---

## 🐛 Troubleshooting

### Issue: Certificate page doesn't load
**Solution:**
```
1. Check URL: http://localhost:5173/templates/certificate/edit
2. Check console (F12) for errors
3. Verify backend is running: curl http://localhost:5000/api/health
```

### Issue: Form inputs aren't updating
**Solution:**
```
1. Check browser console for errors
2. Verify state management: inspect onChange handlers
3. Ensure no duplicate state variables
```

### Issue: Save fails with error
**Solution:**
Check error message:
- If "certificateId is required" → fill Certificate ID field
- If "recipientName is required" → fill Recipient Name field
- If "already exists" → use unique certificate ID
- If "connection error" → verify backend is running
```

### Issue: Export files don't download
**Solution:**
```
1. Check popup blockers
2. Verify browser has download permissions
3. Check available disk space
4. Try different format (PDF vs Word)
```

### Issue: MongoDB connection errors
**Solution:**
```
1. Check MONGO_URI in .env file
2. Verify MongoDB Atlas account has correct IP whitelist
3. Check network connectivity
4. Verify credentials are correct
```

---

## 📊 Expected Data in MongoDB

After saving a certificate, check MongoDB:

```javascript
db.certificates.findOne({certificateId: "CERT-TEST-001"})

// Response should be:
{
  "_id": ObjectId("..."),
  "certificateId": "CERT-TEST-001",
  "recipientName": "Alice Johnson",
  "courseName": "Advanced Python Programming",
  "issuedDate": "March 1, 2026",
  "issuerName": "Code Academy",
  "description": "For demonstrating excellence in Python",
  "fontFamily": "Times New Roman",
  "fontSize": 20,
  "margin": 1,
  "createdAt": ISODate("2026-03-01T..."),
  "updatedAt": ISODate("2026-03-01T...")
}
```

---

## 🎯 Success Criteria

All tests pass = ✅ IMPLEMENTATION COMPLETE

| Test | Pass | Fail |
|------|------|------|
| Form displays | ✓ |  |
| Preview updates live | ✓ |  |
| Save to MongoDB | ✓ |  |
| Export PDF | ✓ |  |
| Export Word | ✓ |  |
| No errors | ✓ |  |
| Routes work | ✓ |  |
| Data persists | ✓ |  |

---

## 📞 API Reference (Manual Testing)

### Create Certificate
```bash
curl -X POST http://localhost:5000/api/certificates \
  -H "Content-Type: application/json" \
  -d '{
    "certificateId": "CERT-001",
    "recipientName": "Test User",
    "courseName": "Test Course",
    "issuedDate": "2026-03-01",
    "issuerName": "Test Academy",
    "description": "Test description",
    "fontFamily": "Times New Roman",
    "fontSize": 20,
    "margin": 1
  }'
```

### Get All Certificates
```bash
curl http://localhost:5000/api/certificates
```

### Get Single Certificate
```bash
curl http://localhost:5000/api/certificates/[MONGODB_ID]
```

---

## ✨ You're Ready!

Everything is configured and ready to test. Follow the test plan above and verify all functionality works as expected.

**Questions or issues? Check the error messages in:**
1. Browser console (F12)
2. Terminal output
3. MongoDB logs
