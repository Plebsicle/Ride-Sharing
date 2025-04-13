import prisma from '../config/db.config.js';
import { upload } from '../utils/fileUpload.js';

// Submit driver verification documents
export const submitVerification = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      
      try {
        const { userId } = req.body;
        const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        if (!documentUrl) {
          return res.status(400).json({ error: 'Document is required' });
        }
        // Rest of the function remains the same...
      } catch (error) {
        console.error('Error submitting verification:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  };

// Get verification status for a driver
export const getVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const verification = await prisma.driverVerification.findUnique({
      where: { userId },
    });
    
    if (!verification) {
      return res.status(404).json({ verified: false });
    }
    
    res.status(200).json({ verified: !!verification });
  } catch (error) {
    console.error('Error getting verification status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin endpoint to approve verification (optional)
export const approveVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    
    // In a real app, you would add admin role check here
    
    const verification = await prisma.driverVerification.update({
      where: { id: verificationId },
      data: { approved: true }, // You might want to add an 'approved' field to your model
    });
    
    // Update user role to verified driver if needed
    await prisma.user.update({
      where: { id: verification.userId },
      data: { role: 'DRIVER' }, // Or create a VERIFIED_DRIVER role
    });
    
    res.status(200).json(verification);
  } catch (error) {
    console.error('Error approving verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
