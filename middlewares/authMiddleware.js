import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// extract id from jwt token and attach it to req.user.id
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header not found!" });
  }

  const authToken = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    // attach both id and email if present in the JWT payload.  Including the
    // email here enables routes (like the interview questions endpoints) to
    // perform ownership checks without another database lookup.
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.log("Token verification failed!", error);
    res.status(403).json({ message: "Invalid or expired token!" });
  }
};
