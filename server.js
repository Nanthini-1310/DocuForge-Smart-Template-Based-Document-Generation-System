/**
 * DocuForge Backend Server
 * Express.js server with direct MongoDB Atlas connection
 * No Cloudflare Workers, no Data API - pure Node.js
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// suppress deprecation warning from util._extend used by older deps
const util = require('util');
if (util._extend) {
  // replace with Object.assign which is non‑deprecated
  util._extend = Object.assign;
}

require('dotenv').config();
const { connectDB, getDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const Template = require('./models/Template');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// ---------- Security & Parsing Middlewares ----------
// 1. FIXED CORS configuration (no wildcard when credentials are used)
app.use(cors({
  origin: [
    'http://localhost:5173', // default dev port
    'http://localhost:5175', // fallback when Vite hops port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. REQUIRED FOR JSON DATA
app.use(express.json());

// cookies (JWT tokens) can come after CORS/json
app.use(cookieParser());

// 3. DATABASE CONNECTION (Mongoose)
mongoose.connect(process.env.MONGO_URI, { dbName: 'docuforge' })
  .then(() => console.log('🚀 Connected to MongoDB Atlas (dbName=docuforge)'))
  .catch(err => console.error('❌ Connection error:', err));

// Request body logging middleware - for debugging POST/PUT requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log(`\n📨 [Middleware] ${req.method} ${req.path}`);
    console.log('📨 [Middleware] Request body keys:', Object.keys(req.body));
    console.log('📨 [Middleware] Content-Type:', req.headers['content-type']);
    
    // Log body size and first 200 chars if small enough
    const bodyStr = JSON.stringify(req.body);
    console.log('📨 [Middleware] Body size:', bodyStr.length, 'bytes');
    
    if (bodyStr.length < 500) {
      console.log('📨 [Middleware] Full body:', req.body);
    } else {
      console.log('📨 [Middleware] Body preview:', bodyStr.substring(0, 200) + '...');
    }
  }
  next();
});


// -------- Middleware --------

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// -------- Routes --------

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API Running Successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const db = getDB();
    if (!db) {
      return res.status(503).json({ status: 'disconnected', message: 'Database not connected' });
    }
    // Verify connection with a ping
    await db.admin().ping();
    res.json({ status: 'connected', message: 'Connected to MongoDB' });
  } catch (error) {
    res.status(503).json({ status: 'error', message: error.message });
  }
});

// Diagnostic test endpoint - verify middleware and MongoDB
app.post('/api/test-save', async (req, res) => {
  try {
    console.log('\n========== TEST SAVE ENDPOINT ==========');
    console.log('🧪 [TestEndpoint] Received test save request');
    console.log('🧪 [TestEndpoint] Request body:', JSON.stringify(req.body, null, 2));
    console.log('🧪 [TestEndpoint] Headers:', {
      'content-type': req.headers['content-type'],
      'authorization': !!req.headers['authorization']
    });

    // Test data validation
    const { templateType, documentName, testData } = req.body;
    
    if (!templateType || !testData) {
      console.error('🧪 [TestEndpoint] Missing required test fields');
      return res.status(400).json({ 
        error: 'Missing fields', 
        required: ['templateType', 'testData']
      });
    }

    console.log('🧪 [TestEndpoint] Test data received successfully');

    // Test MongoDB connection
    try {
      const db = getDB();
      await db.admin().ping();
      console.log('🧪 [TestEndpoint] MongoDB ping successful');
    } catch (mongoError) {
      console.error('🧪 [TestEndpoint] MongoDB ping failed:', mongoError.message);
      return res.status(503).json({ 
        error: 'Database connection failed',
        details: mongoError.message
      });
    }

    // Test insert into test collection
    try {
      const db = getDB();
      const testCollection = db.collection('_test_documents');
      const testDoc = {
        timestamp: new Date(),
        templateType,
        testData,
        _testMarker: true
      };

      console.log('🧪 [TestEndpoint] Attempting test insert...');
      const insertResult = await testCollection.insertOne(testDoc);
      
      console.log('🧪 [TestEndpoint] Test insert successful');
      console.log('🧪 [TestEndpoint] Inserted ID:', insertResult.insertedId);

      // Try to read it back
      const readBack = await testCollection.findOne({ _id: insertResult.insertedId });
      console.log('🧪 [TestEndpoint] Read verification successful:', !!readBack);

      // Clean up
      await testCollection.deleteOne({ _id: insertResult.insertedId });
      console.log('🧪 [TestEndpoint] Test document cleaned up');

      console.log('========== TEST SAVE SUCCESSFUL ==========\n');

      res.json({
        success: true,
        message: 'Test save completed successfully',
        details: {
          bodyReceived: { templateType, documentName, hasTestData: !!testData },
          mongodbConnected: true,
          insertTest: 'passed',
          readTest: 'passed',
          timestamp: new Date()
        }
      });
    } catch (mongoInsertError) {
      console.error('🧪 [TestEndpoint] MongoDB insert failed:', mongoInsertError.message);
      console.error('========== TEST SAVE FAILED ==========\n');
      
      return res.status(500).json({ 
        error: 'Database insert failed',
        details: mongoInsertError.message,
        hint: 'Check MongoDB connection and user permissions'
      });
    }
  } catch (error) {
    console.error('🧪 [TestEndpoint] Unexpected error:', error.message);
    console.error('========== TEST SAVE ERRORED ==========\n');
    
    res.status(500).json({ 
      error: 'Test endpoint error',
      details: error.message
    });
  }
});

// Auth routes
app.use('/api/auth', authRoutes);

// Resume routes (public, no authentication)
const resumeRoutes = require('./routes/resumes');
app.use('/api/resumes', resumeRoutes);

// Invoice routes (public, no authentication)
const invoiceRoutes = require('./routes/invoice.routes');
app.use('/api/invoices', invoiceRoutes);

// Certificate routes (public, no authentication)
const certificateRoutes = require('./routes/certificate.routes');
app.use('/api/certificates', certificateRoutes);

// Offer Letter routes (public, no authentication)
const offerLetterRoutes = require('./routes/offerletter.routes');
app.use('/api/offerletters', offerLetterRoutes);

// Report routes
const reportRoutes = require('./routes/report.routes');
app.use('/api/reports', reportRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ========== UNIVERSAL TEMPLATE SAVE/FETCH ROUTES ==========

// 🔥 Universal POST route - Save any template type (resume, letter, invoice, syllabus, etc.)
app.post('/api/templates/save', verifyToken, async (req, res) => {
  try {
    console.log('\n========== UNIVERSAL TEMPLATE SAVE ==========');
    console.log('📥 [TemplateSave] Body received:', Object.keys(req.body));

    const { userId, templateType, title, content, fontFamily, fontSize, margin } = req.body;
    const authUserId = req.userId || req.user?.id;

    console.log('📥 [TemplateSave] UserId from body:', userId);
    console.log('📥 [TemplateSave] UserId from auth:', authUserId);

    // Use authenticated user's ID if not provided
    const finalUserId = userId || authUserId;

    if (!finalUserId) {
      console.error('❌ [TemplateSave] No userId found');
      return res.status(401).json({ error: 'Unauthorized: No user ID found' });
    }

    if (!templateType || !title) {
      console.error('❌ [TemplateSave] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: templateType, title' });
    }

    // Create new template document
    const newTemplate = new Template({
      userId: finalUserId,
      templateType,
      title,
      content: content || {},
      fontFamily: fontFamily || 'Times New Roman',
      fontSize: fontSize || 12,
      margin: (typeof margin === 'number' ? margin : 1)
    });

    console.log('💾 [TemplateSave] Saving template to MongoDB...');
    const savedTemplate = await newTemplate.save();

    console.log('✅ [TemplateSave] Template saved successfully!');
    console.log('✅ [TemplateSave] Saved ID:', savedTemplate._id);
    console.log('========== END TEMPLATE SAVE ==========\n');

    res.status(201).json({
      success: true,
      message: 'Template saved successfully',
      _id: savedTemplate._id,
      template: savedTemplate
    });

  } catch (error) {
    console.error('❌ [TemplateSave] Error:', error.message);
    console.error('========== END TEMPLATE SAVE (ERROR) ==========\n');

    res.status(500).json({
      error: 'Failed to save template',
      details: error.message
    });
  }
});

// 🔥 Fetch all saved templates for a user
app.get('/api/templates/user/:userId', verifyToken, async (req, res) => {
  try {
    console.log('\n========== FETCH USER TEMPLATES ==========');
    const { userId } = req.params;

    console.log('📋 [FetchTemplates] Fetching templates for userId:', userId);

    const templates = await Template.find({ userId }).sort({ createdAt: -1 });

    console.log('✅ [FetchTemplates] Retrieved', templates.length, 'templates');
    console.log('========== END FETCH TEMPLATES ==========\n');

    res.json({
      success: true,
      count: templates.length,
      templates: templates
    });

  } catch (error) {
    console.error('❌ [FetchTemplates] Error:', error.message);
    console.error('========== END FETCH TEMPLATES (ERROR) ==========\n');

    res.status(500).json({
      error: 'Failed to fetch templates',
      details: error.message
    });
  }
});

// ========== END UNIVERSAL TEMPLATE ROUTES ==========

// EXPLICIT DEBUG POST ROUTE FOR /api/templates (backup)
// This catches POST before the mounted router, for debugging
app.post('/api/templates', async (req, res) => {
  try {
    console.log('\n========== DEBUG DIRECT POST /api/templates ==========');
    console.log('📥 [DirectPost] Raw request body received');
    console.log('📥 [DirectPost] Keys:', Object.keys(req.body));
    console.log('📥 [DirectPost] templateName:', req.body.templateName);
    console.log('📥 [DirectPost] sections count:', Array.isArray(req.body.sections) ? req.body.sections.length : 'NOT ARRAY');
    
    const { templateName, sections } = req.body;
    
    if (!templateName || !Array.isArray(sections)) {
      console.error('❌ [DirectPost] Missing required fields');
      return res.status(400).json({ error: 'templateName and sections required' });
    }
    
    console.log('💾 [DirectPost] Creating new Template instance...');
    const newTemplate = new Template({
      title: templateName,
      content: JSON.stringify(sections),
      templateType: 'dynamic',
      userId: req.userId || 'system'
    });
    
    console.log('💾 [DirectPost] Calling save()...');
    const savedDoc = await newTemplate.save();
    
    console.log('\n✅ [DirectPost] SAVED SUCCESSFULLY');
    console.log('🆔 [DirectPost] Document _id:', savedDoc._id);
    console.log('📊 [DirectPost] Location: docuforge.templates');
    console.log('========== DEBUG DIRECT POST SUCCESS ==========\n');
    
    res.status(201).json({ _id: savedDoc._id, templateName, sections });
  } catch (err) {
    console.error('\n========== DEBUG DIRECT POST FAILED ==========');
    console.error('❌ [DirectPost] Error message:', err.message);
    console.error('❌ [DirectPost] Error name:', err.name);
    console.error('❌ [DirectPost] Error code:', err.code);
    if (err.errors) {
      console.error('❌ [DirectPost] Validation errors:', Object.keys(err.errors));
      Object.entries(err.errors).forEach(([key, val]) => {
        console.error(`   - ${key}:`, val.message);
      });
    }
    console.error('📍 [DirectPost] Full stack:', err.stack);
    console.error('========== END ERROR ==========\n');
    res.status(500).json({ error: err.message, code: err.code });
  }
});

// explicit resume route (frontend was hitting /api/templates/resume)
app.post('/api/templates/resume', async (req, res) => {
  try {
    console.log('\n========== RESUME SAVE REQUEST ==========');
    console.log('📥 [ResumeRoute] Data received:', req.body);
    // using previously imported Template model
    const newDoc = new Template(req.body);
    console.log('📤 [ResumeRoute] About to save to MongoDB docuforge database...');
    const savedDoc = await newDoc.save(); // MUST use await to ensure save completes
    console.log('✅ [ResumeRoute] Save COMPLETE. Document _id:', savedDoc._id);
    console.log('✅ [ResumeRoute] Data is now in docuforge.templates collection');
    console.log('========== RESUME SAVE SUCCESS ==========\n');
    res.status(201).json(savedDoc);
  } catch (err) {
    console.error('\n========== RESUME SAVE FAILED ==========');
    console.error('❌ [ResumeRoute] Save failed:', err.message);
    console.error('Error stack:', err.stack);
    console.error('========== END ERROR ==========\n');
    res.status(500).json({ error: err.message });
  }
});

// ========== TEMPLATE SAVE ROUTE (Working Version) ==========

app.post('/api/save-template', async (req, res) => {
  try {
    console.log('\n========== TEMPLATE SAVE REQUEST ==========');
    console.log('📥 Body received:', JSON.stringify(req.body, null, 2));

    // Extract data
    const { title, content, templateType, userId } = req.body;

    // Validate
    if (!title) {
      console.error('❌ Missing required field: title');
      return res.status(400).json({ error: 'Title is required' });
    }

    console.log('✅ Validation passed');

    // Create document
    const template = new Template({
      title,
      content: content || '',
      templateType: templateType || 'resume',
      userId: userId || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('📝 Template object created, saving to MongoDB...');

    // Save to MongoDB
    const savedTemplate = await template.save();

    console.log('✅ Template saved successfully!');
    console.log('✅ Saved ID:', savedTemplate._id);
    console.log('✅ Document:', savedTemplate);
    console.log('========== END TEMPLATE SAVE ==========\n');

    // Return response
    res.status(201).json({
      success: true,
      message: 'Template saved successfully',
      _id: savedTemplate._id,
      template: savedTemplate
    });

  } catch (error) {
    console.error('❌ SAVE ERROR:', error.message);
    console.error('❌ Full error:', error);
    console.log('========== TEMPLATE SAVE FAILED ==========\n');

    res.status(500).json({ 
      error: 'Failed to save template',
      details: error.message 
    });
  }
});

// Test endpoint - Force create a template to verify MongoDB writing
app.get('/api/test-template-save', async (req, res) => {
  try {
    console.log('\n========== TEST TEMPLATE SAVE ==========');
    
    const testTemplate = new Template({
      title: `Test Template ${Date.now()}`,
      content: 'This is a test template to verify MongoDB is working',
      templateType: 'resume',
      userId: 'test-user'
    });

    console.log('🧪 Creating test template...');
    const saved = await testTemplate.save();

    console.log('✅ Test template saved successfully!');
    console.log('✅ ID:', saved._id);
    console.log('========== TEST COMPLETE ==========\n');

    res.json({
      success: true,
      message: 'Test template created successfully',
      _id: saved._id,
      note: 'Check MongoDB Atlas → Collections → templates collection now',
      template: saved
    });
  } catch (error) {
    console.error('❌ Test template error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Temporary force-save endpoint (use browser to hit /force-save)
app.get('/force-save', async (req, res) => {
  try {
    const Template = require('./models/Template');
    const test = await Template.create({ title: 'Emergency Test', content: 'It works!' });
    res.json({ message: 'Check Compass now!', data: test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Template routes (CRUD for template *definitions*)
const templateRoutes = require('./routes/templates');
app.use('/api/templates', templateRoutes);

// Public unified documents endpoints (dashboard + editor loading)
const unifiedDocumentsRoutes = require('./routes/unifiedDocuments.routes');
app.use('/api/documents', unifiedDocumentsRoutes);

// Documents (saved user documents/templates, PDF generation, etc.)
// mounted under /api/documents normally but we also provide an alias
// at /api/templates so older frontend code or '/resume' can still reach it.
const documentsRoutes = require('./routes/documents');
app.use('/api/documents', documentsRoutes);
app.use('/api/templates', documentsRoutes); // alias for compatibility

// Get current user (requires authentication)
const { getCurrentUser } = require('./controllers/authController');

app.get('/api/users/me', verifyToken, async (req, res, next) => {
  try {
    await getCurrentUser(req, res);
  } catch (error) {
    next(error);
  }
});

// Logout endpoint
app.post('/api/logout', async (req, res, next) => {
  try {
    const { logout } = require('./controllers/authController');
    await logout(req, res);
  } catch (error) {
    next(error);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// -------- Server Startup --------

async function startServer() {
  try {
    console.log('🚀 Starting DocuForge Backend Server...');
    
    // Connect to MongoDB using Mongoose
    console.log('📊 Connecting to MongoDB Atlas with Mongoose...');
    try {
      await mongoose.connect(process.env.MONGO_URI, { dbName: 'docuforge' });
      console.log('✅ MongoDB Connected via Mongoose (dbName=docuforge)');
    } catch (mongooseError) {
      console.error('❌ Mongoose connection error:', mongooseError.message);
      throw mongooseError;
    }
    
    // Also initialize existing MongoDB driver connection
    console.log('📊 Connecting to MongoDB Atlas (driver)...');
    await connectDB();
    console.log('✅ Connected to MongoDB Atlas (driver)');
    
    // Seed default templates if needed
    try {
      const templateModel = require('./models/templateModel');
      const defaultTemplates = require('./data/defaultTemplates');
      const existingCount = await templateModel.countAll();
      if (!existingCount || existingCount === 0) {
        console.log('🌱 Seeding default templates...');
        for (const t of defaultTemplates) {
          try {
            await templateModel.create({ ...t, userId: null });
          } catch (err) {
            console.warn('Seed template failed:', err && err.message ? err.message : err);
          }
        }
        console.log('✅ Default templates seeded');
      }
    } catch (err) {
      console.warn('Template seeding skipped (models may not be ready):', err && err.message ? err.message : err);
    }

    // Initialize document indexes
    try {
      const documentModel = require('./models/documentModel');
      await documentModel.ensureIndexes();
    } catch (err) {
      console.warn('Document index initialization skipped:', err && err.message ? err.message : err);
    }

    // Start server with resilient port handling (avoid EADDRINUSE crash)
    const logServerInfo = (port) => {
      console.log(`📚 API Documentation:`);
      console.log(`   POST   /api/auth/register          - Register new user`);
      console.log(`   POST   /api/auth/login             - Login user`);
      console.log(`   GET    /api/health                 - Health check`);
      console.log(`   GET    /api/db-status              - Database status`);
      console.log(`   POST   /api/templates              - Create new template`);
      console.log(`   GET    /api/templates/:id          - Fetch template by ID`);
      console.log(`   POST   /api/documents (alias)      - Save user document`);
    };

    const startListening = (port) => {
      const server = app.listen(port, () => {
        console.log(`✅ Server running at http://localhost:${port}`);
        logServerInfo(port);
      });

      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.error(`❌ Port ${port} already in use. Trying ${port + 1}...`);
          const fallbackPort = port + 1;
          const fallbackServer = app.listen(fallbackPort, () => {
            console.log(`✅ Server running at http://localhost:${fallbackPort}`);
            logServerInfo(fallbackPort);
          });

          fallbackServer.on('error', (e) => {
            console.error('❌ Failed to start server on alternate port:', e);
            process.exit(1);
          });
        } else {
          console.error('❌ Server error:', err);
          process.exit(1);
        }
      });
    };

    // Attempt to start on configured PORT (environment or default)
    startListening(PORT);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
