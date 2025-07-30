const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a movie description']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide movie duration in minutes']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Please provide release date']
  },
  language: {
    type: String,
    required: [true, 'Please provide language']
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  poster: {
    type: String,
    default: ''
  },
  trailer: {
    type: String,
    default: ''
  },
  director: {
    type: String,
    required: [true, 'Please provide director name']
  },
  cast: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema); 