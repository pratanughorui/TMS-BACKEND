const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    // ✅ If no authorization header is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      return next(new Error("Access denied! No token provided."));
    }

    const token = authHeader.split(" ")[1]; // ✅ Extract token correctly

    // ✅ If token is missing after "Bearer "
    if (!token) {
      res.status(401);
      return next(new Error("Access denied! Token is missing."));
    }

    // ✅ Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        return next(new Error("Invalid token! User is not authorized."));
      }

      req.user = decoded; // ✅ Attach decoded user info to request
      next(); // ✅ Proceed to the next middleware
    });

  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = validateToken;
