import prisma from "../config/db.config.js";

export const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.user.id;

    const rides = await prisma.rideGiven.findMany({
      where: {
        driverId,
        status: "PENDING",
      },
      include: {
        driver: {
          select: {
            vehicle: {
              select: {
                model: true,
                color: true,
                licenseNo: true,
                capacity: true,
              },
            },
          },
        },
        bookings: {
          include: {
            passenger: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            baggage: true,
          },
        },
      },
    });

    const bookingsWithDetails = rides.flatMap((ride) =>
      ride.bookings.map((booking) => ({
        rideId: ride.id,
        startLocation: ride.startLocation,
        endLocation: ride.endLocation,
        departureTime: ride.departureTime,
        bookingId: booking.id,
        passenger: booking.passenger,
        fare: booking.fare,
        status: booking.status,
        time: booking.Time,
        location: booking.Location,
        baggage: booking.baggage
          ? {
              numberOfBags: booking.baggage.numberOfBags,
              totalWeight: booking.baggage.totalWeight,
            }
          : null,
        vehicle: ride.driver?.vehicle || null,
      }))
    );
    console.log(bookingsWithDetails);
    res.json({
      success: true,
      data: bookingsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching driver bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch driver bookings",
    });
  }
};



export const approveRideRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const { status } = req.body;
    const bookingId = id;
    console.log(bookingId);
    console.log(status);

    // Validate input
    if (!bookingId || !status) {
      return res.status(400).json({ message: "bookingId and status are required" });
    }

    // Check if the booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    const updatedRideGiven = await prisma.rideGiven.update({
      where : {
        id : updatedBooking.rideId
      },
      data : {status}
    })
    
    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getDriverApprovedRides = async (req, res) => {
  try {
    const driverId = req.user.id;

    const rides = await prisma.rideGiven.findMany({
      where: {
        driverId,
        status: "ACCEPTED"
      },
      include: {
        driver: {
          select: {
            vehicle: {
              select: {
                model: true,
                color: true,
                licenseNo: true,
                capacity: true,
              },
            },
          },
        },
        bookings: {
          include: {
            passenger: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            baggage: true,
          },
        },
      },
    });

    const approvedRides = rides.flatMap(ride => 
      ride.bookings.map(booking => ({
        rideId: ride.id,
        startLocation: ride.startLocation,
        endLocation: ride.endLocation,
        departureTime: ride.departureTime,
        availableSeats: ride.availableSeats,
        distance: ride.distance, // assuming distance is a field in RideGiven
        bookingId: booking.id,
        passenger: booking.passenger,
        price: booking.fare,
        status: booking.status,
        baggage: booking.baggage,
        vehicle: ride.driver?.vehicle || null
      }))
    );

    res.status(200).json({
      success: true,
      message: "Approved rides retrieved successfully",
      approvedRides,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving approved rides",
    });
  }
};


export const getDriverRideStats = async (req, res) => {
  try {
    // Get driver ID from authenticated user
    // const {user} = req.body;
    const driverId = req.user.id;

    // Get total rides count for this specific driver
    const totalRidesCount = await prisma.rideGiven.count({
      where: {
        driverId
      }
    });

    // Get accepted rides count for this specific driver
    const acceptedRidesCount = await prisma.rideGiven.count({
      where: {
        driverId,
        status: "ACCEPTED"
      }
    });

    // Get total earnings for this specific driver
    const allRides = await prisma.rideGiven.findMany({
      where: {
        driverId
      },
      include: {
        bookings: true
      }
    });

    // Calculate total earnings from all bookings
    const totalEarnings = allRides.reduce((total, ride) => {
      const rideEarnings = ride.bookings.reduce((sum, booking) => sum + (booking.fare || 0), 0);
      return total + rideEarnings;
    }, 0);

    res.status(200).json({
      success: true,
      message: "Driver statistics retrieved successfully",
      stats: {
        totalRides: totalRidesCount,
        acceptedRides: acceptedRidesCount, // Changed from activeRides to acceptedRides
        totalEarnings: totalEarnings
      }
    });
  } catch (error) {
    console.error('Error fetching driver statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch driver statistics'
    });
  }
};

export const getDriverCompletedRides = async (req, res) => {
  try {
    const driverId = req.user.id;
    
    const rides = await prisma.rideGiven.findMany({
      where: {
        driverId,
        status: "COMPLETED"
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            vehicle: {
              select: {
                model: true,
                licenseNo: true,
                color: true,
                capacity: true
              }
            }
          }
        },
        bookings: {
          include: {
            passenger: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            baggage: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const completedRides = rides.flatMap(ride => 
      ride.bookings.map(booking => ({
        id: ride.id,
        startLocation: ride.startLocation,
        endLocation: ride.endLocation,
        departureTime: ride.departureTime,
        completedAt: booking.updatedAt,
        bookingId: booking.id,
        passenger: booking.passenger,
        price: booking.fare,
        status: booking.status,
        distance: ride.route, // Since you don't have 'distance' in schema, maybe you meant 'route'
        baggage: booking.baggage || null,
        driver: {
          id: ride.driver.id,
          name: ride.driver.name,
          email: ride.driver.email
        },
        vehicle: ride.driver.vehicle || null
      }))
    );

    res.status(200).json({
      success: true,
      message: "Completed rides retrieved successfully",
      completedRides
    });
  } catch (error) {
    console.error('Error fetching driver completed rides:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch driver completed rides',
    });
  }
};
