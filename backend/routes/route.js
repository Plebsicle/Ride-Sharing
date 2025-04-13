import { Router } from 'express';
const router = Router();

import { register, login, sendOtpToUser, verifyOtp } from '../controllers/AuthConrtroller.js';
import { authenticate } from '../middleware/auth.js';

import { createRide } from '../controllers/CreateRide.js';

import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/Booking.js';

// 🔐 Auth Routes
router.post('/register', register);
router.post('/login', login);

// 📧 OTP Routes
router.post('/send-otp', sendOtpToUser);
router.post('/verify-otp', verifyOtp);

// 🚘 Ride Creation
router.post('/create-ride', createRide);

// 📦 Booking Routes
router.post('/bookings', createBooking);
router.get('/bookings', authenticate, getAllBookings);
router.get('/bookings/:id', authenticate, getBookingById);
router.put('/bookings/:id', authenticate, updateBooking);
router.delete('/bookings/:id', authenticate, deleteBooking);

export default router;
