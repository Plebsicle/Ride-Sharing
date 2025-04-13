import prisma from '../config/db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {generateOtp, sendOtp } from '../utils/sendOtp.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory OTP store (replace with Redis in production)
const otpStore = new Map();

/**
 * Register a new user (Passenger or Driver)
 * Sends OTP to user's email after registration
 */
export const register = async (req, res) => {
    const { name, email, password, role, aadharNumber } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });

      // Check if Aadhar number is provided for verification
      if (!aadharNumber) {
        return res.status(400).json({ error: 'Aadhar number is required for identity verification' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user (without verifying email initially)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role === 'DRIVER' ? 'DRIVER' : 'PASSENGER',
          isVerified: false,
          aadharNumber,
          isAadharVerified: false, // Admin will verify this later
        },
      });
  
      // Generate OTP and set expiration
      const otp = generateOtp();
      otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });  // Expiry in 10 minutes
  
      // Send OTP to user's email
      await sendOtp(email, otp);
  
      // Respond with success message
      res.status(201).json({
        message: 'User registered successfully. OTP sent to email. Your account is pending Aadhar verification.',
        user: { id: user.id, email: user.email },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  };

/**
 * Login a verified user
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Send OTP to user's email (for resending if needed)
 */
export const sendOtpToUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = generateOtp();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    await sendOtp(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('OTP Error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

/**
 * Verify OTP and mark user as verified
 */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const entry = otpStore.get(email);
  if (!entry) return res.status(400).json({ error: 'No OTP found for this email' });

  const { otp: storedOtp, expiresAt } = entry;

  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (otp !== storedOtp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  otpStore.delete(email);

  try {
    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    res.json({ message: 'OTP verified successfully. Email is now verified.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update verification status' });
  }
};
