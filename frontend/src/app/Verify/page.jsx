"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const email = typeof window !== "undefined" ? localStorage.getItem('verifyEmail') : '';
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/verify-otp', { email, otp }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setMessage(res.data.message);
      localStorage.removeItem('verifyEmail');
      if(res.data.user.role === 'DRIVER') {
        router.push('/DriverDashboard');
      }
      router.push('/Dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md transition-all">
        <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">Verify OTP</h2>

        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Enter OTP sent to <span className="font-medium text-gray-800">{email}</span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter OTP"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-all duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};
export default Verify;
