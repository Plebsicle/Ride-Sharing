import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to protect routes and verify the JWT token
export const authenticate = (req, res, next) => {
  // Get token from authorization header
  const token = req.headers.authorization?.split(' ')[1]; 
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }
  
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Log for debugging
    console.log("Decoded token:", decoded);
    
    // Ensure user information is properly attached to the request object
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      // Include any other user properties that are in the token
      ...decoded
    };
    
    // Log for confirmation
    console.log("req.user set to:", req.user);
    
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
};
