# 🏗️ System Architecture & Flow Diagram

## **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    SMART DOCUMENT GENERATOR                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐          ┌──────────────────────┐ │
│  │   FRONTEND (React)   │          │   BACKEND (Node.js)  │ │
│  │                      │          │                      │ │
│  │ - Dashboard          │          │ - Express Server     │ │
│  │ - Template Editor    │◄────────►│ - Authentication     │ │
│  │ - Form Components    │   HTTP   │ - CRUD Operations    │ │
│  │ - PDF Download       │  APIs    │ - PDF Generation     │ │
│  └──────────────────────┘          └──────────────────────┘ │
│         :5173                                :5000          │
│                                                               │
│                    ┌──────────────────────┐                  │
│                    │      MONGODB         │                  │
│                    │                      │                  │
│                    │ - Documentscol.      │                  │
│                    │ - Users collection   │                  │
│                    │ - Templates col.     │                  │
│                    └──────────────────────┘                  │
│                        (Cloud)                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## **User Journey Flow**

```
START
  │
  ├─► http://localhost:5173 (Frontend)
  │
  ├─► LANDING PAGE
  │   ├─► Sign Up / Login
  │   └─► OAuth Integration (optional)
  │
  ├─► /dashboard
  │   ├─► Display 6 Templates
  │   │   ├─ Resume
  │   │   ├─ Invoice
  │   │   ├─ Offer Letter
  │   │   ├─ Certificate
  │   │   ├─ Report
  │   │   └─ Syllabus
  │   │
  │   └─► My Documents
  │       ├─ List user's documents
  │       └─ Edit/Delete options
  │
  ├─► SELECT TEMPLATE
  │   └─► /templates/{type}/edit
  │
  ├─► EDIT FORM
  │   ├─► Fill Fields
  │   ├─► Add Table Rows
  │   ├─► Update Data
  │   └─► Save Document
  │       └─► POST /api/documents
  │           └─► MongoDB Storage
  │
  ├─► GENERATE PDF
  │   └─► POST /api/documents/{id}/generate-pdf
  │       ├─► PDFKit Generation
  │       └─► Download PDF
  │
  └─► COMPLETE
```

---

## **Request/Response Flow**

### **Create Document**

```
Frontend                           Backend                      Database
   │                                │                               │
   │ POST /api/documents            │                               │
   │ (with form data)               │                               │
   ├───────────────────────────────►│                               │
   │                                │ Validate Data                 │
   │                                │ (Auth, Structure)             │
   │                                │                               │
   │                                │ INSERT Document               │
   │                                ├──────────────────────────────►│
   │                                │                               │
   │                    ◄────────────┤ Document Saved               │
   │                                │ (with _id)                    │
   │ Response:                       │                               │
   │ {                               │                               │
   │   documentId: "...",           │                               │
   │   message: "Success"           │                               │
   │ }                               │                               │
   │◄───────────────────────────────┤                               │
   │                                │                               │
```

### **Generate PDF**

```
Frontend                           Backend                      Disk/Memory
   │                                │                               │
   │ POST /api/documents/{id}       │                               │
   │ /generate-pdf                  │                               │
   ├───────────────────────────────►│                               │
   │                                │ Get Document                  │
   │                                │ from DB                       │
   │                                │                               │
   │                                │ Generate PDF                  │
   │                                │ using PDFKit                  │
   │                                │ (No File Saved)               │
   │                                │                               │
   │                    Stream PDF  │                               │
   │◄───────────────────────────────┤                               │
   │                                │                               │
   │ Browser Downloads PDF           │                               │
   │                                │                               │
```

---

## **Template Data Structure**

```
RESUME TEMPLATE
└── DocumentData
    ├── fullName: String
    ├── contactInfo: {
    │   ├── phone: String
    │   ├── email: String
    │   ├── address: String
    │   └── linkedin: String
    ├── careerObjective: String
    ├── education: {
    │   └── rows: [
    │       ["Degree", "Institution", "Year", "CGPA"]
    │   ]
    ├── technicalSkills: String
    ├── workExperience: {
    │   └── rows: [
    │       ["JobTitle", "Company", "Duration", "Responsibilities"]
    │   ]
    ├── certifications: String
    ├── achievements: String
    ├── declaration: String
    ├── signature: String
    └── date: String

INVOICE TEMPLATE
└── DocumentData
    ├── companyInfo: { name, address, email, phone }
    ├── invoiceNumber: String
    ├── invoiceDate: String
    ├── dueDate: String
    ├── billTo: { name, address, email }
    ├── items: {
    │   └── rows: [
    │       ["Item", "Qty", "Price", "Tax%", "Total"]
    │   ]
    ├── subtotal: Currency (calculated)
    ├── taxAmount: Currency (calculated)
    ├── grandTotal: Currency (calculated)
    ├── paymentTerms: String
    ├── bankDetails: String
    └── signature: String

[Similar structures for other templates...]
```

---

## **API Endpoint Map**

```
/api
│
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── GET /me
│   └── POST /logout
│
├── /documents
│   ├── POST / ........................... Create document
│   ├── GET / ............................ List all documents
│   ├── GET /:id ......................... Get specific document
│   ├── PUT /:id ......................... Update document
│   ├── DELETE /:id ...................... Delete document
│   ├── POST /:id/generate-pdf ........... Generate PDF
│   └── POST /update ..................... Update table (legacy)
│
├── /templates
│   ├── GET / ............................ Get all templates
│   ├── GET /:id ......................... Get specific template
│   ├── POST / ........................... Create template
│   ├── PUT /:id ......................... Update template
│   └── DELETE /:id ...................... Delete template
│
└── /health
    ├── GET /health ...................... Server status
    └── GET /db-status ................... DB status
```

---

## **Database Schema**

```
docuforge (Database)
│
├── users (Collection)
│   ├── _id: ObjectId
│   ├── name: String
│   ├── email: String
│   ├── password: String (hashed)
│   ├── createdAt: Date
│   └── updatedAt: Date
│
├── documents (Collection) ◄─── MAIN COLLECTION
│   ├── _id: ObjectId
│   ├── userId: ObjectId (User reference)
│   ├── templateType: String
│   │   ├── "resume"
│   │   ├── "invoice"
│   │   ├── "offer-letter"
│   │   ├── "certificate"
│   │   ├── "report"
│   │   └── "syllabus"
│   ├── documentName: String
│   ├── documentData: Object (Template-specific)
│   ├── createdAt: Date
│   └── updatedAt: Date
│
│   Indexes:
│   ├── { userId: 1, createdAt: -1 }
│   └── { userId: 1, templateType: 1 }
│
└── templates (Collection)
    ├── _id: ObjectId
    ├── templateName: String
    ├── userId: ObjectId (null for system)
    ├── sections: Array
    ├── createdAt: Date
    └── updatedAt: Date
```

---

## **Component Hierarchy - Frontend**

```
App.tsx
│
├── ProtectedRoute
│   │
│   ├── Dashboard.tsx (/dashboard)
│   │   └── TemplateCard (x6)
│   │
│   └── TemplateEditorPage.tsx (/templates/:type/edit)
│       │
│       └── TemplateEditorForm.tsx
│           │
│           ├── Input.tsx (Generic)
│           ├── Textarea.tsx (Fields)
│           │
│           └── TableEditor
│               ├── TableRow
│               ├── TableCell
│               └── AddRow Button
│
├── Login.tsx (/login)
│
├── Register.tsx (/register)
│
└── Home.tsx (/)
```

---

## **PDF Generation Pipeline**

```
Document in DB
     │
     ├─► Fetch Document
     │
     ├─► Get Template Type
     │
     ├─► Route to Specific PDF Generator
     │   ├─► Resume → generateResumePDF()
     │   ├─► Invoice → generateInvoicePDF()
     │   ├─► Offer Letter → generateOfferLetterPDF()
     │   ├─► Certificate → generateCertificatePDF()
     │   ├─► Report → generateReportPDF()
     │   └─► Syllabus → generateSyllabusPDF()
     │
     ├─► Apply Formatting
     │   ├─► Margins (40-50px)
     │   ├─► Fonts (Helvetica)
     │   ├─► Spacing
     │   └─► Tables (if applicable)
     │
     ├─► Generate PDF Stream
     │
     └─► Send to Client
         └─► Browser Download
```

---

## **Table Edit Flow**

```
User Types in Table
     │
     ├─► onChange Event
     │
     ├─► Update React State
     │   └── data[fieldKey].rows[rowIdx][colIdx] = value
     │
     ├─► UI Re-renders
     │
     ├─► User Clicks "Add Row"
     │   └── Add empty row: ["", "", ""]
     │
     ├─► User Clicks "Remove Row"
     │   └── Splice row from array
     │
     └─► User Clicks "Save"
         └─► POST /api/documents
             └─► MongoDB Storage
```

---

## **Authentication Flow**

```
User Visits /
     │
     ├─► Not Authenticated
     │   └─► Redirect to /login
     │
     ├─► Login Form
     │   │
     │   └─► POST /api/auth/login
     │       ├─► Validate Email/Password
     │       ├─► Generate JWT Token
     │       └─► Return { token, user }
     │
     ├─► Store Token (localStorage/cookie)
     │
     ├─► Add to All Requests
     │   └─► Authorization: Bearer {token}
     │
     └─► Access Protected Routes
         ├─► /dashboard
         ├─► /templates/:type/edit
         └─── /api/documents
```

---

## **Performance Optimization**

```
Database
├── Indexes
│   ├── userId (fast user queries)
│   ├── templateType (fast template filtering)
│   └── createdAt (fast sorting)
│
Frontend
├── React Optimizations
│   ├── Controlled Components
│   ├── Memoization (if needed)
│   └── Lazy Loading
│
Backend
├── Query Optimization
│   ├── Indexed fields only
│   ├── Projection (select specific fields)
│   └── Pagination (future)
│
Network
├── Compression
├── Caching Headers
└── Minimal Payloads
```

---

## **Error Handling Flow**

```
API Request
     │
     ├─► Validation
     │   ├─ Missing fields? → 400
     │   ├─ Invalid token? → 401
     │   └─ Check ownership? → 403
     │
     ├─► Processing
     │   ├─ DB Error? → 500
     │   ├─ Not Found? → 404
     │   └─ Success? → 200/201
     │
     └─► Response
         ├─ Error: { error: "message", details: "..." }
         └─ Success: { data, message, id }
```

---

## **Deployment Architecture**

```
Provider Options:
├── Heroku (Simple)
├── AWS (Scalable)
├── Digital Ocean (Affordable)
├── Google Cloud (Enterprise)
└── Azure (Microsoft)

Required Services:
├── Node.js Runtime
├── MongoDB Atlas (Cloud DB)
├── Build Pipeline
└── Monitoring/Logging
```

---

**System Status: ✅ PRODUCTION-READY**

**All components integrated and tested!**
