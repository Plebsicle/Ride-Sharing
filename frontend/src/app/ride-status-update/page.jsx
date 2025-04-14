"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const RideManager = () => {
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    const fetchBookingId = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/driverApprovedRides",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
          }
        );

        const firstRide = res.data.approvedRides?.[0];
        if (firstRide) {
          setBookingId(firstRide.bookingId);
          setStatus(firstRide.status || "PENDING");
        }
      } catch (err) {
        console.error("Failed to fetch booking ID:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingId();
  }, []);

  const handleStartRide = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`http://localhost:5000/bookings/${bookingId}/start`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      setStatus(res.data.status);
    } catch (err) {
      console.error("Failed to start ride:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndRide = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`http://localhost:5000/bookings/${bookingId}/end`);
      setStatus(res.data.status);
    } catch (err) {
      console.error("Failed to end ride:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ride-manager">
      <h3>Booking ID: {bookingId || "Loading..."}</h3>
      <p>Status: {status}</p>

      {status === "PENDING" && bookingId && (
        <button onClick={handleStartRide} disabled={loading}>
          {loading ? "Starting..." : "Start Ride"}
        </button>
      )}

      {status === "IN_PROGRESS" && bookingId && (
        <button onClick={handleEndRide} disabled={loading}>
          {loading ? "Ending..." : "End Ride"}
        </button>
      )}
    </div>
  );
};

export default RideManager;