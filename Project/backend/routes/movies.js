const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/Movie');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create movie
// @route   POST /api/movies
// @access  Private/Admin
router.post('/', protect, admin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('releaseDate').isISO8601().withMessage('Release date is required'),
  body('language').notEmpty().withMessage('Language is required'),
  body('director').notEmpty().withMessage('Director is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, { isActive: false }, {
      new: true
    });

    if (movie) {
      res.json({ message: 'Movie deleted successfully' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 