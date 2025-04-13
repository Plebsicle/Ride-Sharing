"use client";
import React, { useState } from 'react';
import axios from 'axios';

const RideSearch = () => {
  const [destination, setDestination] = useState('');
  const [rides, setRides] = useState([]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:5000/rides', {
        params: { destination },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRides(response.data);
    } catch (err) {
      console.error('Error fetching rides:', err);
      alert('Could not fetch rides');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Search Rides</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {rides.length > 0 ? (
        <ul className="space-y-4">
          {rides.map((ride) => (
            <li
              key={ride.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <div className="text-lg font-medium text-gray-700">
                {ride.startLocation} → {ride.endLocation}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Departure: {new Date(ride.departureTime).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Seats: {ride.availableSeats} | Price: ₹{ride.price}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Driver: {ride.driver?.name} ({ride.driver?.email})
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No rides found. Try a different destination.</p>
      )}
    </div>
  );
};

export default RideSearch;
