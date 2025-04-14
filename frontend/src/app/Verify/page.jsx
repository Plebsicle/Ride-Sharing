"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  ArrowBack,
} from '@mui/icons-material';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const email = typeof window !== "undefined" ? localStorage.getItem('verifyEmail') : '';
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/verify-otp', { email, otp }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setMessage(res.data.message);
      localStorage.setItem('jwtToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.removeItem('verifyEmail');
      
      // Redirect based on user role
      if(res.data.user.role === 'DRIVER') {
        router.push('/DriverDashboard');
      } else {
        router.push('/Dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/Signin');
  };

  const toggleShowOtp = () => {
    setShowOtp(!showOtp);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton 
              onClick={handleBack} 
              sx={{ 
                mr: 2, 
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
              Verify Your Email
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We've sent a verification code to <strong>{email}</strong>. Please enter the code below to verify your account.
          </Typography>

          {message && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Verification Code"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowOtp}
                      edge="end"
                    >
                      {showOtp ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              type={showOtp ? "text" : "password"}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
            </Button>
          </form>
          
          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Didn't receive the code?{' '}
              <Button 
                variant="text" 
                color="primary" 
                size="small"
                onClick={() => router.push('/Signin')}
              >
                Try again
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Verify;
