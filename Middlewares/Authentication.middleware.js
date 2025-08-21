const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JSON_SECRET;
const UserModel = require("../Models/User.model");

const Authentication = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    //     let cookieValue = req.headers.cookie?.split(" ")[0]?.split("=")[1];
    //     // Remove semicolon from the end of the string, if present
    //     if (cookieValue.endsWith(";")) {
    //       cookieValue = cookieValue.slice(0, -1); // Remove the last character
    //     }

    if (!token) {
      console.log(`Token Not Found - URL : ${req.url}`);
      return res.status(403).json({ Message: "Un-authorized. Token Not Found" });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) return res.json({ Message: err.message, status: "error" });
      req.headers.userID = decoded._id;
      req.headers.role = decoded.role;
      const user = await UserModel.findById(decoded._id).exec();

      if (decoded.role === "super_engineer" || decoded.role === "supervisor") {
        if (!user) {
          return res.status(404).json({ Message: "User not found", status: "error" });
        }
        if (user.termination) {
          return res.status(403).json({ Message: "You have been terminated by an admin" });
        }

        if (user.deactive_status) {
          return res.status(403).json({ Message: "You have been deactivated by an admin" });
        }
      }

      next();
    });
  } catch (error) {
    res.status(500).json({ Message: "Something went wrong while authorizing user", err: error });
  }
};
module.exports = Authentication;
