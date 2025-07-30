const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
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
  screenNumber: {
    type: Number,
    required: [true, 'Please provide screen number'],
    min: 1
  },
  date: {
    type: Date,
    required: [true, 'Please provide show date']
  },
  time: {
    type: String,
    required: [true, 'Please provide show time']
  },
  price: {
    type: Number,
    required: [true, 'Please provide ticket price'],
    min: 0
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    min: 1
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please provide available seats'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Show', showSchema); 