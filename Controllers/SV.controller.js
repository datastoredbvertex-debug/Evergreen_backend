const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const UserModel = require("../Models/User.model");
const SV_Attendance = require("../Models/SV.model");
const SV_Selfie = require("../Models/SV_Selfie.model");
const SV_Site_Alloment = require("../Models/Site_Allotment");
const Site = require("../Models/Site.model");
const Report = require("../Models/Report.model");
const Product = require("../Models/Product.model");
const ProductReport = require("../Models/Product_Report.model");
const multer = require("multer");
var multiparty = require("multiparty");
const Attendance_Uplaod_Dir = "./uploads/Attendance/SV";
const path = require("path");
const fs = require("fs");
const ClientModel = require("../Models/Client.model");
const geolib = require("geolib");
const SiteAllotment = require("../Models/Site_Allotment");
const BASE_URL = process.env.BASE_URL;
const moment = require("moment-timezone");
const { createNotification } = require("./NotificationControllers");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { ReportTemplate } = require("../Config/Template/reportmail");
const baseURL = process.env.BASE_URL;
const SendMail = require("../Config/mail");


const CLIENT_ID = process.env.CLIENTID;
const CLIENT_SECRET = process.env.CLIENTSECRET;
const REFRESH_TOKEN = "1//0474bv2NLpcIlCgYIARAAGAQSNwF-L9IrdNWJ5hhb5Mie2w_uY079ry8Lv-wiv4m9JF_diM31HtL7Itqec5tUr0_MZs4R5p00eGQ";
const USER_EMAIL = process.env.USER_EMAIL;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "https://developers.google.com/oauthplayground");

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

function generateOTP() {
  const min = 1000; // Minimum 4-digit number
  const max = 9999; // Maximum 4-digit number

  // Generate a random number between min and max (inclusive)
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp.toString(); // Convert the number to a string
}

exports.SiteGetAllotmentUser = async (req, res) => {
  try {
    // Fetch user ID from the request headers
    const userId = req.headers.userID; // Assuming the user ID is stored in the headers with the key 'userid'
    // Update the user with the site_ids array
    const userData = await SV_Site_Alloment.find({ user_id: userId }).populate({
      path: "site_id",
    });

    return res.status(200).json({ userData: userData, message: "Site get successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.SV_Attendance = async (req, res) => {
//   const form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
//   const userId = req.headers.userID;

//   // Generating the current timestamp in milliseconds
//   const timestamp = new Date(); // Get the current timestamp
//   const timestampInSeconds = Math.floor(timestamp.getTime() / 1000);
//   let newFilePaths;

//   // Create a promise to handle the file renaming process
//   const renameFile = (file) => {
//     return new Promise((resolve, reject) => {
//       const fileExtension = file.originalFilename.split(".").pop();
//       const newFilename = `${timestampInSeconds}.${fileExtension}`;
//       const newFilePath = path.join(Attendance_Uplaod_Dir, newFilename).replace(/\\/g, "/");

//       fs.rename(file.path, newFilePath, (err) => {
//         if (err) {
//           console.error("File renaming error:", err);
//           reject(new Error("File renaming error"));
//         } else {
//           resolve(newFilePath);
//         }
//       });
//     });
//   };

//   form.on("file", async function (name, file) {
//     try {
//       newFilePaths = await renameFile(file);
//     } catch (error) {
//       console.error(error.message);
//       return res.status(500).send({ error: error.message });
//     }
//   });

//   form.parse(req, async function (err, fields, files) {
//     if (!files || Object.keys(files).length === 0) {
//       return res.status(404).json({ error: "File is required" });
//     }

//     const file = files.file[0]; // Assuming the file input name is "file"
//     if (!file.originalFilename) {
//       return res.status(404).json({ error: "File is required" });
//     }
//     try {
//       const site = await Site.findById(fields.site_id[0]);
//       if (!site) {
//         return res.status(404).json({
//           message: "Site not found.",
//           status: false,
//         });
//       }

//       const user = await UserModel.findById(userId);
//       if (!user) {
//         return res.status(404).json({
//           message: "User not found.",
//           status: false,
//         });
//       }

//       // Ensure that the file has been renamed and newFilePaths is set
//       if (!newFilePaths) {
//         return res.status(500).json({ error: "File renaming error or file not uploaded." });
//       }

//       // Store the old profile picture path
//       const oldFilePath = user.pic;

//       // Update the user's profile picture path
//       user.pic = newFilePaths;
//       await user.save();

//       // const geolibb = geolib.getDistance({ latitude: site.location_lat, longitude: site.location_long }, { latitude: fields.lat[0], longitude: fields.long[0] });
//       // console.log(fields);
//       // if (geolibb > 300) {
//       //   return res.status(404).json({
//       //     message: "This location does not belong to the site",
//       //     status: false,
//       //   });
//       // }

//       // Check the user's last attendance entry
//       const lastAttendance = await SV_Attendance.findOne({ userId }).sort({ _id: -1 }).limit(1);
//       if (lastAttendance && ((lastAttendance.entry === "in" && fields.entry[0] === "in") || (lastAttendance.entry === "out" && fields.entry[0] === "out"))) {
//         return res.status(404).json({
//           message: `You cannot create consecutive '${fields.entry[0]}' entries.`,
//           status: false,
//         });
//       }

//       const attendance = await SV_Attendance.create({
//         date: fields.date[0],
//         userId: userId,
//         time: fields.time[0],
//         site_id: fields.site_id[0],
//         pic: newFilePaths,
//         entry: fields.entry[0],
//       });

//       return res.status(201).json({
//         _id: attendance._id,
//         date: attendance.date,
//         userId: attendance.userId,
//         time: attendance.time,
//         site_id: attendance.site_id,
//         pic: attendance.pic,
//         entry: attendance.entry,
//         status: true,
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// };

//comment by Atest 02/05/25

// exports.SV_Attendance = async (req, res) => {
//   let form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
//   const userId = req.headers.userID;
//   const timestamp = new Date();
//   const formattedDate = formatDate(timestamp);
//   const dateString = formattedDate.toLocaleString();
//   const date = new Date(dateString);
//   const timestampInSeconds = Math.floor(date.getTime() / 1000);
//   let newFilePaths;

//   form.on("file", function (name, file) {
//     const fileExtension = file.originalFilename.split(".").pop();
//     const newFilename = `${timestampInSeconds}.${fileExtension}`;
//     const newFilePath = path.join(Attendance_Uplaod_Dir, newFilename).replace(/\\/g, "/");
//     newFilePaths = newFilePath;

//     fs.rename(file.path, newFilePath, (err) => {
//       if (err) {
//         console.error("File renaming error:", err);
//         return res.status(500).send({ error: "File renaming error" });
//       }
//     });
//   });

//   form.parse(req, async function (err, fields, files) {
//     if (!files || Object.keys(files).length === 0) {
//       return res.status(404).json({ error: "File is required" });
//     }

//     const file = files.file[0];
//     if (!file.originalFilename) {
//       return res.status(404).json({ error: "File does not have an original filename" });
//     }

//     try {
//       const site = await Site.findById(fields.site_id[0]);
//       if (!site) {
//         return res.status(404).json({
//           message: "Site not found.",
//           status: false,
//         });
//       }

//       const user = await UserModel.findById(userId);
//       if (!user) {
//         return res.status(404).json({
//           message: "User not found.",
//           status: false,
//         });
//       }

//       // const userSiteIds = user.site_id.map((site) => site.toString());
//       // if (!userSiteIds.includes(fields.site_id[0].toString())) {
//       //   return res.status(404).json({
//       //     message: "Not allotted this site.",
//       //     status: false,
//       //   });
//       // }

//       const lastAttendance = await SV_Attendance.findOne({ userId, date: fields.date[0], site_id: fields.site_id[0] });

//       let attendance;
//       if (lastAttendance) {
//         if (fields.entry[0] === "in") {
//           if (lastAttendance.timeIn) {
//             return res.status(404).json({
//               message: "You cannot create consecutive 'in' entries.",
//               status: false,
//             });
//           }
//           lastAttendance.timeIn = fields.time[0];
//           lastAttendance.picIn = newFilePaths;
//           lastAttendance.entry = "in";
//         } else if (fields.entry[0] === "out") {
//           if (lastAttendance.timeOut) {
//             return res.status(404).json({
//               message: "You cannot create consecutive 'out' entries.",
//               status: false,
//             });
//           }
//           lastAttendance.timeOut = fields.time[0];
//           lastAttendance.picOut = newFilePaths;
//           lastAttendance.entry = "out";
//         }
//         attendance = await lastAttendance.save();
//       } else {
//         attendance = await SV_Attendance.create({
//           date: fields.date[0],
//           userId: userId,
//           site_id: fields.site_id[0],
//           timeIn: fields.entry[0] === "in" ? fields.time[0] : null,
//           timeOut: fields.entry[0] === "out" ? fields.time[0] : null,
//           picIn: fields.entry[0] === "in" ? newFilePaths : null,
//           picOut: fields.entry[0] === "out" ? newFilePaths : null,
//           entry: fields.entry[0],
//         });
//       }

//       return res.status(201).json({
//         _id: attendance._id,
//         date: attendance.date,
//         userId: attendance.userId,
//         timeIn: attendance.timeIn,
//         timeOut: attendance.timeOut,
//         site_id: attendance.site_id,
//         picIn: attendance.picIn,
//         picOut: attendance.picOut,
//         entry: attendance.entry,
//         status: true,
//       });
//     } catch (error) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// };

// edit by Atest 02/05/25

// exports.SV_Attendance = async (req, res) => {
//   let form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
//   const userId = req.headers.userID;
//   const timestamp = new Date();
//   const formattedDate = formatDate(timestamp);
//   const dateString = formattedDate.toLocaleString();
//   const date = new Date(dateString);
//   const timestampInSeconds = Math.floor(date.getTime() / 1000);
//   let newFilePaths;

//   form.on("file", function (name, file) {
//     const fileExtension = file.originalFilename.split(".").pop();
//     const newFilename = `${timestampInSeconds}.${fileExtension}`;
//     const newFilePath = path.join(Attendance_Uplaod_Dir, newFilename).replace(/\\/g, "/");
//     newFilePaths = newFilePath;

//     fs.rename(file.path, newFilePath, (err) => {
//       if (err) {
//         console.error("File renaming error:", err);
//         return res.status(500).send({ error: "File renaming error" });
//       }
//     });
//   });

//   form.parse(req, async function (err, fields, files) {
//     if (!files || Object.keys(files).length === 0) {
//       return res.status(404).json({ error: "File is required" });
//     }

//     const file = files.file[0];
//     if (!file.originalFilename) {
//       return res.status(404).json({ error: "File does not have an original filename" });
//     }

//     if (!fields.site_id || !fields.site_id[0]) {
//       return res.status(400).json({ message: "Site ID is required.", status: false });
//     }

//     try {
//       const site = await Site.findById(fields.site_id[0]);
//       if (!site) {
//         return res.status(404).json({ message: "Site not found.", status: false });
//       }

//       const user = await UserModel.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found.", status: false });
//       }

//       const userSiteIds = user.site_id.map((site) => site.toString());
//       if (!userSiteIds.includes(fields.site_id[0].toString())) {
//         return res.status(403).json({ message: "Not allotted this site.", status: false });
//       }

//       const existingAttendance = await SV_Attendance.findOne({
//         userId,
//         date: fields.date[0],
//         site_id: fields.site_id[0],
//       });

//       if (!existingAttendance) {
//         if (fields.entry[0] !== "in") {
//           return res.status(400).json({
//             message: "Your first attendance must be an 'in' entry.",
//             status: false,
//           });
//         }

//         const newAttendance = await SV_Attendance.create({
//           date: fields.date[0],
//           userId,
//           site_id: fields.site_id[0],
//           timeIn: fields.time[0],
//           picIn: newFilePaths,
//           entry: "in",
//         });

//         return res.status(201).json({
//           _id: newAttendance._id,
//           date: newAttendance.date,
//           userId: newAttendance.userId,
//           site_id: newAttendance.site_id,
//           timeIn: newAttendance.timeIn,
//           timeOut: newAttendance.timeOut,
//           picIn: newAttendance.picIn,
//           picOut: newAttendance.picOut,
//           entry: newAttendance.entry,
//           status: true,
//         });
//       } else {
//         if (fields.entry[0] === "in") {
//           if (existingAttendance.timeIn) {
//             return res.status(400).json({
//               message: "You have already marked 'in' for this site today.",
//               status: false,
//             });
//           }

//           existingAttendance.timeIn = fields.time[0];
//           existingAttendance.picIn = newFilePaths;
//           existingAttendance.entry = "in";
//         } else if (fields.entry[0] === "out") {
//           if (!existingAttendance.timeIn) {
//             return res.status(400).json({
//               message: "You must mark 'in' before marking 'out'.",
//               status: false,
//             });
//           }

//           if (existingAttendance.timeOut) {
//             return res.status(400).json({
//               message: "You have already marked 'out' for this site today.",
//               status: false,
//             });
//           }

//           existingAttendance.timeOut = fields.time[0];
//           existingAttendance.picOut = newFilePaths;
//           existingAttendance.entry = "out";
//         } else {
//           return res.status(400).json({ message: "Invalid entry type.", status: false });
//         }

//         const updatedAttendance = await existingAttendance.save();

//         return res.status(200).json({
//           _id: updatedAttendance._id,
//           date: updatedAttendance.date,
//           userId: updatedAttendance.userId,
//           site_id: updatedAttendance.site_id,
//           timeIn: updatedAttendance.timeIn,
//           timeOut: updatedAttendance.timeOut,
//           picIn: updatedAttendance.picIn,
//           picOut: updatedAttendance.picOut,
//           entry: updatedAttendance.entry,
//           status: true,
//         });
//       }
//     } catch (error) {
//       console.error("Attendance Error:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// };

// exports.SV_Attendance = async (req, res) => {
//   let form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
//   const userId = req.headers.userID;
//   const timestamp = new Date();
//   const formattedDate = formatDate(timestamp);
//   const dateString = formattedDate.toLocaleString();
//   const date = new Date(dateString);
//   const timestampInSeconds = Math.floor(date.getTime() / 1000);
//   let newFilePaths;

//   form.on("file", function (name, file) {
//     const fileExtension = file.originalFilename.split(".").pop();
//     const newFilename = `${timestampInSeconds}.${fileExtension}`;
//     const newFilePath = path.join(Attendance_Uplaod_Dir, newFilename).replace(/\\/g, "/");
//     newFilePaths = newFilePath;

//     fs.rename(file.path, newFilePath, (err) => {
//       if (err) {
//         console.error("File renaming error:", err);
//         return res.status(500).send({ error: "File renaming error" });
//       }
//     });
//   });

//   form.parse(req, async function (err, fields, files) {
//     if (!files || Object.keys(files).length === 0) {
//       return res.status(404).json({ error: "File is required" });
//     }

//     const file = files.file[0];
//     if (!file.originalFilename) {
//       return res.status(404).json({ error: "File does not have an original filename" });
//     }

//     if (!fields.site_id || !fields.site_id[0]) {
//       return res.status(400).json({ message: "Site ID is required.", status: false });
//     }

//     try {
//       const site = await Site.findById(fields.site_id[0]);
//       if (!site) {
//         return res.status(404).json({ message: "Site not found.", status: false });
//       }

//       const user = await UserModel.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found.", status: false });
//       }
//       // console.log(userId);
//       const allotments = await SV_Site_Alloment.find({ user_id: userId });

//       const isSiteAllotted = allotments.some((allotment) => allotment.site_id.map((id) => id.toString()).includes(fields.site_id[0].toString()));

//       if (!isSiteAllotted) {
//         return res.status(403).json({ message: "Not allotted this site.", status: false });
//       }

//       const existingAttendance = await SV_Attendance.findOne({
//         userId,
//         date: fields.date[0],
//         site_id: fields.site_id[0],
//       });

//       if (!existingAttendance) {
//         if (fields.entry[0] !== "in") {
//           return res.status(400).json({
//             message: "Your first attendance must be an 'in' entry.",
//             status: false,
//           });
//         }

//         const newAttendance = await SV_Attendance.create({
//           date: fields.date[0],
//           userId,
//           site_id: fields.site_id[0],
//           timeIn: fields.time[0],
//           picIn: newFilePaths,
//           entry: "in",
//         });

//         return res.status(201).json({
//           _id: newAttendance._id,
//           date: newAttendance.date,
//           userId: newAttendance.userId,
//           site_id: newAttendance.site_id,
//           timeIn: newAttendance.timeIn,
//           timeOut: newAttendance.timeOut,
//           picIn: newAttendance.picIn,
//           picOut: newAttendance.picOut,
//           entry: newAttendance.entry,
//           status: true,
//         });
//       } else {
//         if (fields.entry[0] === "in") {
//           if (existingAttendance.timeIn) {
//             return res.status(400).json({
//               message: "You have already marked 'in' for this site today.",
//               status: false,
//             });
//           }

//           existingAttendance.timeIn = fields.time[0];
//           existingAttendance.picIn = newFilePaths;
//           existingAttendance.entry = "in";
//         } else if (fields.entry[0] === "out") {
//           if (!existingAttendance.timeIn) {
//             return res.status(400).json({
//               message: "You must mark 'in' before marking 'out'.",
//               status: false,
//             });
//           }

//           if (existingAttendance.timeOut) {
//             return res.status(400).json({
//               message: "You have already marked 'out' for this site today.",
//               status: false,
//             });
//           }

//           existingAttendance.timeOut = fields.time[0];
//           existingAttendance.picOut = newFilePaths;
//           existingAttendance.entry = "out";
//         } else {
//           return res.status(400).json({ message: "Invalid entry type.", status: false });
//         }

//         const updatedAttendance = await existingAttendance.save();

//         return res.status(200).json({
//           _id: updatedAttendance._id,
//           date: updatedAttendance.date,
//           userId: updatedAttendance.userId,
//           site_id: updatedAttendance.site_id,
//           timeIn: updatedAttendance.timeIn,
//           timeOut: updatedAttendance.timeOut,
//           picIn: updatedAttendance.picIn,
//           picOut: updatedAttendance.picOut,
//           entry: updatedAttendance.entry,
//           status: true,
//         });
//       }
//     } catch (error) {
//       console.error("Attendance Error:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// };


// exports.SV_Attendance = async (req, res) => {
//   let form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
//   const userId = req.headers.userID;
//   const timestamp = new Date();
//   const formattedDate = formatDate(timestamp);
//   const dateString = formattedDate.toLocaleString();
//   const date = new Date(dateString);
//   const timestampInSeconds = Math.floor(date.getTime() / 1000);
//   let newFilePaths;

//   form.on("file", function (name, file) {
//     const fileExtension = file.originalFilename.split(".").pop();
//     const newFilename = `${timestampInSeconds}.${fileExtension}`;
//     const newFilePath = path.join(Attendance_Uplaod_Dir, newFilename).replace(/\\/g, "/");
//     newFilePaths = newFilePath;

//     fs.rename(file.path, newFilePath, (err) => {
//       if (err) {
//         console.error("File renaming error:", err);
//         return res.status(500).send({ error: "File renaming error" });
//       }
//     });
//   });

//   form.parse(req, async function (err, fields, files) {
//     if (!files || Object.keys(files).length === 0) {
//       return res.status(404).json({ error: "File is required" });
//     }

//     const file = files.file[0];
//     if (!file.originalFilename) {
//       return res.status(404).json({ error: "File does not have an original filename" });
//     }

//     if (!fields.site_id || !fields.site_id[0]) {
//       return res.status(400).json({ message: "Site ID is required.", status: false });
//     }

//     if (!fields.date || !fields.date[0]) {
//       return res.status(400).json({ message: "Date is required.", status: false });
//     }

//     if (!fields.entry || !fields.entry[0]) {
//       return res.status(400).json({ message: "Entry type (in/out) is required.", status: false });
//     }

//     try {
//       const site = await Site.findById(fields.site_id[0]);
//       if (!site) {
//         return res.status(404).json({ message: "Site not found.", status: false });
//       }

//       const user = await UserModel.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found.", status: false });
//       }

//       const allotments = await SV_Site_Alloment.find({ user_id: userId });
//       const isSiteAllotted = allotments.some((allotment) =>
//         allotment.site_id.map((id) => id.toString()).includes(fields.site_id[0].toString())
//       );

//       if (!isSiteAllotted) {
//         return res.status(403).json({ message: "Not allotted this site.", status: false });
//       }

//       // Normalize date (remove time part)
//       const attendanceDate = new Date(fields.date[0]);
//       attendanceDate.setHours(0, 0, 0, 0);

//       const existingAttendance = await SV_Attendance.findOne({
//         userId,
//         site_id: fields.site_id[0],
//         date: attendanceDate,
//       });

//       const entryType = fields.entry[0]; // "in" or "out"
//       const time = fields.time[0];

//       if (!existingAttendance) {
//         // First entry for this site/date, must be 'in'
//         if (entryType !== "in") {
//           return res.status(400).json({
//             message: "First attendance for this site today must be 'in'.",
//             status: false,
//           });
//         }

//         const newAttendance = await SV_Attendance.create({
//           date: attendanceDate,
//           userId,
//           site_id: fields.site_id[0],
//           timeIn: time,
//           picIn: newFilePaths,
//           entry: "in",
//           datetime:moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
//         });

//         return res.status(201).json({
//           ...newAttendance.toObject(),
//           status: true,
//         });
//       } else {
//         // Entry exists, check entry type logic
//         if (entryType === "in") {
//           if (existingAttendance.timeIn) {
//             return res.status(400).json({
//               message: "You have already marked 'in' for this site today.",
//               status: false,
//             });
//           }

//           existingAttendance.timeIn = time;
//           existingAttendance.picIn = newFilePaths;
//           existingAttendance.entry = "in";
//         } else if (entryType === "out") {
//           if (!existingAttendance.timeIn) {
//             return res.status(400).json({
//               message: "You must mark 'in' before marking 'out' for this site.",
//               status: false,
//             });
//           }

//           if (existingAttendance.timeOut) {
//             return res.status(400).json({
//               message: "You have already marked 'out' for this site today.",
//               status: false,
//             });
//           }

//           existingAttendance.timeOut = time;
//           existingAttendance.picOut = newFilePaths;
//           existingAttendance.entry = "out";
//         } else {
//           return res.status(400).json({ message: "Invalid entry type.", status: false });
//         }

//         const updatedAttendance = await existingAttendance.save();

//         return res.status(200).json({
//           ...updatedAttendance.toObject(),
//           status: true,
//         });
//       }
//     } catch (error) {
//       console.error("Attendance Error:", error);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//   });
// };

exports.SV_Attendance = async (req, res) => {
  let form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
  const userId = req.headers.userID;
  const timestamp = new Date();
  const timestampInSeconds = Math.floor(timestamp.getTime() / 1000);
  let newFilePaths;

  form.on("file", function (name, file) {
    const fileExtension = file.originalFilename.split(".").pop();
    const newFilename = `${timestampInSeconds}.${fileExtension}`;
    const newFilePath = path.join(Attendance_Uplaod_Dir, newFilename).replace(/\\/g, "/");
    newFilePaths = newFilePath;

    fs.rename(file.path, newFilePath, (err) => {
      if (err) {
        console.error("File renaming error:", err);
        return res.status(500).send({ error: "File renaming error" });
      }
    });
  });

  form.parse(req, async function (err, fields, files) {
    if (!files || Object.keys(files).length === 0) {
      return res.status(404).json({ error: "File is required" });
    }

    const file = files.file[0];
    if (!file.originalFilename) {
      return res.status(404).json({ error: "File does not have an original filename" });
    }

    if (!fields.site_id || !fields.site_id[0]) {
      return res.status(400).json({ message: "Site ID is required.", status: false });
    }

    if (!fields.date || !fields.date[0]) {
      return res.status(400).json({ message: "Date is required.", status: false });
    }

    if (!fields.entry || !fields.entry[0]) {
      return res.status(400).json({ message: "Entry type (in/out) is required.", status: false });
    }

    try {
      const site = await Site.findById(fields.site_id[0]);
      if (!site) {
        return res.status(404).json({ message: "Site not found.", status: false });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found.", status: false });
      }

      const allotments = await SV_Site_Alloment.find({ user_id: userId });
      const isSiteAllotted = allotments.some((allotment) =>
        allotment.site_id.map((id) => id.toString()).includes(fields.site_id[0].toString())
      );

      if (!isSiteAllotted) {
        return res.status(403).json({ message: "Not allotted this site.", status: false });
      }

      // Format date to DD/MM/YYYY string
      const rawDate = new Date(fields.date[0]);
      const attendanceDate = `${String(rawDate.getDate()).padStart(2, '0')}/${String(rawDate.getMonth() + 1).padStart(2, '0')}/${rawDate.getFullYear()}`;

      const existingAttendance = await SV_Attendance.findOne({
        userId,
        site_id: fields.site_id[0],
        date: attendanceDate,
      });

      const entryType = fields.entry[0]; // "in" or "out"
      const time = fields.time[0];

      if (!existingAttendance) {
        // First entry for this site/date, must be 'in'
        if (entryType !== "in") {
          return res.status(400).json({
            message: "First attendance for this site today must be 'in'.",
            status: false,
          });
        }

        const newAttendance = await SV_Attendance.create({
          date: attendanceDate,
          userId,
          site_id: fields.site_id[0],
          timeIn: time,
          picIn: newFilePaths,
          entry: "in",
          datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
        });

        return res.status(201).json({
          ...newAttendance.toObject(),
          status: true,
        });
      } else {
        // Entry exists, update based on in/out
        if (entryType === "in") {
          if (existingAttendance.timeIn) {
            return res.status(400).json({
              message: "You have already marked 'in' for this site today.",
              status: false,
            });
          }

          existingAttendance.timeIn = time;
          existingAttendance.picIn = newFilePaths;
          existingAttendance.entry = "in";
        } else if (entryType === "out") {
          if (!existingAttendance.timeIn) {
            return res.status(400).json({
              message: "You must mark 'in' before marking 'out' for this site.",
              status: false,
            });
          }

          if (existingAttendance.timeOut) {
            return res.status(400).json({
              message: "You have already marked 'out' for this site today.",
              status: false,
            });
          }

          existingAttendance.timeOut = time;
          existingAttendance.picOut = newFilePaths;
          existingAttendance.entry = "out";
        } else {
          return res.status(400).json({ message: "Invalid entry type.", status: false });
        }

        const updatedAttendance = await existingAttendance.save();

        return res.status(200).json({
          ...updatedAttendance.toObject(),
          status: true,
        });
      }
    } catch (error) {
      console.error("Attendance Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};



function formatDate(date) {
  const options = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

exports.SiteByProduct = async (req, res) => {
  try {
    // Fetch site ID from the request body
    const { site_id } = req.body;
    // Update the user with the site_ids array
    const userData = await Site.findById(site_id).populate({
      path: "product._id",
    });

    if (!userData) {
      return res.status(404).json({ message: "Site not found" });
    }
    console.log(userData);

    // Update the image URLs in the product_id array
    const updatedProducts = userData.product.map((product) => {
      return {
        ...product._doc, // Spread the existing product data
        image: `${BASE_URL}${product.image}`, // Prepend BASE_URL to the image path
      };
    });

    // Create a copy of userData and replace product_id with updatedProducts
    const updatedUserData = {
      ...userData._doc,
      // product_id: updatedProducts,
    };

    return res.status(200).json({ Product: updatedUserData, message: "Product get successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.GetClientEmail = async (req, res) => {
  try {
    // Fetch site ID from the request body
    const { site_id } = req.body;

    // Find site with populated client_id (emailData and clientEmail)
    const userData = await Site.findById(site_id).populate({
      path: "client_id",
      select: "emailData clientEmail", // Select emailData and clientEmail fields
    });

    if (!userData) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Construct the response in the desired format
    const formattedEmailData = {
      _id: userData.client_id._id,
      emailData: [
        {
          email: userData.client_id.clientEmail,
          _id: userData.client_id._id,
        },
        ...userData.client_id.emailData,
      ],
    };

    return res.status(200).json({ emails: formattedEmailData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// comment by Atest

// exports.OtpSendClientEmail = async (req, res) => {
//   try {
//     // Fetch site ID from the request body
//     const { email, _id } = req.body;
//     const newOTP = generateOTP();
//     const result = await ClientModel.updateOne({ _id: _id }, { $set: { otp: newOTP } });
//     // Send the new OTP to the user (you can implement this logic)
//     res.json({
//       message: "New OTP sent successfully.",
//       status: true,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// edit by Atest

exports.OtpSendClientEmail = async (req, res) => {
  try {
    const { email, _id } = req.body;
    if (!email || !_id) {
      return res.status(400).json({ message: "Email and User ID are required" });
    }

    // Generate OTP
    const newOTP = generateOTP();

    // Update OTP in the database
    await ClientModel.updateOne({ _id: _id }, { $set: { otp: newOTP } });

    // Get new access token
    const accessToken = await oauth2Client.getAccessToken();

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL, // Your Google Workspace email address
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token, // Get a fresh token
      },
    });

    // Email details
    let mailOptions = {
      from: `Evergreen Support <${USER_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${newOTP}. It will expire in 10 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({
      message: "OTP sent successfully to email.",
      status: true,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};


exports.ClientVerifyOtp = async (req, res) => {
  const { _id, otp, email, report_id } = req.body;

  try {
    const user = await ClientModel.findOne({ _id });

    if (!user) {
      return res.status(404).json({
        message: "Client Not Found.",
        status: false,
      });
    }
    if (user.otp == null) {
      return res.status(404).json({
        message: "Already OTP verified.",
        status: false,
      });
    }

    // Check if the provided OTP matches the OTP in the user document
    if (user.otp !== otp) {
      return res.status(404).json({
        message: "Invalid OTP.",
        status: false,
      });
    }    
    if(!email){
      return res.status(404).json({
        message: "Email is Required.",
        status: false,
      })
    }
    if(!report_id){
      return res.status(404).json({
        message: "report_id is required.",
        status: false,
      })
    }

    const result = await ClientModel.updateOne({ _id: user._id }, { $set: { otp: null } });
     const ReportSends = await ReportSend(report_id, email);
    res.json({
      message: "OTP verification successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ error: error.message, status: false });
  }
};



exports.SESitesFromAllotment = async (req, res) => {
  const { page = 1 } = req.body;
  const perPage = 10;
  const userId = req.headers.userID;

  try {
    // Find the total count of SiteAllotment entries for the given userId
    const totalCount = await SiteAllotment.countDocuments({ user_id: userId });
    const startIndex = (page - 1) * perPage;

    // Find the SiteAllotment entries for the given userId with pagination
    const allotments = await SiteAllotment.find({ user_id: userId }).sort({ date: -1 }).skip(startIndex).limit(perPage);

    // Extract unique site IDs and date from the allotments
    const siteDetails = allotments.flatMap((allotment) => {
      return allotment.site_id.map((siteId) => ({
        site_id: siteId,
        date: allotment.date,
      }));
    });

    // Extract unique site IDs
    const uniqueSiteIds = [...new Set(siteDetails.map((detail) => detail.site_id))];

    // Find sites based on the unique site IDs and retrieve all required details
    const sites = await Site.find({ _id: { $in: uniqueSiteIds } }).populate("report_submit", "full_name email"); // Adjust fields as needed

    // Find unique dates from all allotments
    const uniqueDates = [...new Set(allotments.map((allotment) => allotment.date))].sort();

    // Combine site details with site names and add the corresponding date
    const populatedSites = uniqueDates.map((date) => {
      return {
        date: date,
        sites: sites
          .filter((site) => {
            return siteDetails.some((detail) => detail.site_id.toString() === site._id.toString() && detail.date === date);
          })
          .map((site) => ({
            _id: site._id,
            site_name: site.site_name,
            amc: site.amc,
            working_hrs: site.working_hrs,
            man_power: site.man_power,
            location_lat: site.location_lat,
            location_long: site.location_long,
            start_date: site.start_date,
            end_date: site.end_date,
            discount: site.discount,
            report_submit: site.report_submit
              ? {
                  _id: site.report_submit._id,
                  full_name: site.report_submit.full_name,
                }
              : null,
          })),
      };
    });

    return res.status(200).json({ userData: populatedSites, message: "Site get successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// edit by Atest 07/05/25

exports.svSiteAllotment = async (req, res) => {
  const { page = 1 } = req.body;
  const perPage = 10;
  const userId = req.headers.userID;

  try {
    const totalCount = await SiteAllotment.countDocuments({ user_id: userId });
    const startIndex = (page - 1) * perPage;

    const allotments = await SiteAllotment.find({ user_id: userId }).sort({ date: 1 }).skip(startIndex).limit(perPage);

    // Extract site_id and date pairs
    const siteDetails = allotments.flatMap((allotment) => {
      return allotment.site_id.map((siteId) => ({
        site_id: siteId.toString(),
        date: allotment.date,
      }));
    });

    const uniqueSiteIds = [...new Set(siteDetails.map((detail) => detail.site_id))];

    const sites = await Site.find({ _id: { $in: uniqueSiteIds } }).populate("report_submit", "full_name email");

    // Build response as one entry per site per date
    const result = siteDetails.map((detail) => {
      const site = sites.find((s) => s._id.toString() === detail.site_id);
      if (!site) return null;

      return {
        date: detail.date,
        sites: [{
          _id: site._id,
          site_name: site.site_name,
          amc: site.amc,
          working_hrs: site.working_hrs,
          man_power: site.man_power,
          location_lat: site.location_lat,
          location_long: site.location_long,
          start_date: site.start_date,
          end_date: site.end_date,
          discount: site.discount,
          report_submit: site.report_submit
            ? {
                _id: site.report_submit._id,
                full_name: site.report_submit.full_name,
              }
            : null,
        }],
      };
    }).filter(Boolean); // remove any nulls in case a site wasn't found

    return res.status(200).json({ userData: result, message: "Site get successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




// edit by Atest 16/04/25

// exports.getSvAllData = async (req, res) => {
//   const userId = req.headers.userID;

//   try {
//     // 1. Get allotments
//     const allotments = await SiteAllotment.find({ user_id: userId }).sort({ date: -1 });
//     if (!allotments.length) {
//       return res.status(200).json({ userData: [], message: "No site allotments found" });
//     }

//     // 2. Get unique site IDs
//     const uniqueSiteIds = [...new Set(allotments.flatMap((a) => a.site_id.map((id) => id.toString())))];

//     // 3. Get sites and most recent reports
//     const [sites, reportDetails] = await Promise.all([
//       Site.find({ _id: { $in: uniqueSiteIds } }),
//       Report.find({ site_id: { $in: uniqueSiteIds } })
//         .sort({ datetime: -1 })
//         .populate("userId", "full_name email")
//         .lean(),
//     ]);

//     // 4. Group reports by site (most recent only)
//     const latestReports = {};
//     reportDetails.forEach((report) => {
//       const siteId = report.site_id.toString();
//       if (!latestReports[siteId]) {
//         latestReports[siteId] = report;
//       }
//     });

//     // 5. Combine data
//     const userData = sites.map((site) => {
//       const siteId = site._id.toString();
//       const report = latestReports[siteId];
//       const allotment = allotments.find((a) => a.site_id.some((id) => id.toString() === siteId));

//       return {
//         site_id: site._id,
//         site_name: site.site_name,
//         location_name: site.location_name,
//         date: allotment?.date,
//         report: report
//           ? {
//               report_submit: {
//                 full_name: report.userId.full_name,
//                 email: report.userId.email,
//               },
//               datetime: report.datetime,
//               submitDate: report.date,
//             }
//           : null,
//       };
//     });

//     return res.status(200).json({ userData, message: "Data fetched successfully" });
//   } catch (error) {
//     console.error("Error in getSvAllData:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.getSvAllData = async (req, res) => {
  const userId = req.headers.userID;

  try {
    // 1. Get allotments
    const allotments = await SiteAllotment.find({ user_id: userId }).sort({ date: -1 });
    if (!allotments.length) {
      return res.status(200).json({ userData: [], message: "No site allotments found" });
    }

    // 2. Unique site IDs
    const uniqueSiteIds = [...new Set(allotments.flatMap((a) => a.site_id.map((id) => id.toString())))];

    // 3. Get sites and all reports
    const [sites, reportDetails] = await Promise.all([
      Site.find({ _id: { $in: uniqueSiteIds } }),
      Report.find({ site_id: { $in: uniqueSiteIds } })
        .populate("userId", "full_name email")
        .lean(),
    ]);

    // 4. Helper: Convert "DD-MM-YYYY" to Date
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-");
      return new Date(`${year}-${month}-${day}`);
    };

    // 5. Group and pick latest report per site_id
    const latestReports = {};
    reportDetails.forEach((report) => {
      const siteId = report.site_id.toString();
      const reportDate = parseDate(report.date);

      if (!latestReports[siteId] || parseDate(latestReports[siteId].date) < reportDate) {
        latestReports[siteId] = report;
      }
    });

    // 6. Combine data
    const userData = sites.map((site) => {
      const siteId = site._id.toString();
      const report = latestReports[siteId];
      const allotment = allotments.find((a) => a.site_id.some((id) => id.toString() === siteId));

      return {
        site_id: site._id,
        site_name: site.site_name,
        location_name: site.location_name,
        date: allotment?.date,
        report: report
          ? {
              report_submit: {
                full_name: report.userId?.full_name || "",
                email: report.userId?.email || "",
              },
              datetime: report.datetime,
              submitDate: report.date,
            }
          : null,
      };
    });

    return res.status(200).json({ userData, message: "Data fetched successfully" });
  } catch (error) {
    console.error("Error in getSvAllData:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//------------ Add Report ---------------------//
const getProductReportDetails = async (site_id, product_id, product_report_id) => {
  try {
    const productReport = await ProductReport.findOne({
      _id: product_report_id,
      product_id: product_id,
      site_id: site_id,
    });

    return productReport;
  } catch (error) {
    console.error("Error fetching product report details:", error);
    throw new Error("Error fetching product report details");
  }
};

// Generate unique filename suffix using process.hrtime()
const generateRandomTimestamp = () => {
  const currentDate = new Date();
  const randomHours = Math.floor(Math.random() * 24); // Random hours within 0-23
  const randomMinutes = Math.floor(Math.random() * 60); // Random minutes within 0-59
  const randomSeconds = Math.floor(Math.random() * 60); // Random seconds within 0-59

  currentDate.setHours(randomHours, randomMinutes, randomSeconds, 0); // Set random hours, minutes, seconds, and milliseconds to 0

  // Get timestamp in seconds
  const timestampInSeconds = Math.floor(currentDate.getTime() / 1000);

  return timestampInSeconds.toString(); // Convert timestamp to string
};

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/Report");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = generateRandomTimestamp();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "image_0", maxCount: 1 },
  { name: "image_1", maxCount: 1 },
  { name: "image_2", maxCount: 1 },
]);

// GET Report Home page API function
exports.getReportHomePage = async (req, res) => {
  try {
    const { site_id } = req.body;

    // Validate that site_id is provided
    if (!site_id) {
      return res.status(400).json({ error: "site_id is required" });
    }

    // Query the Report model
    const report = await Report.find({ site_id: site_id, all_data_submit: true })
      .sort({ date: -1 }) // Sort by date in descending order
      .limit(1)
      .populate({
        path: "userId",
        select: "full_name _id",
      })
      .populate({
        path: "site_id",
        select: "site_name _id",
      });
    if (!report.length) {
      return res.status(404).json({ message: "No report found for the given site" });
    }

    const transformedReport = report[0].toObject();
    transformedReport.submitted_by = transformedReport.userId;
    delete transformedReport.userId;

    // Send the found report
    res.status(200).json(transformedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add Report API function
exports.getAllProductNamebySite = async (req, res) => {
  const { site_id } = req.body;

  try {
    // Step 1: Find the Site by site_id
    const site = await Site.findById(site_id);

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Step 2: Convert site.product array to ObjectId array
    const productIds = site.product.map((id) => new ObjectId(id));

    // Step 3: Query products with the converted ObjectId array
    const products = await Product.find({ _id: { $in: productIds } }, { _id: 1, product_name: 1 }).sort({ product_name: 1 });

    const totalCount = products.length; // Count total matching products

    res.json({
      totalCount: totalCount,
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

// comment by Atest 15/04/25

// exports.AddWorkingType = async (req, res) => {
//   const { site_id, product_id, working_type } = req.body;
//   const user_id = req.headers.userID; // Assuming the user ID is stored in the headers with the key 'userID'

//   try {
//     // Step 1: Create a new Product_Report
//     const newProductReport = new ProductReport({
//       working_status: working_type,
//       product_id: product_id,
//       site_id: site_id,
//       user_id: user_id,
//     });

//     const savedProductReport = await newProductReport.save();

//     // Step 2: Check if a Report already exists for the userId, site_id, and current date
//     // Step 2: Get the current date in the Asia/Kolkata timezone
//     const currentDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//     const dateObj = new Date();

//     // Extract date components from the Date object
//     const day = String(dateObj.getDate()).padStart(2, '0');
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//     const year = dateObj.getFullYear();

//     // Format the date as DD-MM-YYYY
//     const formattedDate = `${day}-${month}-${year}`;
//     // console.log(`Formatted Date: ${formattedDate}`);

//     let existingReport = await Report.findOne({ userId: user_id, site_id: site_id, date: formattedDate });

//     // Prepare the response data
//     const responseData = {
//       product_report: {
//         ...savedProductReport.toObject(),
//         product_report_id: savedProductReport._id,
//         _id: undefined, // Remove the _id key
//       },
//     };

//     if (existingReport) {
//       // Update existing Report with the new Product_Report's _id
//       existingReport.product_report_id.push(savedProductReport._id);
//       await existingReport.save();

//       responseData.message = "Working type added and existing report updated successfully";
//       responseData.report = existingReport;
//     } else {
//       // Step 3: Create a new Report and update it with the new Product_Report's _id
//       const newReport = new Report({
//         userId: user_id,
//         site_id: site_id,
//         product_report_id: [savedProductReport._id],
//         date: formattedDate,
//       });

//       const savedReport = await newReport.save();

//       responseData.message = "Working type added and new report created successfully";
//       responseData.report = savedReport;
//     }

//     // 2 सेकंड की देरी के साथ response भेजें
//     setTimeout(() => {
//       res.status(200).json(responseData);
//     }, 1000);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// edit by Atest

exports.AddWorkingType = async (req, res) => {
  const { site_id, product_id, working_type } = req.body;
  const user_id = req.headers.userID;

  try {
    const datetimeNow = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");
    const formattedDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

    // Step 1: Check if ProductReport already exists for same user/site/product/date
    let existingProductReport = await ProductReport.findOne({
      site_id,
      product_id,
      user_id,
      date: formattedDate,
    });

    let savedProductReport;

    if (existingProductReport) {
      // Update existing ProductReport
      existingProductReport.working_status = working_type;
      existingProductReport.datetime = datetimeNow;
      savedProductReport = await existingProductReport.save();
    } else {
      // Create a new ProductReport
      const newProductReport = new ProductReport({
        working_status: working_type,
        product_id,
        site_id,
        user_id,
        date: formattedDate,
        datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
      });

      savedProductReport = await newProductReport.save();
    }

    // Step 2: Check if Report already exists for userId, site_id, and date
    let existingReport = await Report.findOne({
      userId: user_id,
      site_id: site_id,
      date: formattedDate,
    });

    const responseData = {
      product_report: {
        ...savedProductReport.toObject(),
        product_report_id: savedProductReport._id,
        _id: undefined, // remove _id from product_report object
      },
    };

    if (existingReport) {
      // Avoid duplicate product_report_id
      const alreadyLinked = existingReport.product_report_id.some((id) => id.toString() === savedProductReport._id.toString());

      if (!alreadyLinked) {
        existingReport.product_report_id.push(savedProductReport._id);
      }

      await existingReport.save();

      responseData.message = existingProductReport ? "Working type updated in existing product report and report linked." : "Working type added and existing report updated successfully";
      responseData.report = existingReport;
    } else {
      // Create new Report and link product report
      const newReport = new Report({
        userId: user_id,
        site_id: site_id,
        product_report_id: [savedProductReport._id],
        date: formattedDate,
        datetime: datetimeNow,
      });

      const savedReport = await newReport.save();

      responseData.message = "Working type added and new report created successfully";
      responseData.report = savedReport;
    }

    // 2 सेकंड की देरी के साथ response भेजें
    setTimeout(() => {
      res.status(200).json(responseData);
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//comment by Atest 15/04/25

// exports.getnotworkingImage = async (req, res) => {
//   const { site_id } = req.body;
//   const user_id = req.headers.userID;
//   const working_status = "not_working";
//   const currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

//   try {
//     // Step 1: Find ProductReports matching the criteria
//     const productReports = await ProductReport.find({
//       site_id: site_id,
//       working_status: working_status,
//       date: currentDate,
//       user_id: user_id,
//     }).select("product_id"); // Select only the product_id field

//     // Step 2: Populate product_name from Product model
//     await Product.populate(productReports, { path: "product_id", select: "product_name" });

//     res.status(200).json({
//       message: "ProductReports with not_working status for today retrieved successfully",
//       productReports: productReports.map((report) => ({
//         product_id: report.product_id._id,
//         product_name: report.product_id.product_name,
//       })),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

// edit by Atest 15/04/25

exports.getnotworkingImage = async (req, res) => {
  const { site_id } = req.body;
  const working_status = "not_working";
  const user_id = req.headers.userID;
  const currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

  try {
    // Step 1: Find ProductReports matching the criteria
    const productReports = await ProductReport.find({
      site_id: site_id,
      working_status: working_status,
      date: currentDate,
      user_id: user_id,
    }).select("product_id"); // Select only the product_id field

    // Step 2: Populate product_name from Product model
    await Product.populate(productReports, { path: "product_id", select: "product_name" });

    res.status(200).json({
      message: "ProductReports with not_working status for today retrieved successfully",
      productReports: productReports.map((report) => ({
        product_id: report.product_id._id,
        product_name: report.product_id.product_name,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

// add one Report folder 15/04/25
// comment by Atest 19/04/25
exports.AddImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading images", error: err.message });
    }

    const { site_id, product_id, product_report_id, solution, problem_id, problem_covered } = req.body;

    try {
      const productReport = await getProductReportDetails(site_id, product_id, product_report_id);
      if (!productReport) {
        return res.status(404).json({ message: "Product report not found" });
      }

      // Update the product report with new images and problem_id
      if (req.files.image_0) productReport.image_0 = req.files.image_0[0].path;
      if (req.files.image_1) productReport.image_1 = req.files.image_1[0].path;
      if (req.files.image_2) productReport.image_2 = req.files.image_2[0].path;
      productReport.problem_id = problem_id;
      productReport.solution = solution;
      productReport.problem_covered = problem_covered;

      const updatedProductReport = await productReport.save();

      const reports = await Report.find({ product_report_id: updatedProductReport._id });

      // Extracting just the _id from each report
      const reportIds = reports.map((report) => report._id);

      res.status(200).json({
        message: "Images and problem ID updated successfully",
        product_report: {
          ...updatedProductReport.toObject(),
          main_report_id: reportIds.length > 0 ? reportIds[0] : null, // Assuming you want the first report id or null if none
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

//edit by Atest 19/04/25

// exports.AddImage = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: "Error uploading images", error: err.message });
//     }

//     const { site_id, product_id, solution, problem_id, problem_covered } = req.body;

//     try {
//       // Find all matching product reports
//       const productReports = await ProductReport.find({ site_id, product_id });

//       if (!productReports || productReports.length === 0) {
//         return res.status(404).json({ message: "No product reports found" });
//       }

//       const image_0 = req.files.image_0 ? req.files.image_0[0].path : null;
//       const image_1 = req.files.image_1 ? req.files.image_1[0].path : null;
//       const image_2 = req.files.image_2 ? req.files.image_2[0].path : null;

//       const updatedReports = await Promise.all(
//         productReports.map(async (report) => {
//           if (image_0) report.image_0 = image_0;
//           if (image_1) report.image_1 = image_1;
//           if (image_2) report.image_2 = image_2;
//           if (problem_id) report.problem_id = problem_id;
//           if (solution) report.solution = solution;
//           if (problem_covered) report.problem_covered = problem_covered;

//           return await report.save();
//         })
//       );

//       // Fetch all reports using the first updated product report's ID
//       const reports = await Report.find({ product_report_id: updatedReports[0]._id });
//       const reportIds = reports.map((report) => report._id);

//       res.status(200).json({
//         message: "Images and details updated for all matching product reports",
//         product_reports: updatedReports.map((r) => ({
//           ...r.toObject(),
//           main_report_id: reportIds.length > 0 ? reportIds[0] : null,
//         })),
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

exports.Addvalue = async (req, res) => {
  const { site_id, product_id, product_report_id, current_value } = req.body;

  try {
    // Step 1: Find the Product_Report document
    const productReport = await getProductReportDetails(site_id, product_id, product_report_id);

    if (!productReport) {
      return res.status(404).json({ message: "Product report not found" });
    }

    // Step 2: Fetch the Product details to validate current_value
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 3: Validate current_value against parameter_min and parameter_max
    const { parameter_min, parameter_max } = product;
    //     if (current_value < parameter_min || current_value > parameter_max) {
    //       return res.status(400).json({
    //         message: `Value ${current_value} is not within valid range [${parameter_min}, ${parameter_max}]`,
    //       });
    //     }

    // Step 4: Update the current_value
    productReport.current_value = current_value;

    // Step 5: Save the updated Product_Report
    const updatedProductReport = await productReport.save();

    // Step 6: Find all Reports that reference this Product_Report
    const reports = await Report.find({ product_report_id: updatedProductReport._id });

    // Extracting just the _id from each report
    const reportIds = reports.map((report) => report._id);

    // Respond with the updated product_report and main_report_id
    res.status(200).json({
      message: "Value updated successfully",
      product_report: {
        ...updatedProductReport.toObject(),
        main_report_id: reportIds.length > 0 ? reportIds[0] : null, // Assuming you want the first report id or null if none
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// comment by Atest 06/05/2025

// exports.dataSubmitupdate = async (req, res) => {
//   const { report_id } = req.body;
//   const user_id = req.headers.userID;

//   try {
//     // Step 1: Validate if report_id exists in the Report model
//     const report = await Report.findById(report_id);
//     const site = await Site.findById(report.site_id);

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }
//     if (!site) {
//       return res.status(404).json({ message: "Site not found" });
//     }

//     // Step 2: Update the all_data_submit field to true
//     report.all_data_submit = true;

//     // Step 3: Save the updated report
//     await report.save();

//     // Step 2: Update the all_data_submit field to true
//     site.report_submit = user_id;

//     // Step 3: Save the updated report
//     await site.save();

//     const siteId = report.site_id.toString();

//     const SVSiteAllomentusers = await SV_Site_Alloment.aggregate([
//       {
//         $match: {
//           site_id: { $in: [report.site_id] },
//           date: { $gte: moment().format("DD/MM/YYYY") }, // Use moment to format current date
//         },
//       },
//       {
//         $sort: { date: -1 }, // Sort by date in descending order
//       },
//       {
//         $group: {
//           _id: "$site_id",
//           latestRecord: { $first: "$$ROOT" }, // Get the latest record after sorting
//         },
//       },
//       {
//         $replaceRoot: { newRoot: "$latestRecord" }, // Replace root with the latest record
//       },
//     ]);

//     // Check if there are any records
//     if (SVSiteAllomentusers.length === 0) {
//       return res.status(404).json({ message: "No valid records found" });
//     }

//     // Extract the user_id from the latest record
//     const latestRecord = SVSiteAllomentusers[0];
//     const latestUserId = latestRecord.user_id;

//     // Step 3: Fetch users excluding the current user_id and match site_id
//     const usersWithSameSiteId = await UserModel.aggregate([
//       {
//         $match: {
//           _id: { $ne: new mongoose.Types.ObjectId(user_id) },
//           site_id: { $in: [siteId] }, // Match site_id array containing report.site_id
//         },
//       },
//     ]);

//     // Extract user IDs
//     const userIDs = usersWithSameSiteId.map((user) => user._id);
//     // Add the latest user ID to the received user array if it's not already included
//     let receivedUserArray = userIDs;
//     if (!receivedUserArray.includes(latestUserId)) {
//       receivedUserArray.push(latestUserId);
//     }

//     const type = "Daily_report_update";
//     const title = "Daily Report Submitted";
//     const message = "Supervisor has submitted the report to the Client. Please review.";
//     createNotification(user_id, receivedUserArray, title, message, type);

//     // Step 4: Respond with success message
//     res.status(200).json({ message: "Data submission updated successfully", report });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// edit by Atest 06/05/2025

// exports.dataSubmitupdate = async (req, res) => {
//   const { report_id } = req.body;
//   const user_id = req.headers.userID;

//   try {
//     // Step 1: Validate if report_id exists in the Report model
//     const report = await Report.findById(report_id);
//     const site = await Site.findById(report.site_id);

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }
//     if (!site) {
//       return res.status(404).json({ message: "Site not found" });
//     }

//     // Step 2: Update the all_data_submit field to true
//     report.all_data_submit = true;

//     // Step 3: Save the updated report
//     await report.save();

//     // Step 2: Update the all_data_submit field to true
//     site.report_submit = user_id;

//     // Step 3: Save the updated report
//     await site.save();

//     const siteId = report.site_id.toString();

//     const SVSiteAllomentusers = await SV_Site_Alloment.aggregate([
//       {
//         $match: {
//           site_id: { $in: [report.site_id] },
//           date: { $gte: moment().format("DD/MM/YYYY") }, // Use moment to format current date
//         },
//       },
//       {
//         $sort: { date: -1 }, // Sort by date in descending order
//       },
//       {
//         $group: {
//           _id: "$site_id",
//           latestRecord: { $first: "$$ROOT" }, // Get the latest record after sorting
//         },
//       },
//       {
//         $replaceRoot: { newRoot: "$latestRecord" }, // Replace root with the latest record
//       },
//     ]);

//     // Check if there are any records
//     if (SVSiteAllomentusers.length === 0) {
//       return res.status(404).json({ message: "No valid records found" });
//     }

//     // Extract the user_id from the latest record
//     const latestRecord = SVSiteAllomentusers[0];
//     const latestUserId = latestRecord.user_id;

//     // Step 3: Fetch users excluding the current user_id and match site_id
//     const usersWithSameSiteId = await UserModel.aggregate([
//       {
//         $match: {
//           _id: { $ne: new mongoose.Types.ObjectId(user_id) },
//           site_id: { $in: [siteId] }, // Match site_id array containing report.site_id
//         },
//       },
//     ]);

//     // Extract user IDs
//     const userIDs = usersWithSameSiteId.map((user) => user._id);
//     // Add the latest user ID to the received user array if it's not already included
//     let receivedUserArray = userIDs;
//     if (!receivedUserArray.includes(latestUserId)) {
//       receivedUserArray.push(latestUserId);
//     }

//     const type = "Daily_report_update";
//     const title = "Daily Report Submitted";
//     const message = "Supervisor has submitted the report to the Client. Please review.";
//     createNotification(user_id, receivedUserArray, title, message, type);

//     const Reportverifieds = await Reportverified(report_id, user_id, "Supervisor");
//     // Step 4: Respond with success message
//     res.status(200).json({ message: "Data submission updated successfully", report });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.dataSubmitupdate = async (req, res) => {
  const { report_id } = req.body;
  const user_id = req.headers.userID;

  try {
    // Validate report
    const report = await Report.findById(report_id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const site = await Site.findById(report.site_id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Prevent duplicate submission
    if (report.all_data_submit === true) {
      return res.status(200).json({ message: "Report already submitted", report });
    }

    // Update and save report
    report.all_data_submit = true;
    await report.save();

    // Update and save site
    site.report_submit = user_id;
    await site.save();

    const siteId = report.site_id.toString();

    // Get the latest supervisor assigned to the site
    const SVSiteAllomentusers = await SV_Site_Alloment.aggregate([
      {
        $match: {
          site_id: { $in: [report.site_id] },
          date: { $gte: moment().format("DD/MM/YYYY") },
        },
      },
      { $sort: { date: -1 } },
      { $group: { _id: "$site_id", latestRecord: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$latestRecord" } },
    ]);

    if (SVSiteAllomentusers.length === 0) {
      return res.status(404).json({ message: "No valid site allotment found" });
    }

    const latestUserId = SVSiteAllomentusers[0].user_id;

    // Get users from the same site (excluding current user)
    const usersWithSameSiteId = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(user_id) },
          site_id: { $in: [siteId] },
        },
      },
    ]);

    // Collect unique user IDs
    const uniqueRecipientIds = new Set(usersWithSameSiteId.map(user => user._id.toString()));
    uniqueRecipientIds.add(latestUserId.toString());

    // Remove the current user if it was added
    uniqueRecipientIds.delete(user_id);

    // Convert Set back to Array of ObjectId
    const finalRecipientIds = Array.from(uniqueRecipientIds).map(id => new mongoose.Types.ObjectId(id));

    // Send only one notification
    const type = "Daily_report_update";
    const title = "Daily Report Submitted";
    const message = "Supervisor has submitted the report to the Client. Please review.";

    await createNotification(user_id, finalRecipientIds, title, message, type);

    // Optionally update verification status
    await Reportverified(report_id, user_id, "Supervisor");

    res.status(200).json({ message: "Data submission updated successfully", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// async function Reportverified(report_id, userId, Type) {
//   const updatedReport = await Report.findOne({ _id: report_id });

//   if (!updatedReport) {
//     return res.status(404).json({ message: "Report not found" });
//   }

//   const verified_type = Type === "Admin" ? "verified_adminId" : "verified_userId";

//   updatedReport.verified_status = true;
//   updatedReport[verified_type] = userId; // Corrected line
//   updatedReport.verified_user = Type;
//   updatedReport.mail_send = true;

//   const savedReport = await updatedReport.save();

//   const sitedata = await Site.findOne({ _id: updatedReport.site_id });
//   const clientdata = await ClientModel.findOne({ _id: sitedata.client_id });

//   const ReportSends = await ReportSend(report_id, clientdata.clientEmail);

//   return res.status(200).json({ updatedReport: savedReport, message: "Report Verified successfully" });
// };

async function Reportverified(report_id, userId, Type) {
  const updatedReport = await Report.findOne({ _id: report_id });

  if (!updatedReport) {
    throw new Error("Report not found");
  }

  const verified_type = Type === "Admin" ? "verified_adminId" : "verified_userId";

  updatedReport.verified_status = true;
  updatedReport[verified_type] = userId;
  updatedReport.verified_user = Type;
  updatedReport.mail_send = true;

  const savedReport = await updatedReport.save();

  const sitedata = await Site.findOne({ _id: updatedReport.site_id });
  const clientdata = await ClientModel.findOne({ _id: sitedata.client_id });

  // const ReportSends = await ReportSend(report_id, clientdata.clientEmail);

  return { updatedReport: savedReport, message: "Report Verified successfully" };
}


async function ReportSend(ReportId, email) {
  let sendmail;

    const report = await Report.findByIdAndUpdate(ReportId, { mail_send: true }, { new: true });
    if (!report) {
      return { message: "Report not found", status: false };
    }
    const recipients = [email, "service@evergreenion.com"];
    const sitesdata = await ReportMailSend(ReportId);
    sendmail = SendMail({
      recipientEmail: recipients,
      subject: "Daily Product Report Update",
      html: ReportTemplate(sitesdata),
    });
  

  return { message: sendmail, status: true };
}

async function ReportMailSend(ReportId) {
  const sitesdata = await Report.findById(ReportId)
    .populate({
      path: "site_id",
      populate: [
        { path: "product._id", select: "product_quantity used_quantity" }
      ]
    })
    .populate({
      path: "product_report_id",
      populate: [
        { path: "user_id", select: "full_name" },
        { path: "problem_id", select: "problem" },
        { path: "product_id", select: "product_name parameter_min parameter_max" },
      ],
    });

  const siteProducts = sitesdata.site_id?.product || [];

  const updatedProducts = sitesdata.product_report_id.map((product) => {
    const matchedProduct = siteProducts.find(
      (siteProduct) =>
        siteProduct._id && product.product_id &&
        siteProduct._id._id.toString() === product.product_id._id.toString()
    );

    const updatedImages = [product.image_0, product.image_1, product.image_2].map((image) => baseURL + image);

    return {
      ...product.toObject(),
      images: updatedImages,
      product_name: product.product_id?.product_name || "",
      parameter_min: product.product_id?.parameter_min || "",
      parameter_max: product.product_id?.parameter_max || "",
      problem_name: product.problem_id?.problem || "",
      user_name: product.user_id?.full_name || "Not Verified",
      product_quantity: matchedProduct?.product_quantity || 0,
      used_quantity: matchedProduct?.used_quantity || 0,
    };
  });

  const notWorkingProducts = updatedProducts
    .filter((product) => product.working_status === "not_working")
    .map(({ image_0, image_1, image_2, ...rest }) => rest);

  const workingProducts = updatedProducts.filter((product) => product.working_status === "working_ok");

  const sitedata = {
    ...sitesdata.toObject(),
    notWorkingProducts,
    workingProducts,
  };

  delete sitedata.product_report_id;
  delete sitedata.site_id.product;

  return sitedata;
}

// end

// Edit Report API function
exports.EditgetWorkingType = async (req, res) => {
  try {
    const { site_id } = req.body;

    // Validate that site_id is provided
    if (!site_id) {
      return res.status(400).json({ error: "site_id is required" });
    }

    // Query the Report model
    const report = await Report.find({ site_id })
      .sort({ _id: -1 }) // Sort by date in descending order
      .limit(1)
      .populate({
        path: "userId",
        select: "full_name _id",
      })
      .populate({
        path: "product_report_id",
        select: "working_status _id",
        populate: {
          path: "product_id",
          select: "product_name",
        },
      }); // Get only the most recent record

    if (!report.length) {
      return res.status(404).json({ message: "No report found for the given site_id" });
    }

    // Send the found report
    res.status(200).json(report[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.EditWorkingType = async (req, res) => {
  try {
    const { site_id, product_id, product_report_id, working_type, report_id } = req.body;
    const user_id = req.headers.userID;
    // Validate input parameters
    if (!site_id || !product_id || !product_report_id || !working_type || !report_id) {
      return res.status(400).json({ error: "All parameters are required" });
    }

    const report = await getProductReportDetails(site_id, product_id, product_report_id);

    // Check if the report exists
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update the working_type
    report.working_status = working_type;

    // Save the updated report
    await report.save();

    const main_report = await Report.findById(report_id);

    if (!main_report) {
      return res.status(404).json({ message: "Report not found" });
    }
    const currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

    // Step 2: Update the all_data_submit field to true
    main_report.userId = user_id;
    main_report.date = currentDate;

    // Step 3: Save the updated report
    await main_report.save();

    // Send the updated report as response
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//comment by Atest 02/05/25

// exports.EditgetImages = async (req, res) => {
//   try {
//     const { site_id } = req.body;

//     // Validate that site_id is provided
//     if (!site_id) {
//       return res.status(400).json({ error: "site_id is required" });
//     }

//     // Query the Report model
//     const report = await Report.find({ site_id })
//       .sort({ date: -1 }) // Sort by date in descending order
//       .limit(1)
//       .populate({
//         path: "userId",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "product_report_id",
//         match: { working_status: "not_working" },
//         select: "image_0 image_1 image_2 working_status problem_id solution problem_covered _id",
//         populate: [
//           {
//             path: "product_id",
//             select: "product_name",
//           },
//           {
//             path: "problem_id",
//             select: "problem _id",
//           },
//         ],
//       }); // Get only the most recent record

//     if (!report.length) {
//       return res.status(404).json({ message: "No report found for the given site_id" });
//     }

//     // Transform the report to add BASE_URL to image paths
//     const transformedReport = report[0].toObject();
//     transformedReport.product_report_id = transformedReport.product_report_id.map((product) => {
//       if (product.image_0) {
//         product.image_0 = BASE_URL + product.image_0;
//       }
//       if (product.image_1) {
//         product.image_1 = BASE_URL + product.image_1;
//       }
//       if (product.image_2) {
//         product.image_2 = BASE_URL + product.image_2;
//       }
//       return product;
//     });

//     // Send the transformed report
//     res.status(200).json(transformedReport);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

//edit by Atest 02/05/25

exports.EditgetImages = async (req, res) => {
  try {
    const { site_id } = req.body;

    if (!site_id) {
      return res.status(400).json({ error: "site_id is required" });
    }

    const reports = await Report.find({ site_id })
      .populate({
        path: "userId",
        select: "full_name _id",
      })
      .populate({
        path: "product_report_id",
        match: { working_status: "not_working" },
        select: "image_0 image_1 image_2 working_status problem_id solution problem_covered _id product_id",
        populate: [
          {
            path: "product_id",
            select: "product_name",
          },
          {
            path: "problem_id",
            select: "problem _id",
          },
        ],
      });

    if (!reports.length) {
      return res.status(404).json({ message: "No report found for the given site_id" });
    }

    // Convert date string "DD-MM-YYYY" to Date object
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-");
      return new Date(`${year}-${month}-${day}`);
    };

    // Sort by parsed `date` field in descending order
    reports.sort((a, b) => parseDate(b.date) - parseDate(a.date));

    const latestReport = reports[0].toObject();

    // Append BASE_URL to images
    latestReport.product_report_id = latestReport.product_report_id.map((product) => {
      if (product.image_0) product.image_0 = BASE_URL + product.image_0;
      if (product.image_1) product.image_1 = BASE_URL + product.image_1;
      if (product.image_2) product.image_2 = BASE_URL + product.image_2;
      return product;
    });

    res.status(200).json(latestReport);
  } catch (error) {
    console.error("Error in EditgetImages:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.EditImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading images", error: err.message });
    }
    const { site_id, product_id, product_report_id, solution, problem_id, problem_covered } = req.body;
    try {
      const productReport = await getProductReportDetails(site_id, product_id, product_report_id);
      if (!productReport) {
        return res.status(404).json({ message: "Product report not found" });
      }

      // Update the product report with new images and problem_id
      if (req.files.image_0) {
        var filePath = productReport.image_0;
        fs.promises.unlink(filePath);
        productReport.image_0 = req.files.image_0[0].path;
      }
      if (req.files.image_1) {
        var filePath = productReport.image_1;
        fs.promises.unlink(filePath);
        productReport.image_1 = req.files.image_1[0].path;
      }
      if (req.files.image_2) {
        var filePath = productReport.image_2;
        fs.promises.unlink(filePath);
        productReport.image_2 = req.files.image_2[0].path;
      }
      productReport.problem_id = problem_id;
      productReport.solution = solution;
      productReport.problem_covered = problem_covered;

      const updatedProductReport = await productReport.save();

      res.status(200).json({
        message: "Images and problem ID updated successfully",
        product_report: updatedProductReport,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

// edit by Atest 19/04/25

// exports.EditImages = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: "Error uploading images", error: err.message });
//     }

//     const { site_id, product_id, solution, problem_id, problem_covered } = req.body;

//     try {
//       const productReports = await ProductReport.find({ site_id, product_id });

//       if (!productReports || productReports.length === 0) {
//         return res.status(404).json({ message: "No product reports found" });
//       }

//       const image_0 = req.files.image_0 ? req.files.image_0[0].path : null;
//       const image_1 = req.files.image_1 ? req.files.image_1[0].path : null;
//       const image_2 = req.files.image_2 ? req.files.image_2[0].path : null;

//       const updatedReports = await Promise.all(
//         productReports.map(async (report) => {
//           // Remove old images if new ones are uploaded
//           if (image_0 && report.image_0) {
//             await fs.promises.unlink(report.image_0).catch(() => {});
//             report.image_0 = image_0;
//           }
//           if (image_1 && report.image_1) {
//             await fs.promises.unlink(report.image_1).catch(() => {});
//             report.image_1 = image_1;
//           }
//           if (image_2 && report.image_2) {
//             await fs.promises.unlink(report.image_2).catch(() => {});
//             report.image_2 = image_2;
//           }

//           if (problem_id) report.problem_id = problem_id;
//           if (solution) report.solution = solution;
//           if (problem_covered) report.problem_covered = problem_covered;

//           return await report.save();
//         })
//       );

//       res.status(200).json({
//         message: "Images and problem details updated successfully for all matching product reports",
//         updated_reports: updatedReports,
//       });
//     } catch (error) {
//       console.error("EditImages error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

// exports.getEditNotEmptyVaule = async (req, res) => {
//   const { site_id } = req.body; // Assuming site_id is passed in the request body

//   try {
//     // Step 1: Find the Site by site_id
//     const site = await Site.findById(site_id);

//     if (!site) {
//       return res.status(404).json({ message: "Site not found" });
//     }

//     // Step 2: Fetch products from Product model with non-empty parameter_min and parameter_max
//     const products = await Product.find({
//       _id: { $in: site.product }, // Assuming site.products contains IDs of products associated with the site
//       parameter_min: { $nin: ["", 0] },
//       parameter_max: { $nin: ["", 0] },
//     }).select("_id product_name parameter_min parameter_max unit");

//     // Step 3: For each product, find matching ProductReport
//     const productReports = await Promise.all(
//       products.map(async (product) => {
//         const report = await ProductReport.findOne({
//           site_id: site_id,
//           product_id: product._id,
//         }).sort({ datetime: -1 }).select("_id current_value datetime");

//         if (report) {
//           return {
//             ...product.toObject(),
//             current_value: report.current_value,
//             product_report_id: report._id,
//             datetime:report.datetime,
//           };
//         } else {
//           return product.toObject();
//         }
//       })
//     );

//     res.status(200).json({
//       message: "Products with non-empty parameter_min and parameter_max retrieved successfully",
//       products: productReports,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.getEditNotEmptyVaule = async (req, res) => {
  const { site_id } = req.body;

  try {
    const site = await Site.findById(site_id);
    if (!site) return res.status(404).json({ message: "Site not found" });

    const products = await Product.find({
      _id: { $in: site.product },
      parameter_min: { $nin: ["", 0] },
      parameter_max: { $nin: ["", 0] },
    }).select("_id product_name parameter_min parameter_max unit");

    const productReports = await Promise.all(
      products.map(async (product) => {
        const allReports = await ProductReport.find({
          site_id,
          product_id: product._id,
        }).select("_id current_value datetime");

        if (allReports.length > 0) {
          // Convert string to date and sort descending
          allReports.sort((a, b) => {
            const dateA = moment(a.datetime, "DD-MM-YYYY HH:mm:ss").toDate();
            const dateB = moment(b.datetime, "DD-MM-YYYY HH:mm:ss").toDate();
            return dateB - dateA;
          });

          const latest = allReports[0];
          return {
            ...product.toObject(),
            current_value: latest.current_value,
            product_report_id: latest._id,
            datetime: latest.datetime,
          };
        } else {
          return product.toObject();
        }
      })
    );

    res.status(200).json({
      message: "Products with non-empty parameter_min and parameter_max retrieved successfully",
      products: productReports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.Editvalue = async (req, res) => {
  const { site_id, product_id, product_report_id, current_value } = req.body;

  try {
    // Step 1: Find the Product_Report document
    const productReport = await getProductReportDetails(site_id, product_id, product_report_id);

    if (!productReport) {
      return res.status(404).json({ message: "Product report not found" });
    }

    // Step 2: Fetch the Product details to validate current_value
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 3: Validate current_value against parameter_min and parameter_max
    const { parameter_min, parameter_max } = product;
    //     if (current_value < parameter_min || current_value > parameter_max) {
    //       return res.status(400).json({
    //         message: `Value ${current_value} is not within valid range [${parameter_min}, ${parameter_max}]`,
    //       });
    //     }

    // Step 4: Update the current_value
    productReport.current_value = current_value;

    // Step 5: Save the updated Product_Report
    const updatedProductReport = await productReport.save();

    // Step 6: Find all Reports that reference this Product_Report
    const reports = await Report.find({ product_report_id: updatedProductReport._id });

    // Extracting just the _id from each report
    const reportIds = reports.map((report) => report._id);

    // Respond with the updated product_report and main_report_id
    res.status(200).json({
      message: "Value updated successfully",
      product_report: {
        ...updatedProductReport.toObject(),
        main_report_id: reportIds.length > 0 ? reportIds[0] : null, // Assuming you want the first report id or null if none
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const storageSelfie = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/Selfie");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = generateRandomTimestamp();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const SelfieUpload = multer({ storage: storageSelfie }).fields([{ name: "selfie", maxCount: 1 }]);

exports.AddSelfie = async (req, res) => {
  SelfieUpload(req, res, async (err) => {
    console.log("AddSelfie called", req.body, req.files);
    const { site_id } = req.body;
    const user_id = req.headers.userID; // Assuming the user ID is stored in the headers with the key 'userID'
    try {
      // Step 1: Create a new Selfie
      const newSv_Selfie = new SV_Selfie({
        pic: req.files.selfie[0].path,
        site_id: site_id,
        userId: user_id,
        datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
      });
      const savedSelfie = await newSv_Selfie.save();

      res.status(200).json({
        message: "Selfie Images updated successfully",
        Selfie_data: savedSelfie,
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", status: false });
    }
  });
};
