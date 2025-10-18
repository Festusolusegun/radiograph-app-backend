const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const radiographRoutes = require('./routes/radiographs');
const followupRoutes = require('./routes/followups');

// Import models
const Radiograph = require('./models/Radiograph');
const User = require('./models/User');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'exp://192.168.184.64:19000'], // Add your frontend URLs
  credentials: true
}));
app.use(express.json());

// Enhanced MongoDB connection with cloud support
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Authentication middleware for multi-tenant security
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'RadiographApp Backend API - Cloud Version',
    status: 'Working!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/radiographs (protected)',
      'POST /api/radiographs (protected)',
      'GET /api/followups (protected)',
      'POST /api/followups (protected)'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// API Routes with authentication
app.use('/api/auth', authRoutes);
app.use('/api/radiographs', authenticateToken, radiographRoutes);
app.use('/api/followups', authenticateToken, followupRoutes);

// Enhanced patient routes with authentication
app.post('/api/patients', authenticateToken, async (req, res) => {
  try {
    console.log('Patient data received from user:', req.user.userId, req.body);
    
    const radiograph = new Radiograph({
      ...req.body,
      userId: req.user.userId
    });
    
    await radiograph.save();
    
    res.json({
      message: 'Patient saved successfully',
      patient: radiograph
    });
  } catch (error) {
    console.error('Error saving patient:', error);
    res.status(500).json({ message: 'Error saving patient data' });
  }
});

app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    const patients = await Radiograph.find({ userId: req.user.userId });
    res.json({
      message: 'Patients retrieved successfully',
      patients: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patient data' });
  }
});

app.post('/api/patients/followup', authenticateToken, async (req, res) => {
  try {
    console.log('Follow-up received from user:', req.user.userId, req.body);
    
    const followup = new Radiograph({
      ...req.body,
      userId: req.user.userId,
      isFollowUp: true
    });
    
    await followup.save();
    
    res.json({
      message: 'Follow-up saved successfully',
      data: followup
    });
  } catch (error) {
    console.error('Error saving followup:', error);
    res.status(500).json({ message: 'Error saving follow-up data' });
  }
});

// User profile route
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/radiographs',
      '/api/followups',
      '/health'
    ]
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️ Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});


