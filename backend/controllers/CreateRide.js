import prisma from '../config/db.config.js';
export const createRide = async (req, res) => {
  try {
    const {
      userId,
      startLocation,
      endLocation,
      departureTime,
      availableSeats,
      model,
      licenseNo,
      color,
      capacity,
      price,
    } = req.body;

    console.log("Create Ride Body:", req.body);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found.' });
    }

    const departureDate = new Date(departureTime);

    if (isNaN(departureDate.getTime())) {
      return res.status(400).json({ message: 'Invalid departure time.' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== 'DRIVER') {
      return res.status(403).json({ message: 'User is not authorized to create a ride.' });
    }

    // Create the ride
    const ride = await prisma.rideGiven.create({
      data: {
        driverId: userId,
        startLocation,
        endLocation,
        departureTime: departureDate,
        availableSeats,
        price,
        status: 'SCHEDULED',
      },
    });

    // Create the vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        model,
        licenseNo,
        color,
        capacity,
      },
      select: {
        id: true,
        model: true,
        licenseNo: true,
        color: true,
        capacity: true,
      },
    });

    res.status(201).json({ message: 'Ride and vehicle created successfully.', ride, vehicle });

  } catch (error) {
    console.error('Create Ride Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllRides = async (req, res) => {
  try {
    const rides = await prisma.rideGiven.findMany({
      include: {
        driver: {
          select: { id: true, name: true, email: true },
        },
        bookings: true,
      },
      orderBy: { departureTime: 'asc' },
    });
    res.json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
};