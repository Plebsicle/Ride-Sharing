'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Snackbar
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  LocationOn,
  DirectionsCar,
  EventSeat,
  History,
  Verified,
  VerifiedUser,
  Badge,
  CarRental,
  DocumentScanner
} from '@mui/icons-material';
import { getUserProfile, updateUserProfile, updateUserLocation } from '../api/userService';
import { getVehicleDetails, updateVehicleDetails } from '../api/driverService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function DriverProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    aadharNumber: ''
  });
  const [locationData, setLocationData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });
  const [vehicleData, setVehicleData] = useState({
    model: '',
    licenseNo: '',
    color: '',
    capacity: 4
  });
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/Signin');
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'DRIVER') {
          router.push('/Dashboard');
        }
      }
      fetchUserProfile();
      fetchVehicleDetails();
    }
  }, [router]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile();
      setProfile(response.userProfile);
      setFormData({
        name: response.userProfile.name || '',
        aadharNumber: response.userProfile.aadharNumber || ''
      });
      
      if (response.userProfile.location) {
        setLocationData({
          address: response.userProfile.location.address || '',
          city: response.userProfile.location.city || '',
          state: response.userProfile.location.state || '',
          country: response.userProfile.location.country || '',
          zipCode: response.userProfile.location.zipCode || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load driver profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleDetails = async () => {
    try {
      const response = await getVehicleDetails();
      if (response.vehicle) {
        setVehicleData({
          model: response.vehicle.model || '',
          licenseNo: response.vehicle.licenseNo || '',
          color: response.vehicle.color || '',
          capacity: response.vehicle.capacity || 4
        });
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      // Don't set error state here, as this is secondary information
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLocationInputChange = (e) => {
    const { name, value } = e.target;
    setLocationData({
      ...locationData,
      [name]: value
    });
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: name === 'capacity' ? parseInt(value, 10) : value
    });
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      name: profile.name || '',
      aadharNumber: profile.aadharNumber || ''
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(formData);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setSnackbarOpen(true);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleSaveLocation = async () => {
    try {
      await updateUserLocation(locationData);
      setSuccess('Location updated successfully!');
      setSnackbarOpen(true);
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating location:', error);
      setError('Failed to update location. Please try again.');
    }
  };

  const handleSaveVehicle = async () => {
    try {
      await updateVehicleDetails(vehicleData);
      setSuccess('Vehicle details updated successfully!');
      setSnackbarOpen(true);
      fetchVehicleDetails();
    } catch (error) {
      console.error('Error updating vehicle details:', error);
      setError('Failed to update vehicle details. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBackToDashboard = () => {
    router.push('/DriverDashboard');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={fetchUserProfile} 
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Driver Profile
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
            >
              <Tab icon={<Person />} label="PROFILE" />
              <Tab icon={<DirectionsCar />} label="VEHICLE" />
              <Tab icon={<LocationOn />} label="LOCATION" />
              <Tab icon={<History />} label="RIDES HISTORY" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mr: 3, 
                      bgcolor: 'primary.main' 
                    }}
                  >
                    {profile?.name?.charAt(0) || 'D'}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="div">
                      {profile?.name}
                      {profile?.isVerified && (
                        <Chip 
                          icon={<Verified />} 
                          label="Verified" 
                          color="success" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {profile?.email}
                    </Typography>
                    <Chip 
                      label="DRIVER"
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {editMode ? (
                  <Box component="form" noValidate>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Aadhar Number"
                          name="aadharNumber"
                          value={formData.aadharNumber || ''}
                          onChange={handleInputChange}
                          helperText="Your 12-digit Aadhar number for verification"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                          <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={handleCancelEdit}
                            startIcon={<Cancel />}
                            sx={{ mr: 1 }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSaveProfile}
                            startIcon={<Save />}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Account Created:
                        </Typography>
                        <Typography variant="body1">
                          {new Date(profile?.createdAt).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Role:
                        </Typography>
                        <Typography variant="body1">
                          DRIVER
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Aadhar Number:
                        </Typography>
                        <Typography variant="body1">
                          {profile?.aadharNumber || 'Not provided'}
                          {profile?.isAadharVerified && (
                            <Chip 
                              icon={<VerifiedUser />} 
                              label="Verified" 
                              color="success" 
                              size="small" 
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Rides:
                        </Typography>
                        <Typography variant="body1">
                          {profile?._count?.ridesGiven || 0} rides given
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleEditProfile}
                            startIcon={<Edit />}
                          >
                            Edit Profile
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Vehicle Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box component="form" noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Vehicle Model"
                        name="model"
                        value={vehicleData.model}
                        onChange={handleVehicleInputChange}
                        placeholder="e.g. Toyota Camry 2020"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="License Number"
                        name="licenseNo"
                        value={vehicleData.licenseNo}
                        onChange={handleVehicleInputChange}
                        placeholder="e.g. MH02AB1234"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Vehicle Color"
                        name="color"
                        value={vehicleData.color}
                        onChange={handleVehicleInputChange}
                        placeholder="e.g. Silver"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Seating Capacity"
                        name="capacity"
                        type="number"
                        value={vehicleData.capacity}
                        onChange={handleVehicleInputChange}
                        inputProps={{ min: 1, max: 10 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleSaveVehicle}
                          startIcon={<Save />}
                        >
                          Save Vehicle Details
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Location Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box component="form" noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={locationData.address}
                        onChange={handleLocationInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={locationData.city}
                        onChange={handleLocationInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={locationData.state}
                        onChange={handleLocationInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={locationData.country}
                        onChange={handleLocationInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Zip Code"
                        name="zipCode"
                        value={locationData.zipCode}
                        onChange={handleLocationInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleSaveLocation}
                          startIcon={<Save />}
                        >
                          Save Location
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Ride History
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ py: 2 }}>
                  <Alert severity="info">
                    View your ride history in the Driver Dashboard under "Completed Rides" tab.
                  </Alert>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleBackToDashboard}
                    sx={{ mt: 2 }}
                  >
                    Go to Dashboard
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
}