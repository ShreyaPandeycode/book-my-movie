const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a theater name'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please provide theater location']
  },
  address: {
    type: String,
    required: [true, 'Please provide theater address']
  },
  city: {
    type: String,
    required: [true, 'Please provide city']
  },
  state: {
    type: String,
    required: [true, 'Please provide state']
  },
  pincode: {
    type: String,
    required: [true, 'Please provide pincode']
  },
  phone: {
    type: String,
    required: [true, 'Please provide contact number']
  },
  totalScreens: {
    type: Number,
    required: [true, 'Please provide number of screens'],
    min: 1
  },
  amenities: [{
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

module.exports = mongoose.model('Theater', theaterSchema); 