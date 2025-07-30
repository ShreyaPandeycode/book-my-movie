const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const User = require('../models/User');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
}

// Admin login page
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

// Admin login POST
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Invalid username or password' });
});

// Admin logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// Admin dashboard (protected)
router.get('/', requireAdminAuth, (req, res) => {
  res.render('admin/dashboard');
});

// Movies CRUD
router.get('/movies', requireAdminAuth, async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 });
  res.render('admin/movies', { movies });
});
router.get('/movies/add', requireAdminAuth, (req, res) => { res.send('Add movie form (TODO)'); });
router.post('/movies/add', requireAdminAuth, (req, res) => { res.send('Create movie (TODO)'); });
router.get('/movies/:id/edit', requireAdminAuth, (req, res) => { res.send('Edit movie form (TODO)'); });
router.post('/movies/:id/edit', requireAdminAuth, (req, res) => { res.send('Update movie (TODO)'); });
router.post('/movies/:id/delete', requireAdminAuth, (req, res) => { res.send('Delete movie (TODO)'); });

// Theaters CRUD
router.get('/theaters', requireAdminAuth, async (req, res) => {
  const theaters = await Theater.find().sort({ createdAt: -1 });
  res.render('admin/theaters', { theaters });
});
router.get('/theaters/add', requireAdminAuth, (req, res) => { res.send('Add theater form (TODO)'); });
router.post('/theaters/add', requireAdminAuth, (req, res) => { res.send('Create theater (TODO)'); });
router.get('/theaters/:id/edit', requireAdminAuth, (req, res) => { res.send('Edit theater form (TODO)'); });
router.post('/theaters/:id/edit', requireAdminAuth, (req, res) => { res.send('Update theater (TODO)'); });
router.post('/theaters/:id/delete', requireAdminAuth, (req, res) => { res.send('Delete theater (TODO)'); });

// Shows CRUD
router.get('/shows', requireAdminAuth, async (req, res) => {
  const shows = await Show.find().populate('movie').populate('theater').sort({ date: -1, time: -1 });
  res.render('admin/shows', { shows });
});
router.get('/shows/add', requireAdminAuth, (req, res) => { res.send('Add show form (TODO)'); });
router.post('/shows/add', requireAdminAuth, (req, res) => { res.send('Create show (TODO)'); });
router.get('/shows/:id/edit', requireAdminAuth, (req, res) => { res.send('Edit show form (TODO)'); });
router.post('/shows/:id/edit', requireAdminAuth, (req, res) => { res.send('Update show (TODO)'); });
router.post('/shows/:id/delete', requireAdminAuth, (req, res) => { res.send('Delete show (TODO)'); });

// Bookings view
router.get('/bookings', requireAdminAuth, async (req, res) => {
  const bookings = await Booking.find()
    .populate('user')
    .populate('movie')
    .populate('theater')
    .sort({ bookingDate: -1 });
  res.render('admin/bookings', { bookings });
});

module.exports = router; 