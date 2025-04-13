"use client";
import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });

      const data = res.data;

      // Successfully logged in, store the token in localStorage
      localStorage.setItem('jwtToken', data.token);

      // Optionally, store user data in localStorage or session storage
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Login successful:', data);

      // Redirect the user to a protected route or dashboard using href
      window.location.href = '/Dashboard'; // Change to the route you want
    } catch (err) {
      // Handle error
      if (err.response) {
        setError(err.response.data.error || 'Something went wrong');
      } else {
        setError('An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
