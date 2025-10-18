const mongoose = require('mongoose');

const radiographSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  images: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Patient Information
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  // Injury Information
  pathomechanism: {
    type: String,
    enum: ['fall', 'motorcycle_rta', 'mva', 'sport', 'gunshot', 'assault', 'others'],
    required: true,
  },
  xrayType: {
    type: String,
    enum: [
      'shoulder', 'humerus', 'elbow', 'forearm', 'wrist', 'hand',
      'spine', 'hip', 'femur', 'knee', 'tibiofibula', 'ankle', 'foot'
    ],
    required: true,
  },
  xrayPattern: {
    type: String,
    enum: ['spiral', 'transverse', 'oblique', 'comminuted', 'segmental'],
    required: true,
  },
  site: {
    type: String,
    enum: ['proximal', 'mid-shaft', 'distal'],
  },
  injuryType: {
    type: String,
    enum: ['open', 'close'],
    required: true,
  },
  injuryCount: {
    type: String,
    enum: ['isolated', 'multiple'],
    required: true,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  // Follow-up tracking
  isFollowUp: {
    type: Boolean,
    default: false,
  },
  originalRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Radiograph',
  },
  followUps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Radiograph',
  }],
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
radiographSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Radiograph', radiographSchema);