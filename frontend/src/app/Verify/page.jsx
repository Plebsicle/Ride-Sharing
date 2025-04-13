"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const email = localStorage.getItem('verifyEmail');
  const router = useRouter(); // Initialize useRouter for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/verify-otp',
        { email, otp }, // Sending both email and OTP in the body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(res.data.message);
      localStorage.removeItem('verifyEmail');

      // Redirect to Dashboard after successful OTP verification
      router.push('/Dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '2rem' }}>
      <h2>Verify OTP</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Enter OTP sent to {email}</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default Verify;
