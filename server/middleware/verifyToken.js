import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  const cookieToken = req.cookies.token;
  const headerToken = req.headers.authorization?.split(' ')[1];
  const token = cookieToken || headerToken;
  
  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};    


export const verifyToken2 = async (req, res, next) => {
 
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Fetch user

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = { id: user._id, email: user.email }; // Attach email to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

