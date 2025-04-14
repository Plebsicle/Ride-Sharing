import { Router } from 'express';
const router = Router();

import { register, login, sendOtpToUser, verifyOtp } from '../controllers/AuthConrtroller.js';
import { authenticate } from '../middleware/auth.js';

import { getAllRides } from '../controllers/CreateRide.js';
import { createRide } from '../controllers/CreateRide.js';

import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/Booking.js';

import { getDriverRides, approveRideRequest } from '../controllers/DriverController.js';

// 🔐 Auth Routes

router.post('/register', register);
router.post('/login', login);

// OTP Routes
router.post('/send-otp', sendOtpToUser);
router.post('/verify-otp', verifyOtp);

router.post('/create-ride', createRide);
router.get('/rides',getAllRides);

// Driver Routes
router.get('/driver/rides', authenticate, getDriverRides);
router.post('/driver/rides/:rideId/approve', authenticate, approveRideRequest);

// 📦 Booking Routes
router.post('/bookings/:rideId', createBooking);
router.get('/bookings', authenticate, getAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id', authenticate, updateBooking);
router.delete('/bookings/:id', authenticate, deleteBooking);

export default router;
