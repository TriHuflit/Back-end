const jwt = require("jsonwebtoken");
const Customers = require("../models/Customers");
const Permissons = require("../models/Permissons");
require("dotenv").config();

function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }
  return [
    async (req, res, next) => {
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
        if (roles.length && !roles.includes(req.Role)) {
          // user's role is not authorized
          return res.status(401).json({ message: "Unauthorized" });
        }
        next();
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Invalid token" });
      }
    },
  ];
}
module.exports.authorize = authorize;
