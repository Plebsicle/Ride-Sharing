import { Router } from 'express';
const router = Router();

import { register, login, sendOtpToUser, verifyOtp } from '../controllers/AuthConrtroller.js';
import { authenticate } from '../middleware/auth.js';
import {
  submitVerification,
  getVerificationStatus,
  approveVerification
} from '../controllers/DriverVerify.js';


// Auth Routes
import { createRide } from '../controllers/CreateRide.js';
// 🔐 Auth Routes

router.post('/register', register);
router.post('/login', login);

// OTP Routes
router.post('/send-otp', sendOtpToUser);
router.post('/verify-otp', verifyOtp);

// Driver Verification Routes
router.post('/verification', submitVerification);
router.get('/verification/:userId', authenticate, getVerificationStatus);
router.put('/verification/approve/:verificationId', authenticate, approveVerification);


//create ride
router.post('/create-ride', createRide);
export default router;
