const multer = require("multer");
const path = require("path");
const Product = require("../Models/Product.model");
const UserModel = require("../Models/User.model");

// Function to upload images and return their paths
const uploadImagesProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/Product/");
  },
  filename: async (req, file, cb) => {
    try {
      const lastProduct = await Product.findOne().sort({ _id: -1 }).limit(1);
      let uniqueSuffix;
      if (lastProduct) {
        const lastProductId = parseInt(lastProduct.productId.slice(1)); // Remove '#' and convert to number
        uniqueSuffix = `${(lastProductId + 1).toString().padStart(5, "0")}`; // Pad with zeros to ensure 5-digit format
      } else {
        uniqueSuffix = "00001"; // If no previous entry, start with '#00001'
      }
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    } catch (err) {
      console.error("Error generating filename:", err);
      cb(err);
    }
  },
});

const uploadImagesProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: async (req, file, cb) => {
    try {
      const lastUser = await UserModel.findOne().sort({ _id: -1 }).limit(1);
      const uniqueSuffix = lastUser._id;
      const ext = path.extname(file.originalname);

      // Update the user document with the filename
      await UserModel.findByIdAndUpdate(lastUser._id, { pic: "uploads/profile/" + uniqueSuffix + ext });

      cb(null, uniqueSuffix + ext);
    } catch (err) {
      console.error("Error generating filename:", err);
      cb(err);
    }
  },
});

const uploadImagesSEAttendance = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/Attendance/SE/");
  },
  filename: async (req, file, cb) => {
    try {
      const currentDate = new Date();
      const timestamp = currentDate.getTime().toString(); // Get current time as string
      const uniqueSuffix = timestamp;
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    } catch (err) {
      console.error("Error generating filename:", err);
      cb(err);
    }
  },
});

const UploadContractPages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/Contract_Pages/");
  },
  filename: async (req, file, cb) => {
    try {
      const currentDate = new Date();
      const timestamp = currentDate.getTime().toString(); // Get current time as string
      const uniqueSuffix = timestamp;
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    } catch (err) {
      console.error("Error generating filename:", err);
      cb(err);
    }
  },
});

module.exports = { uploadImagesProduct, uploadImagesProfile, uploadImagesSEAttendance, UploadContractPages };
