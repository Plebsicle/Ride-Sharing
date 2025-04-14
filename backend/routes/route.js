import { Router } from 'express';
const router = Router();

import { register, login, sendOtpToUser, verifyOtp } from '../controllers/AuthConrtroller.js';
import { authenticate } from '../middleware/auth.js';

import { getAllRides } from '../controllers/CreateRide.js';
import { createRide } from '../controllers/CreateRide.js';
// import {driverRides} from '../controllers/DriverController.js';

import { startRide,endRide } from '../controllers/rideStatusController.js';

import { getDriverCompletedRides } from '../controllers/DriverController.js';
import { getCompletedRides } from '../controllers/passengerController.js';

import { 
  getVehicleDetails, 
  updateVehicleDetails, 
  getDriverVerificationStatus, 
  submitDriverVerification 
} from '../controllers/VehicleController.js';

import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/Booking.js';

import { forgotPassword } from '../controllers/AuthConrtroller.js';
import { resetPassword } from '../controllers/AuthConrtroller.js';

import { approveRideRequest, getDriverBookings, getDriverApprovedRides, getDriverRideStats } from '../controllers/DriverController.js';
import { getApprovedRides, getPendingRequests, getPassengerRideStats } from '../controllers/passengerController.js';
import { getUserProfile,updateUserLocation,updateUserProfile } from '../controllers/userController.js';

// 🔐 Auth Routes

router.post('/register', register);
router.post('/login', login);

// OTP Routes
router.post('/send-otp', sendOtpToUser);
router.post('/verify-otp', verifyOtp);

router.post('/create-ride', authenticate, createRide);
router.get('/rides', getAllRides);

// Driver Routes
// router.get('/driver/rides', authenticate, getDriverRides);
// router.post('/driver/rides/:rideId/approve', authenticate, approveRideRequest);
router.get('/driver/bookings', authenticate, getDriverBookings); //
router.patch('/bookings/:id', authenticate, approveRideRequest);
// router.get('/driverRides', authenticate, driverRides);
router.get('/driverApprovedRides', authenticate, getDriverApprovedRides); //
router.get('/driver/stats', authenticate, getDriverRideStats); // New endpoint for driver stats

///user Routes
router.post('/user/profile', authenticate, getUserProfile);
router.put('/user/profile', authenticate, updateUserProfile);
router.put('/user/location', authenticate, updateUserLocation);

// 📦 Booking Routes
router.post('/bookings/:rideId', createBooking);
router.get('/bookings', authenticate, getAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id', authenticate, updateBooking);
router.delete('/bookings/:id', authenticate, deleteBooking);

/// Passenger Routes
router.get('/pendingRides', authenticate, getPendingRequests); //
router.get('/approvedRides', authenticate, getApprovedRides); //
router.get('/passenger/stats', authenticate, getPassengerRideStats); // New endpoint for passenger stats

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);





////
router.patch('/bookings/:bookingId/start', authenticate, startRide);
router.patch('/bookings/:bookingId/end', authenticate, endRide);
///
router.get('/driverCompletedRides', authenticate, getDriverCompletedRides); // New route for driver completed rides
router.get('/completedRides', authenticate, getCompletedRides); // New route for passenger completed rides

router.get('/driver/vehicle', authenticate, getVehicleDetails);
router.put('/driver/vehicle', authenticate, updateVehicleDetails);
router.get('/driver/verification-status', authenticate, getDriverVerificationStatus);
router.post('/driver/verify', authenticate, submitDriverVerification);

export default router;
