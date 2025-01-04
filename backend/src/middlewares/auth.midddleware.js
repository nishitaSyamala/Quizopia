import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    // Check if the user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'User is deactivated, access denied' });
    }

    req.user = user;  // Attach user to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};