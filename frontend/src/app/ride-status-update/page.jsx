"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const RideManager = () => {
  const [status, setStatus] = useState("PENDING");
  const [bookingId, setBookingId] = useState(null);
  const [startLoading, setStartLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchBookingId = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("jwtToken");

        const res = await axios.get("http://localhost:5000/driverApprovedRides", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const firstRide = res.data.approvedRides?.[0];
        if (firstRide) {
          setBookingId(firstRide.bookingId);
          setStatus(firstRide.status || "PENDING");
        }
      } catch (err) {
        console.error("Failed to fetch booking ID:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchBookingId();
  }, []);

  const handleStartRide = async () => {
    try {
      setStartLoading(true);
      const token = localStorage.getItem("jwtToken");

      const res = await axios.patch(
        `http://localhost:5000/bookings/${bookingId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(res.data.status);
    } catch (err) {
      console.error("Failed to start ride:", err);
    } finally {
      setStartLoading(false);
    }
  };

  const handleEndRide = async () => {
    try {
      setEndLoading(true);
      const token = localStorage.getItem("jwtToken");

      const res = await axios.patch(
        `http://localhost:5000/bookings/${bookingId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(res.data.status);
    } catch (err) {
      console.error("Failed to end ride:", err);
    } finally {
      setEndLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "500px", 
      margin: "50px auto", 
      padding: "20px", 
      borderRadius: "8px", 
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      backgroundColor: "#fff" 
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Ride Status Manager</h1>
      
      <div style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "15px", 
        borderRadius: "5px", 
        marginBottom: "20px" 
      }}>
        <h3>Booking ID: {bookingId || "Loading..."}</h3>
        <p>Current Status: <strong>{status}</strong></p>
        {(fetching || startLoading || endLoading) && <p>Loading...</p>}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <button 
          onClick={handleStartRide} 
          disabled={startLoading || !bookingId}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: startLoading ? "not-allowed" : "pointer",
            opacity: startLoading ? 0.7 : 1
          }}
        >
          {startLoading ? "Starting..." : "Start Ride"}
        </button>

        <button 
          onClick={handleEndRide} 
          disabled={endLoading || !bookingId}
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: endLoading ? "not-allowed" : "pointer",
            opacity: endLoading ? 0.7 : 1
          }}
        >
          {endLoading ? "Ending..." : "End Ride"}
        </button>
      </div>

      <div style={{ color: "#666", fontSize: "12px", textAlign: "center" }}>
        <p>Debug information:</p>
        <pre>Status: {JSON.stringify(status)}</pre>
        <pre>BookingId: {JSON.stringify(bookingId)}</pre>
      </div>
    </div>
  );
};

export default RideManager;
