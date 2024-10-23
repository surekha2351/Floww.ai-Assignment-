// authMiddleware.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "Floww.ai";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification error:", error.message); // Logs for any verification errors
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = authMiddleware;
