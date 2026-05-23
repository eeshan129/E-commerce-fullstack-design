const jwt = require('jsonwebtoken');
const User = require('../models/User');

// protect — blocks the route if the user is not logged in
const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // extract just the token part

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify and decode it
      req.user = await User.findById(decoded.id).select('-password'); // attach user to request

      next(); // token is valid, let the request through
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// adminOnly — blocks the route if the logged-in user is not an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admins only' });
  }
};

module.exports = { protect, adminOnly };