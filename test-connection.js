// backend/test-connection.js
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing MongoDB Atlas connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connection successful!');
    console.log('Database:', mongoose.connection.db.databaseName);
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();