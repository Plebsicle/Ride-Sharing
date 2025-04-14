import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Get vehicle details for the driver
export const getVehicleDetails = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(
      `${API_URL}/driver/vehicle`, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        },
        params: { userId: user.id }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    throw error;
  }
};

// Update vehicle details
export const updateVehicleDetails = async (vehicleData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(
      `${API_URL}/driver/vehicle`,
      {
        userId: user.id,
        ...vehicleData
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle details:', error);
    throw error;
  }
};

// Get driver verification status
export const getDriverVerificationStatus = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.get(
     `${API_URL}/driver/verification-status`, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        },
        params: { userId: user.id }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching verification status:', error);
    throw error;
  }
};

// Submit driver verification documents
export const submitDriverVerification = async (verificationData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('userId', user.id);
    
    // Add all document data
    Object.keys(verificationData).forEach(key => {
      if (verificationData[key] instanceof File) {
        formData.append(key, verificationData[key]);
      } else {
        formData.append(key, verificationData[key]);
      }
    });

    const response = await axios.post(
      `${API_URL}/driver/verify`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting verification documents:', error);
    throw error;
  }
};