"use client";
import React, { useState, useEffect } from 'react';

const CreateRide = () => {
  const [formData, setFormData] = useState({
    userId: '', // will be updated on component mount
    startLocation: '',
    endLocation: '',
    route: '',
    departureTime: '',
    availableSeats: '',
    model: '',
    licenseNo: '',
    color: '',
    capacity: '',
    price: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Use useEffect to retrieve userId from localStorage on component mount
  useEffect(() => {
    // const userId = localStorage.getItem('user.id');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: userId,
      }));
    } else {
      setErrorMessage('User not logged in.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Convert availableSeats, capacity to integers and price to a float
    const formDataToSend = {
      ...formData,
      availableSeats: parseInt(formData.availableSeats, 10),
      capacity: parseInt(formData.capacity, 10),
      price: parseFloat(formData.price),
    };

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authorization token not found. Please log in again.');
      }

      const response = await fetch('http://localhost:5000/create-ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add JWT token to the Authorization header
        },
        body: JSON.stringify(formDataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        setFormData({
          userId: formData.userId, // Keep the userId
          startLocation: '',
          endLocation: '',
          route: '',
          departureTime: '',
          availableSeats: '',
          model: '',
          licenseNo: '',
          color: '',
          capacity: '',
          price: ''
        });
      } else {
        setErrorMessage(result.message || 'Error creating ride. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error creating ride. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#f5f7fa", 
      minHeight: "100vh", 
      padding: "40px 20px"
    }}>
      <div style={{ 
        maxWidth: "800px", 
        margin: "0 auto", 
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "32px"
      }}>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "bold", 
          color: "#2563eb", 
          marginBottom: "24px",
          textAlign: "center"
        }}>Create New Ride</h1>
        
        {errorMessage && (
          <div style={{ 
            backgroundColor: "#fee2e2", 
            color: "#b91c1c", 
            padding: "16px", 
            borderRadius: "8px",
            marginBottom: "24px",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div style={{ 
            backgroundColor: "#dcfce7", 
            color: "#166534", 
            padding: "16px", 
            borderRadius: "8px",
            marginBottom: "24px",
            border: "1px solid #bbf7d0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "24px",
            marginBottom: "32px"
          }}>
            {/* <div style={{ gridColumn: "1 / 3" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500", 
                color: "#4b5563"
              }}>User ID</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                disabled
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #d1d5db", 
                  backgroundColor: "#f3f4f6", 
                  fontSize: "16px",
                  outline: "none"
                }}
              />
            </div> */}
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500", 
                color: "#4b5563"
              }}>Start Location</label>
              <input
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                required
                placeholder="Enter starting point"
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #d1d5db", 
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  "&:focus": {
                    borderColor: "#2563eb"
                  }
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500", 
                color: "#4b5563"
              }}>End Location</label>
              <input
                type="text"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
                required
                placeholder="Enter destination"
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #d1d5db", 
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
            
            <div style={{ gridColumn: "1 / 3" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500", 
                color: "#4b5563"
              }}>Route</label>
              <input
                type="text"
                name="route"
                value={formData.route}
                onChange={handleChange}
                required
                placeholder="Describe the route or via points"
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #d1d5db", 
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500", 
                color: "#4b5563"
              }}>Departure Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #d1d5db", 
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500", 
                color: "#4b5563"
              }}>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Fare amount in ₹"
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #d1d5db", 
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
            
            <div style={{ 
              padding: "16px", 
              backgroundColor: "#f0f9ff", 
              borderRadius: "12px", 
              gridColumn: "1 / 3",
              border: "1px solid #e0f2fe"
            }}>
              <h3 style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                color: "#0369a1", 
                marginBottom: "16px" 
              }}>Vehicle Details</h3>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "16px" 
              }}>
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500", 
                    color: "#4b5563"
                  }}>Vehicle Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Toyota Innova"
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px", 
                      borderRadius: "8px", 
                      border: "1px solid #d1d5db", 
                      fontSize: "16px",
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500", 
                    color: "#4b5563"
                  }}>License Number</label>
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleChange}
                    required
                    placeholder="e.g. KA01AB1234"
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px", 
                      borderRadius: "8px", 
                      border: "1px solid #d1d5db", 
                      fontSize: "16px",
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500", 
                    color: "#4b5563"
                  }}>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    placeholder="e.g. White"
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px", 
                      borderRadius: "8px", 
                      border: "1px solid #d1d5db", 
                      fontSize: "16px",
                      outline: "none",
                      transition: "border-color 0.2s"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "500", 
                    color: "#4b5563"
                  }}>Capacity</label>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center" 
                  }}>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="Total seats"
                      style={{ 
                        width: "100%", 
                        padding: "12px 16px", 
                        borderRadius: "8px", 
                        border: "1px solid #d1d5db", 
                        fontSize: "16px",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "500", 
                color: "#4b5563"
              }}>Available Seats</label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                required
                min="1"
                max={formData.capacity || 999}
                placeholder="Number of seats to offer"
                style={{ 
                  width: "100%", 
                  padding: "12px 16px", 
                  borderRadius: "8px", 
                  border: "1px solid #d1d5db", 
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                backgroundColor: "#2563eb", 
                color: "white", 
                padding: "14px 28px", 
                borderRadius: "8px", 
                border: "none", 
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 6px rgba(37, 99, 235, 0.25)",
                width: "100%",
                maxWidth: "300px",
                opacity: loading ? "0.7" : "1"
              }}
            >
              {loading ? "Creating Ride..." : "Create Ride"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;