'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const BookRide = () => {
  const [rideId, setRideId] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [fare, setFare] = useState('');
  const [status, setStatus] = useState('CONFIRMED');
  const [numberOfBags, setNumberOfBags] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/book-ride', {
        rideId,
        passengerId,
        fare: parseFloat(fare),
        status,
        baggageDetails: {
          numberOfBags: parseInt(numberOfBags),
          totalWeight: parseFloat(totalWeight),
        },
      });

      setMessage('Booking successful!');
      router.push('/Dashboard'); // Redirect if needed
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Book a Ride</h2>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ride ID"
          className="w-full border p-2 rounded"
          value={rideId}
          onChange={(e) => setRideId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Passenger ID"
          className="w-full border p-2 rounded"
          value={passengerId}
          onChange={(e) => setPassengerId(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Fare"
          className="w-full border p-2 rounded"
          value={fare}
          onChange={(e) => setFare(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of Bags"
          className="w-full border p-2 rounded"
          value={numberOfBags}
          onChange={(e) => setNumberOfBags(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Total Weight (kg)"
          className="w-full border p-2 rounded"
          value={totalWeight}
          onChange={(e) => setTotalWeight(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Book Ride
        </button>
      </form>
    </div>
  );
};

export default BookRide;
