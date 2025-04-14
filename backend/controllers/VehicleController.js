import prisma from "../config/db.config.js";

// Get vehicle details for a driver
export const getVehicleDetails = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    // Find the vehicle details for this driver
    const vehicle = await prisma.vehicle.findUnique({
      where: { userId }
    });

    if (!vehicle) {
      return res.status(200).json({
        message: "No vehicle information found",
        vehicle: null
      });
    }

    res.status(200).json({
      message: "Vehicle details retrieved successfully",
      vehicle
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    res.status(500).json({
      message: "Failed to fetch vehicle details",
      error: error.message,
    });
  }
};

// Create or update vehicle details
export const updateVehicleDetails = async (req, res) => {
  try {
    const { userId, model, licenseNo, color, capacity } = req.body;

    // Validate required fields
    if (!userId || !model || !licenseNo || !color || !capacity) {
      return res.status(400).json({
        message: "Missing required vehicle data"
      });
    }

    // Check if vehicle already exists for this user
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { userId }
    });

    let vehicle;

    if (existingVehicle) {
      // Check if another vehicle has this license number (except the current one)
      const duplicateLicense = await prisma.vehicle.findFirst({
        where: {
          licenseNo,
          userId: { not: userId }
        }
      });

      if (duplicateLicense) {
        return res.status(400).json({
          message: "This license number is already registered with another driver"
        });
      }

      // Update existing vehicle
      vehicle = await prisma.vehicle.update({
        where: { userId },
        data: {
          model,
          licenseNo,
          color,
          capacity: parseInt(capacity, 10)
        }
      });
    } else {
      // Check if license number is already in use
      const duplicateLicense = await prisma.vehicle.findUnique({
        where: { licenseNo }
      });

      if (duplicateLicense) {
        return res.status(400).json({
          message: "This license number is already registered with another driver"
        });
      }

      // Create new vehicle
      vehicle = await prisma.vehicle.create({
        data: {
          userId,
          model,
          licenseNo,
          color,
          capacity: parseInt(capacity, 10)
        }
      });
    }

    res.status(200).json({
      message: "Vehicle details updated successfully",
      vehicle
    });
  } catch (error) {
    console.error("Error updating vehicle details:", error);
    res.status(500).json({
      message: "Failed to update vehicle details",
      error: error.message,
    });
  }
};

// Get driver verification status
export const getDriverVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    // Find the driver verification status
    const verification = await prisma.driverVerification.findUnique({
      where: { userId }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isVerified: true,
        isAadharVerified: true
      }
    });

    res.status(200).json({
      message: "Verification status retrieved successfully",
      verification,
      isVerified: user?.isVerified || false,
      isAadharVerified: user?.isAadharVerified || false
    });
  } catch (error) {
    console.error("Error fetching verification status:", error);
    res.status(500).json({
      message: "Failed to fetch verification status",
      error: error.message,
    });
  }
};

// Submit driver verification documents
export const submitDriverVerification = async (req, res) => {
  try {
    const { userId, documentNumber } = req.body;

    // Validate required fields
    if (!userId || !documentNumber) {
      return res.status(400).json({
        message: "Missing required verification data"
      });
    }

    // Check if verification already exists for this user
    const existingVerification = await prisma.driverVerification.findUnique({
      where: { userId }
    });

    let verification;

    if (existingVerification) {
      // Update existing verification
      verification = await prisma.driverVerification.update({
        where: { userId },
        data: {
          documentNumber,
          uploadedAt: new Date()
        }
      });
    } else {
      // Create new verification
      verification = await prisma.driverVerification.create({
        data: {
          userId,
          documentNumber,
          uploadedAt: new Date()
        }
      });
    }

    // Mark the driver as pending verification
    await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: false // This will be set to true by an admin after verification
      }
    });

    res.status(200).json({
      message: "Verification documents submitted successfully. Your account will be verified soon.",
      verification
    });
  } catch (error) {
    console.error("Error submitting verification:", error);
    res.status(500).json({
      message: "Failed to submit verification",
      error: error.message,
    });
  }
};