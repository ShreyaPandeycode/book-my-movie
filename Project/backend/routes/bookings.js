const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster')
      .populate('theater', 'name location')
      .populate('show', 'date time screenNumber')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title poster duration genre')
      .populate('theater', 'name location address')
      .populate('show', 'date time screenNumber price')
      .populate('user', 'name email phone');

    if (booking) {
      // Check if user owns this booking or is admin
      if (booking.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(booking);
      } else {
        res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, [
  body('show').notEmpty().withMessage('Show is required'),
  body('seats').isArray().withMessage('Seats must be an array'),
  body('seats.*.seatNumber').notEmpty().withMessage('Seat number is required'),
  body('seats.*.price').isNumeric().withMessage('Seat price must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { show: showId, seats } = req.body;

    // Get show details
    const show = await Show.findById(showId)
      .populate('movie', 'title')
      .populate('theater', 'name');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if show is in the future
    const showDate = new Date(show.date);
    const today = new Date();
    if (showDate < today) {
      return res.status(400).json({ message: 'Cannot book for past shows' });
    }

    // Check seat availability
    if (show.availableSeats < seats.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Calculate total amount
    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      movie: show.movie._id,
      theater: show.theater._id,
      seats,
      totalAmount,
      showDate: show.date,
      showTime: show.time
    });

    // Update available seats
    await Show.findByIdAndUpdate(showId, {
      $inc: { availableSeats: -seats.length }
    });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster')
      .populate('theater', 'name location')
      .populate('show', 'date time screenNumber');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, [
  body('status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid status'),
  body('paymentStatus').isIn(['pending', 'completed', 'failed']).withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update booking
    booking.status = status;
    booking.paymentStatus = paymentStatus;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title poster')
      .populate('theater', 'name location')
      .populate('show', 'date time screenNumber');

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if booking can be cancelled (not too close to show time)
    const showDate = new Date(booking.showDate);
    const now = new Date();
    const hoursDiff = (showDate - now) / (1000 * 60 * 60);
    
    if (hoursDiff < 2) {
      return res.status(400).json({ message: 'Cannot cancel booking within 2 hours of show time' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update available seats
    await Show.findByIdAndUpdate(booking.show, {
      $inc: { availableSeats: booking.seats.length }
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 