'use client';

import { useState, useEffect } from 'react';
import { Button, Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await fetch('/api/rides');
      const data = await response.json();
      setRides(data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  const handleCreateRide = () => {
    router.push('/create-ride');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Driver Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateRide}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Create New Ride
        </Button>
      </Box>

      <Typography variant="h6" mb={3}>
        Your Rides
      </Typography>

      <Grid container spacing={3}>
        {rides.map((ride) => (
          <Grid item xs={12} sm={6} md={4} key={ride.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {ride.startLocation} → {ride.endLocation}
                </Typography>
                <Typography color="textSecondary">
                  Departure: {new Date(ride.departureTime).toLocaleString()}
                </Typography>
                <Typography>
                  Available Seats: {ride.availableSeats}
                </Typography>
                <Typography>
                  Price: ${ride.price}
                </Typography>
                <Typography color="textSecondary">
                  Status: {ride.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}