# REST API Documentation
## Smart Template-Based Document Generation System

---

## **Base URL**
```
http://localhost:5000/api
```

---

## **Authentication**

All document endpoints require JWT authentication.

### **Header Format**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### **Getting a Token**

First, register/login to get a token:

```bash
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## **Document Endpoints**

### **📝 1. Create Document**

**Endpoint:**
```
POST /documents
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "templateType": "resume",
  "documentName": "John_Doe_Resume",
  "documentData": {
    "fullName": "John Doe",
    "contactInfo": {
      "phone": "+1-234-567-8900",
      "email": "john@example.com",
      "address": "123 Main St, City"
    },
    "careerObjective": "Seeking software development role",
    "education": {
      "rows": [
        ["B.S. Computer Science", "University", "2021", "3.8"]
      ]
    },
    "workExperience": {
      "rows": [
        ["Software Developer", "Tech Inc", "2021-Present", "Development"]
      ]
    },
    "technicalSkills": "JavaScript, React, Node.js",
    "certifications": "AWS Solutions Architect",
    "declaration": "I declare this is true",
    "signature": "John Doe",
    "date": "2024-02-25"
  }
}
```

**Response (201 Created):**
```json
{
  "message": "Document created successfully",
  "documentId": "507f1f77bcf86cd799439012",
  "document": {
    "_id": "507f1f77bcf86cd799439012",
    "templateType": "resume",
    "documentName": "John_Doe_Resume",
    "createdAt": "2024-02-25T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Unauthorized (no token)
- `500` - Internal server error

---

### **📋 2. List All Documents**

**Endpoint:**
```
GET /documents
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
(None - returns all user documents)
```

**Response (200 OK):**
```json
{
  "count": 3,
  "documents": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "templateType": "resume",
      "documentName": "John_Doe_Resume",
      "createdAt": "2024-02-25T10:30:00.000Z",
      "updatedAt": "2024-02-25T10:35:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "templateType": "invoice",
      "documentName": "Invoice_2024_001",
      "createdAt": "2024-02-25T11:00:00.000Z",
      "updatedAt": "2024-02-25T11:05:00.000Z"
    }
  ]
}
```

---

### **🔍 3. Get Specific Document**

**Endpoint:**
```
GET /documents/{documentId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Parameters:**
```
documentId: String (MongoDB ObjectId)
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439000",
  "templateType": "resume",
  "documentName": "John_Doe_Resume",
  "documentData": { ... },
  "createdAt": "2024-02-25T10:30:00.000Z",
  "updatedAt": "2024-02-25T10:35:00.000Z"
}
```

**Error Responses:**
- `404` - Document not found
- `403` - Access denied (not document owner)
- `401` - Unauthorized

---

### **✏️ 4. Update Document**

**Endpoint:**
```
PUT /documents/{documentId}
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:** (at least one field required)
```json
{
  "documentName": "John_Doe_Resume_Updated",
  "documentData": {
    "fullName": "John David Doe",
    "technicalSkills": "JavaScript, React, Node.js, TypeScript, Python"
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Document updated successfully",
  "documentId": "507f1f77bcf86cd799439012",
  "updatedAt": "2024-02-25T10:40:00.000Z"
}
```

**Error Responses:**
- `400` - No fields to update
- `404` - Document not found
- `403` - Access denied
- `401` - Unauthorized

---

### **🗑️ 5. Delete Document**

**Endpoint:**
```
DELETE /documents/{documentId}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Document deleted successfully"
}
```

**Error Responses:**
- `404` - Document not found
- `403` - Access denied
- `401` - Unauthorized

---

### **📄 6. Generate PDF**

**Endpoint:**
```
POST /documents/{documentId}/generate-pdf
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```
[Binary PDF Data]
Headers:
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="resume_1708867200000.pdf"
```

**Error Responses:**
- `404` - Document not found
- `403` - Access denied
- `400` - Unknown template type
- `401` - Unauthorized

---

### **📊 7. Update Table Section (Legacy)**

**Endpoint:**
```
POST /documents/update
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "documentId": "507f1f77bcf86cd799439012",
  "sectionId": "education",
  "table": {
    "rows": [
      ["B.S. Computer Science", "University", "2021", "3.8"],
      ["High School Diploma", "Local HS", "2017", "4.0"]
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Section table updated"
}
```

---

## **Authentication Endpoints**

### **Register**
```
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### **Login**
```
POST /auth/login
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### **Get Current User**
```
GET /auth/me
Headers: Authorization: Bearer {token}
```

### **Logout**
```
POST /logout
```

---

## **Health Check Endpoints**

### **Server Health**
```
GET /health
Response: { "status": "OK", "message": "Server is running" }
```

### **Database Status**
```
GET /db-status
Response: { "status": "connected", "message": "Connected to MongoDB" }
```

---

## **Template Types & Fields**

### **Resume**
```
{
  "templateType": "resume",
  "documentData": {
    "fullName": String,
    "contactInfo": {
      "phone": String,
      "email": String,
      "address": String,
      "linkedin": String
    },
    "careerObjective": String,
    "education": { "rows": [[String, String, String, String]] },
    "technicalSkills": String,
    "projects": String,
    "workExperience": { "rows": [[String, String, String, String]] },
    "certifications": String,
    "achievements": String,
    "declaration": String,
    "signature": String,
    "date": String (YYYY-MM-DD)
  }
}
```

### **Invoice**
```
{
  "templateType": "invoice",
  "documentData": {
    "companyInfo": {
      "logo": String,
      "name": String,
      "address": String,
      "email": String,
      "phone": String
    },
    "invoiceNumber": String,
    "invoiceDate": String (YYYY-MM-DD),
    "dueDate": String (YYYY-MM-DD),
    "billTo": {
      "name": String,
      "address": String,
      "email": String
    },
    "shippingAddress": String,
    "items": { "rows": [[String, Number, Number, Number, Number]] },
    "subtotal": String,
    "taxAmount": String,
    "grandTotal": String,
    "paymentTerms": String,
    "bankDetails": String,
    "signature": String
  }
}
```

### **Offer Letter**
```
{
  "templateType": "offer-letter",
  "documentData": {
    "companyInfo": {
      "logo": String,
      "name": String,
      "address": String
    },
    "date": String,
    "candidateName": String,
    "candidateAddress": String,
    "subject": String,
    "salutation": String,
    "bodyIntro": String,
    "jobRole": String,
    "salaryDetails": {
      "ctc": String,
      "frequency": String
    },
    "joiningDate": String,
    "termsAndConditions": String,
    "closingParagraph": String,
    "hrName": String,
    "signature": String
  }
}
```

### **Certificate**
```
{
  "templateType": "certificate",
  "documentData": {
    "organizationName": String,
    "logo": String,
    "certificateTitle": String,
    "recipientName": String,
    "courseName": String,
    "duration": String,
    "date": String,
    "signature": String,
    "registrationNumber": String
  }
}
```

### **Report**
```
{
  "templateType": "report",
  "documentData": {
    "title": String,
    "subtitle": String,
    "preparedBy": String,
    "submittedTo": String,
    "institutionName": String,
    "abstract": String,
    "tableOfContents": String,
    "chapter1": String,
    "chapter2": String,
    "chapter3": String,
    "conclusion": String,
    "references": String
  }
}
```

### **Syllabus**
```
{
  "templateType": "syllabus",
  "documentData": {
    "universityName": String,
    "departmentName": String,
    "courseCode": String,
    "courseTitle": String,
    "credits": String,
    "objectives": String,
    "outcomes": String,
    "units": { 
      "rows": [[String, String, String, String, String, String]]
    },
    "evaluation": {
      "rows": [[String, String]]
    },
    "textbooks": String
  }
}
```

---

## **HTTP Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (user exists) |
| 500 | Internal Server Error |

---

## **Error Response Format**

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "details": "Additional information (development only)"
}
```

Example:
```json
{
  "error": "Document not found",
  "status": 404
}
```

---

## **Rate Limiting**

Currently **no rate limiting** implemented. This should be added for production.

---

## **Pagination**

Currently **no pagination** implemented. All documents are returned. This should be added for large datasets.

---

## **Sorting & Filtering**

Currently returns documents sorted by `createdAt` (newest first).

Future enhancements:
- Sort by name
- Filter by template type
- Date range filtering

---

## **CORS Settings**

```
Origin: http://localhost:5173 (development)
Credentials: true
Methods: GET, POST, PUT, DELETE, OPTIONS
Headers: Content-Type, Authorization
```

---

## **Example cURL Requests**

### **Create Resume**
```bash
curl -X POST http://localhost:5000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '@resume.json'
```

### **List Documents**
```bash
curl http://localhost:5000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Generate PDF**
```bash
curl -X POST http://localhost:5000/api/documents/{docId}/generate-pdf \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o document.pdf
```

---

## **Webhook Support**

Not currently implemented. Consider adding for:
- Document created events
- Document updated events
- PDF generated events

---

**API Version:** 1.0
**Last Updated:** February 25, 2026
**Status:** Production Ready ✅
