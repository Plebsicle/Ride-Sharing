import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to protect routes and verify the JWT token
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
};
