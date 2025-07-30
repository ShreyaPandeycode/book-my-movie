const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: [true, 'Please provide a show']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Please provide a movie']
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Please provide a theater']
  },
  seats: [{
    seatNumber: {
      type: String,
      required: [true, 'Please provide seat number']
    },
    price: {
      type: Number,
      required: [true, 'Please provide seat price']
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  showDate: {
    type: Date,
    required: [true, 'Please provide show date']
  },
  showTime: {
    type: String,
    required: [true, 'Please provide show time']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate booking ID before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 