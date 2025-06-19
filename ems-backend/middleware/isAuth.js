import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization; // Check for authorization header
  if (!authHeader?.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route" });
  }

  token = authHeader.split("")[1]; // Extract the token from the header
  // If the token is not present in the header, return an error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "15m"); // Verify the token using the secret key

    if (!decoded || !decoded?.userInfo) {
      return res.status(403).json({ message: "Forbidden, invalid token" });
    }
    req.user = decoded.userInfo; // Attach user info to the request object
    req.role = decoded.userInfo.roles; // Attach aslo user role to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ message: "Forbidden, invalid token" });
  }
};

export default protect;
// isAuth.js - Middleware to check if the user is authenticated
