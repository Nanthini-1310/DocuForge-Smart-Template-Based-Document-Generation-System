# DocuForge – Smart Template-Based Document Generation System

DocuForge is a web-based smart template system that allows users to create, customize, save, edit, and export professional documents using predefined templates.

The system supports multiple document types such as Resumes, Invoices, Reports, Certificates, Offer Letters, and Syllabi. Users can enter their information, customize document formatting, add additional sections, and export the final document as PDF or Word.

## Features

- Predefined templates for different document types
- Dynamic document creation and editing
- Custom sections using an Add (+) option
- Font family and font size customization
- Page margin customization
- Structured fields based on document type
- Save documents for future editing
- MongoDB database storage
- PDF export
- Word document export
- Recent documents section
- My Documents section
- Template-based document recommendations
- Easy navigation between Dashboard and Templates
- User-specific document management

## Supported Templates

### Resume
- Personal Information
- Career Objective / Summary
- Education
- Skills
- Experience
- Projects
- Certifications
- Achievements
- Custom Sections

### Invoice
- Invoice Number
- Invoice Date
- Due Date
- Seller Information
- Customer Information
- Product / Service Details
- Quantity
- Price
- Tax
- Subtotal
- Total Amount
- Payment Information
- Notes

### Certificate
- Certificate Title
- Recipient Name
- Certificate ID
- Achievement / Course Details
- Organization Name
- Issue Date
- Duration
- Authorized Signatory
- Signature
- Custom Sections

### Offer Letter
- Company Information
- Candidate Information
- From Address
- To Address
- Offer Date
- Job Position
- Joining Date
- Salary / Compensation
- Employment Terms
- Benefits
- HR / Authorized Signatory
- Custom Sections

### Report
- Report Title
- Author Information
- Organization
- Date
- Introduction
- Objectives
- Main Content
- Findings
- Results
- Conclusion
- References
- Custom Sections

### Syllabus
- Institution Name
- Course Name
- Course Code
- Academic Year
- Course Duration
- Course Objectives
- Course Outcomes
- Unit Details
- Topics
- References
- Faculty Information
- Custom Sections

## Smart Features

The term "Smart" refers to the system's ability to provide structured templates, dynamic fields, reusable templates, customizable formatting, document-specific sections, saved documents, and template recommendations.

The system does not require AI-based document generation to be considered smart. Its intelligence comes from rule-based template handling, dynamic content management, formatting automation, and document-specific workflows.

## Technology Stack

### Frontend
- React.js
- TypeScript
- Vite
- HTML
- CSS
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Document Generation
- PDF generation
- Word (.docx) generation

## System Architecture

User
↓
React Frontend
↓
Document Template Editor
↓
Node.js / Express Backend
↓
MongoDB Atlas
↓
Document Storage

For Export:

Document Editor
↓
Formatting Engine
↓
PDF / Word Export
↓
Downloaded Document

## Document Workflow

1. User opens the Dashboard.
2. User selects a document template.
3. The system opens the corresponding editor.
4. User enters the required information.
5. User can customize font, size, margins, and sections.
6. User can add additional sections using the (+) button.
7. User saves the document.
8. Document data is stored in MongoDB.
9. User can reopen the saved document.
10. User can export the document as PDF or Word.

## Database

MongoDB Atlas is used for storing document information.

The system maintains document data based on document type, such as:

- Resumes
- Invoices
- Certificates
- Offer Letters
- Reports
- Syllabi
- Templates
- User Documents

Each saved document can be retrieved and edited later.

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
