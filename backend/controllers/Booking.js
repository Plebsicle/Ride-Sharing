import prisma from '../config/db.config.js';

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
    const { rideId, passengerId, baggageDetails, status, fare } = req.body;
  
    try {
      // Create the booking along with baggage details if provided
      const booking = await prisma.booking.create({
        data: {
          rideId,
          passengerId,
          status,
          fare,
          baggage: baggageDetails ? {
            create: {
              numberOfBags: baggageDetails.numberOfBags,
              totalWeight: baggageDetails.totalWeight,
            },
          } : undefined,
        },
        include: {
          ride: true,
          passenger: true,
          baggage: true,
        },
      });
  
      res.status(201).json({
        message: 'Booking created successfully',
        booking,
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  };

/**
 * Get all bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        ride: true,
        passenger: true,
        baggage: true,
      },
    });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        ride: true,
        passenger: true,
        baggage: true,
      },
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ error: 'Failed to retrieve booking' });
  }
};

/**
 * Update a booking
 */
export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const { status, fare, baggageDetails } = req.body;

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        fare,
        baggage: baggageDetails ? {
          update: {
            numberOfBags: baggageDetails.numberOfBags,
            totalWeight: baggageDetails.totalWeight,
            description: baggageDetails.description,
          },
        } : undefined,
      },
      include: {
        ride: true,
        passenger: true,
        baggage: true,
      },
    });

    res.json({
      message: 'Booking updated successfully',
      booking,
    });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

/**
 * Delete a booking
 */
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.booking.delete({
      where: { id },
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
