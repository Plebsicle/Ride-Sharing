'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('verificationEmail');
    if (!storedEmail) {
      router.push('/auth/register');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(true);
      // Clear the stored email
      sessionStorage.removeItem('verificationEmail');
      // Store the token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setOtp(''); // Clear OTP field on error
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setError('');
      setRemainingAttempts(3);
      setCountdown(60); // Set 60-second cooldown
      alert('New OTP has been sent to your email');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Verify Your Email
        </h2>
        
        {success ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">Email verified successfully!</div>
            <div className="text-gray-600">Redirecting to login page...</div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
                {remainingAttempts > 0 && (
                  <p className="text-red-600 mt-1">
                    Remaining attempts: {remainingAttempts}
                  </p>
                )}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={otp.length !== 6}
              >
                Verify OTP
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className={`text-blue-500 hover:text-blue-600 text-sm ${
                  countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {countdown > 0 
                  ? `Resend OTP in ${formatTime(countdown)}`
                  : "Didn't receive OTP? Resend"}
              </button>
            </div>
            
            <p className="mt-4 text-center text-gray-600">
              Back to{' '}
              <Link href="/auth/login" className="text-blue-500 hover:text-blue-600">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
