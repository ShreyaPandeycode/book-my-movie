const express = require('express');
const { body, validationResult } = require('express-validator');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all shows
// @route   GET /api/shows
// @access  Public
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find({ isActive: true })
      .populate('movie', 'title poster')
      .populate('theater', 'name location')
      .sort({ date: 1, time: 1 });
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get shows by movie
// @route   GET /api/shows/movie/:movieId
// @access  Public
router.get('/movie/:movieId', async (req, res) => {
  try {
    const shows = await Show.find({ 
      movie: req.params.movieId, 
      isActive: true,
      date: { $gte: new Date() }
    })
      .populate('movie', 'title poster duration')
      .populate('theater', 'name location address')
      .sort({ date: 1, time: 1 });
    res.json(shows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get show by ID
// @route   GET /api/shows/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title poster duration genre')
      .populate('theater', 'name location address seatMatrix');
    
    if (show) {
      // Attach seatMatrix to the show response
      const showObj = show.toObject();
      showObj.seatMatrix = show.theater.seatMatrix;
      res.json(showObj);
    } else {
      res.status(404).json({ message: 'Show not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create show
// @route   POST /api/shows
// @access  Private/Admin
router.post('/', protect, admin, [
  body('movie').notEmpty().withMessage('Movie is required'),
  body('theater').notEmpty().withMessage('Theater is required'),
  body('screenNumber').isNumeric().withMessage('Screen number must be a number'),
  body('date').isISO8601().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('totalSeats').isNumeric().withMessage('Total seats must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { movie, theater, screenNumber, date, time, price, totalSeats } = req.body;

    // Check if movie exists
    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(400).json({ message: 'Movie not found' });
    }

    // Check if theater exists
    const theaterExists = await Theater.findById(theater);
    if (!theaterExists) {
      return res.status(400).json({ message: 'Theater not found' });
    }

    const show = await Show.create({
      movie,
      theater,
      screenNumber,
      date,
      time,
      price,
      totalSeats,
      availableSeats: totalSeats
    });

    res.status(201).json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (show) {
      res.json(show);
    } else {
      res.status(404).json({ message: 'Show not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, { isActive: false }, {
      new: true
    });

    if (show) {
      res.json({ message: 'Show deleted successfully' });
    } else {
      res.status(404).json({ message: 'Show not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 