import prisma from "../config/db.config.js";

export const getPendingRequests = async (req, res) => {
    try {
      // Get passenger ID from authenticated user
      const passengerId = req.user.id;
  
      // Find pending bookings for this specific passenger
      const pendingRides = await prisma.booking.findMany({
        where: {
          passengerId,
          status: "PENDING"
        },
        include: {
          ride: true, 
          passenger: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
  
      // Check if any rides were found
      if (pendingRides.length === 0) {
        return res.status(200).json({
          message: "No pending rides found",
          pendingRides: []
        });
      }
  
      res.status(200).json({
        message: "Pending requests retrieved successfully",
        pendingRides
      });
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      res.status(500).json({
        message: "Failed to fetch pending requests",
        error: error.message,
      });
    }
  };
  
  export const getApprovedRides = async (req, res) => {
    try {
      const passengerId = req.user.id;
  
      const approvedRides = await prisma.booking.findMany({
        where: {
          passengerId,
          status: "ACCEPTED"
        },
        include: {
          ride: {
            include: {
              driver: {
                select: {
                  vehicle: {
                    select: {
                      model: true,
                      color: true,
                      licenseNo: true,
                      capacity: true
                    }
                  }
                }
              }
            }
          },
          baggage: true,
          passenger: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
  
      if (approvedRides.length === 0) {
        return res.status(200).json({
          message: "No approved rides found",
          rides: []
        });
      }
  
      const formattedRides = approvedRides.map(booking => ({
        id: booking.ride.id,
        startLocation: booking.ride.startLocation,
        endLocation: booking.ride.endLocation,
        departureTime: booking.ride.departureTime,
        price: booking.fare,
        bookingId: booking.id,
        status: booking.status,
        availableSeats: booking.ride.availableSeats,
        vehicle: booking.ride.driver?.vehicle || null,
        baggage: booking.baggage
          ? {
              numberOfBags: booking.baggage.numberOfBags,
              totalWeight: booking.baggage.totalWeight
            }
          : null,
      }));
  
      res.status(200).json({
        message: "Approved rides retrieved successfully",
        approvedRides: formattedRides
      });
    } catch (error) {
      console.error("Error fetching approved rides:", error);
      res.status(500).json({
        message: "Failed to fetch approved rides",
        error: error.message,
      });
    }
  };
  
export const getPassengerRideStats = async (req, res) => {
  try {
    // Get passenger ID from authenticated user
    // console.log(req.user);
    const passengerId = req.user.id;
    
    // Get total bookings count for this specific passenger
    const totalBookingsCount = await prisma.booking.count({
      where: {
        passengerId
      }
    });

    // Get accepted bookings count for this specific passenger
    const acceptedBookingsCount = await prisma.booking.count({
      where: {
        passengerId,
        status: "ACCEPTED"
      }
    });
    
    // Get user rating (assuming there's a rating field in the user model)
    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: passengerId
    //   },
    //   select: {
    //     rating: true
    //   }
    // });

    // Return the statistics
    console.log(passengerId);
    console.log(totalBookingsCount);
    console.log(acceptedBookingsCount);
    res.status(200).json({
      success: true,
      message: "Passenger statistics retrieved successfully",
      stats: {
        totalBookings: totalBookingsCount,
        acceptedBookings: acceptedBookingsCount, // Changed from activeBookings to acceptedBookings
        rating:  4.5 // Default rating of 4.5 if not available
      }
    });
  } catch (error) {
    console.error('Error fetching passenger statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch passenger statistics'
    });
  }
};

export const getCompletedRides = async (req, res) => {
  try {
    const passengerId = req.user.id;

    const completedRides = await prisma.booking.findMany({
      where: {
        passengerId,
        status: "COMPLETED"
      },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                email: true,
                // phone: true // optional driver info
              }
            }
          }
        },
        passenger: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        baggage: true // Include baggage info if it exists
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    if (completedRides.length === 0) {
      return res.status(200).json({
        message: "No completed rides found",
        completedRides: []
      });
    }

    const formattedRides = completedRides.map(booking => {
      return {
        id: booking.ride.id,
        startLocation: booking.ride.startLocation,
        endLocation: booking.ride.endLocation,
        departureTime: booking.ride.departureTime,
        price: booking.fare,
        bookingId: booking.id,
        status: booking.status,
        completedAt: booking.updatedAt,
        carModel: booking.ride.carModel || "Not specified",
        carColor: booking.ride.carColor || "Not specified",
        driver: booking.ride.driver ? {
          id: booking.ride.driver.id,
          name: booking.ride.driver.name,
          email: booking.ride.driver.email,
          phone: booking.ride.driver.phone
        } : null,
        baggage: booking.baggage || null
      };
    });

    res.status(200).json({
      message: "Completed rides retrieved successfully",
      completedRides: formattedRides
    });
  } catch (error) {
    console.error("Error fetching completed rides:", error);
    res.status(500).json({
      message: "Failed to fetch completed rides",
      error: error.message,
    });
  }
};
