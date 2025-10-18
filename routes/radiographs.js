const express = require('express');
const Radiograph = require('../models/Radiograph');
const router = express.Router();

// GET /api/radiographs - Get all radiographs for current user
router.get('/', async (req, res) => {
  try {
    const radiographs = await Radiograph.find({ 
      userId: req.user.userId,
      isFollowUp: false 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      message: 'Radiographs retrieved successfully',
      patients: radiographs
    });
  } catch (error) {
    console.error('Error fetching radiographs:', error);
    res.status(500).json({ message: 'Error fetching radiographs' });
  }
});

// POST /api/radiographs - Create new radiograph/patient
router.post('/', async (req, res) => {
  try {
    const radiograph = new Radiograph({
      ...req.body,
      userId: req.user.userId,
      isFollowUp: false
    });
    
    await radiograph.save();
    
    console.log('📋 New patient/radiograph data saved for user:', req.user.userId);
    
    res.status(201).json({
      message: 'Patient data saved successfully!',
      patient: radiograph
    });
  } catch (error) {
    console.error('Error saving radiograph:', error);
    res.status(500).json({ message: 'Error saving patient data' });
  }
});

// GET /api/radiographs/:id - Get specific radiograph
router.get('/:id', async (req, res) => {
  try {
    const radiograph = await Radiograph.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!radiograph) {
      return res.status(404).json({ message: 'Radiograph not found' });
    }
    
    res.json({
      message: 'Radiograph details',
      patient: radiograph
    });
  } catch (error) {
    console.error('Error fetching radiograph:', error);
    res.status(500).json({ message: 'Error fetching radiograph' });
  }
});

module.exports = router;