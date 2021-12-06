const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifytoken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token not found",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.CustomerId = decoded.CustomerId;
    req.Role = decoded.Role;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Invalid token" });
  }
};
module.exports = verifytoken;
