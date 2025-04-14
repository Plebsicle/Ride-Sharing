import prisma from "../config/db.config.js";

// Get user profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const { user } = req.body;
    const userId = user.id;

    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        aadharNumber: true,
        isAadharVerified: true,
        createdAt: true,
        location: true,
        _count: {
          select: {
            bookings: true,
            ridesGiven: true,
          }
        }
      }
    });

    if (!userProfile) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      userProfile
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { user } = req.body;
    const userId = user.id;
    const { name, aadharNumber } = req.body;

    // Validate input
    if (!name && !aadharNumber) {
      return res.status(400).json({
        message: "No update data provided"
      });
    }

    // Create update data object
    const updateData = {};
    if (name) updateData.name = name;
    if (aadharNumber) updateData.aadharNumber = aadharNumber;

    // Update user profile
    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        aadharNumber: true,
        isAadharVerified: true,
        createdAt: true,
      }
    });

    res.status(200).json({
      message: "User profile updated successfully",
      profile: updatedProfile
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

// Update user location
export const updateUserLocation = async (req, res) => {
  try {
    const { user } = req.body;
    const userId = user.id;
    const { address, city, state, country, zipCode } = req.body;

    // Validate required fields
    if (!address || !city || !state || !country || !zipCode) {
      return res.status(400).json({
        message: "Missing required location data"
      });
    }

    // Check if location exists for this user
    const existingLocation = await prisma.location.findUnique({
      where: { userId }
    });

    // Set default latitude and longitude if not provided
    const latitude = 0;
    const longitude = 0;

    let location;

    if (existingLocation) {
      // Update existing location
      location = await prisma.location.update({
        where: { userId },
        data: {
          latitude,
          longitude,
          address,
          city,
          state,
          country,
          zipCode,
          lastUpdated: new Date()
        }
      });
    } else {
      // Create new location
      location = await prisma.location.create({
        data: {
          userId,
          latitude,
          longitude,
          address,
          city,
          state,
          country,
          zipCode,
        }
      });
    }

    res.status(200).json({
      message: "Location updated successfully",
      location
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({
      message: "Failed to update location",
      error: error.message,
    });
  }
};