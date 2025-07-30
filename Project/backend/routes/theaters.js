const express = require('express');
const { body, validationResult } = require('express-validator');
const Theater = require('../models/Theater');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const theaters = await Theater.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(theaters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get theater by ID
// @route   GET /api/theaters/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (theater) {
      res.json(theater);
    } else {
      res.status(404).json({ message: 'Theater not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create theater
// @route   POST /api/theaters
// @access  Private/Admin
router.post('/', protect, admin, [
  body('name').notEmpty().withMessage('Name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('pincode').notEmpty().withMessage('Pincode is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('totalScreens').isNumeric().withMessage('Total screens must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const theater = await Theater.create(req.body);
    res.status(201).json(theater);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update theater
// @route   PUT /api/theaters/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (theater) {
      res.json(theater);
    } else {
      res.status(404).json({ message: 'Theater not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete theater
// @route   DELETE /api/theaters/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, { isActive: false }, {
      new: true
    });

    if (theater) {
      res.json({ message: 'Theater deleted successfully' });
    } else {
      res.status(404).json({ message: 'Theater not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 