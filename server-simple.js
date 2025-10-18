const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes without database
app.get('/', (req, res) => {
  res.json({ message: 'RadiographApp API - No Database' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'Not connected', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Registration attempt:', req.body);
  res.json({
    message: 'User registered successfully (No DB)',
    user: {
      name: req.body.name,
      email: req.body.email
    }
  });
});

app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth test route working!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(\🚀 Simple server running on port \\);
  console.log(\🔗 http://localhost:\\);
});
