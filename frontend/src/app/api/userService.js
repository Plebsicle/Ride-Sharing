import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Get user profile
export const getUserProfile = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.post(
      `${API_URL}/user/profile`, 
      { user },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(
      `${API_URL}/user/profile`,
      { 
        user,
        ...profileData 
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user location
export const updateUserLocation = async (locationData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const { address, city, state, country, zipCode } = locationData;
    
    const response = await axios.put(
      `${API_URL}/user/location`,
      { 
        user,
        address,
        city,
        state, 
        country,
        zipCode
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user location:', error);
    throw error;
  }
};