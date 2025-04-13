import prisma from '../config/db.config.js';
export const createRide = async (req, res) => {
  try {
    const {
      userId,         
      startLocation,
      endLocation,
      departureTime,
      availableSeats,
      price,
    } = req.body;

    console.log("Create Ride Body:", req.body);

    // If userId is not provided
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found.' });
    }

    // Ensure departureTime is a valid Date object
    const departureDate = new Date(departureTime);

    // Check if the departureDate is invalid
    if (isNaN(departureDate.getTime())) {
      return res.status(400).json({ message: 'Invalid departure time.' });
    }

    // Fetch the user details using userId
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Check if the user exists and has the 'DRIVER' role
    if (!user || user.role !== 'DRIVER') {
      return res.status(403).json({ message: 'User is not authorized to create a ride.' });
    }

    // Create the ride record
    const ride = await prisma.rideGiven.create({
      data: {
        driverId: userId,  // Use userId to create the ride
        startLocation,
        endLocation,
        departureTime: departureDate,  // Valid Date object for departureTime
        availableSeats,
        price,
        status: 'SCHEDULED',  // This can be adjusted based on your RideStatus enum
      },
    });

    res.status(201).json({ ride });
  } catch (error) {
    console.error('Create Ride Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
