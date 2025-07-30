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
router.get('/movies/add', requireAdminAuth, (req, res) => {
  res.render('admin/addMovie');
});
router.post('/movies/add', requireAdminAuth, async (req, res) => {
  try {
    await Movie.create(req.body);
    res.redirect('/admin/movies');
  } catch (err) {
    res.render('admin/addMovie', { error: err.message });
  }
});
router.get('/movies/:id/edit', requireAdminAuth, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.render('admin/editMovie', { movie });
});
router.post('/movies/:id/edit', requireAdminAuth, async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/movies');
  } catch (err) {
    const movie = await Movie.findById(req.params.id);
    res.render('admin/editMovie', { movie, error: err.message });
  }
});
router.post('/movies/:id/delete', requireAdminAuth, async (req, res) => {
  await Movie.findByIdAndUpdate(req.params.id, { isActive: false });
  res.redirect('/admin/movies');
});

// Theaters CRUD
router.get('/theaters', requireAdminAuth, async (req, res) => {
  const theaters = await Theater.find().sort({ createdAt: -1 });
  res.render('admin/theaters', { theaters });
});
router.get('/theaters/add', requireAdminAuth, (req, res) => {
  res.render('admin/addTheater');
});
router.post('/theaters/add', requireAdminAuth, async (req, res) => {
  try {
    // Default seat matrix: 10 rows (A-J), 10 seats per row
    const seatMatrix = [];
    const rows = 'ABCDEFGHIJ';
    for (let r = 0; r < 10; r++) {
      for (let n = 1; n <= 10; n++) {
        seatMatrix.push({ row: rows[r], number: n, status: 'available' });
      }
    }
    await Theater.create({ ...req.body, seatMatrix });
    res.redirect('/admin/theaters');
  } catch (err) {
    res.render('admin/addTheater', { error: err.message });
  }
});
router.get('/theaters/:id/edit', requireAdminAuth, async (req, res) => {
  const theater = await Theater.findById(req.params.id);
  res.render('admin/editTheater', { theater });
});
router.post('/theaters/:id/edit', requireAdminAuth, async (req, res) => {
  try {
    await Theater.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/theaters');
  } catch (err) {
    const theater = await Theater.findById(req.params.id);
    res.render('admin/editTheater', { theater, error: err.message });
  }
});
router.post('/theaters/:id/delete', requireAdminAuth, async (req, res) => {
  await Theater.findByIdAndUpdate(req.params.id, { isActive: false });
  res.redirect('/admin/theaters');
});

// Shows CRUD
router.get('/shows', requireAdminAuth, async (req, res) => {
  const shows = await Show.find().populate('movie').populate('theater').sort({ date: -1, time: -1 });
  res.render('admin/shows', { shows });
});
router.get('/shows/add', requireAdminAuth, async (req, res) => {
  const movies = await Movie.find({ isActive: true });
  const theaters = await Theater.find({ isActive: true });
  res.render('admin/addShow', { movies, theaters });
});
router.post('/shows/add', requireAdminAuth, async (req, res) => {
  try {
    await Show.create(req.body);
    res.redirect('/admin/shows');
  } catch (err) {
    const movies = await Movie.find({ isActive: true });
    const theaters = await Theater.find({ isActive: true });
    res.render('admin/addShow', { movies, theaters, error: err.message });
  }
});
router.get('/shows/:id/edit', requireAdminAuth, async (req, res) => {
  const show = await Show.findById(req.params.id);
  const movies = await Movie.find({ isActive: true });
  const theaters = await Theater.find({ isActive: true });
  res.render('admin/editShow', { show, movies, theaters });
});
router.post('/shows/:id/edit', requireAdminAuth, async (req, res) => {
  try {
    await Show.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/shows');
  } catch (err) {
    const show = await Show.findById(req.params.id);
    const movies = await Movie.find({ isActive: true });
    const theaters = await Theater.find({ isActive: true });
    res.render('admin/editShow', { show, movies, theaters, error: err.message });
  }
});
router.post('/shows/:id/delete', requireAdminAuth, async (req, res) => {
  await Show.findByIdAndUpdate(req.params.id, { isActive: false });
  res.redirect('/admin/shows');
});

// Bookings view
router.get('/bookings', requireAdminAuth, async (req, res) => {
  const bookings = await Booking.find()
    .populate('user')
    .populate('movie')
    .populate('theater')
    .sort({ bookingDate: -1 });
  res.render('admin/bookings', { bookings });
});

// Seat approval page
router.get('/seat-approval', requireAdminAuth, async (req, res) => {
  const bookings = await Booking.find({ status: 'pending' })
    .populate('user', 'email')
    .populate('show')
    .sort({ createdAt: -1 });
  res.render('admin/seatApproval', { bookings });
});
router.post('/bookings/:id/approve', requireAdminAuth, async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: 'confirmed', paymentStatus: 'completed' });
  res.redirect('/admin/seat-approval');
});
router.post('/bookings/:id/reject', requireAdminAuth, async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled', paymentStatus: 'failed' });
  res.redirect('/admin/seat-approval');
});

module.exports = router; 