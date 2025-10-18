const express = require('express');
const Radiograph = require('../models/Radiograph');
const router = express.Router();

// GET /api/followups - Get all follow-ups for current user
router.get('/', async (req, res) => {
  try {
    const followups = await Radiograph.find({ 
      userId: req.user.userId,
      isFollowUp: true 
    }).sort({ createdAt: -1 });
    
    res.json({ 
      message: 'Follow-ups retrieved successfully',
      followups: followups
    });
  } catch (error) {
    console.error('Error fetching followups:', error);
    res.status(500).json({ message: 'Error fetching followups' });
  }
});

// POST /api/followups - Create new follow-up
router.post('/', async (req, res) => {
  try {
    const followup = new Radiograph({
      ...req.body,
      userId: req.user.userId,
      isFollowUp: true
    });
    
    await followup.save();
    
    console.log('📝 New follow-up data saved for user:', req.user.userId);
    
    res.status(201).json({
      message: 'Follow-up saved successfully!',
      followup: followup
    });
  } catch (error) {
    console.error('Error saving followup:', error);
    res.status(500).json({ message: 'Error saving follow-up data' });
  }
});

module.exports = router;