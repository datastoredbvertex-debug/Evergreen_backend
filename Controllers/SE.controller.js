const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const UserModel = require("../Models/User.model");
const SE_Attendance = require("../Models/SE.model");
const Site = require("../Models/Site.model");
const Report = require("../Models/Report.model");
const Product = require("../Models/Product.model");
const ProductReport = require("../Models/Product_Report.model");
const multer = require("multer");
var multiparty = require("multiparty");
const Attendance_Uplaod_Dir = "./uploads/Attendance/SE";
const path = require("path");
const fs = require("fs");
const geolib = require("geolib");
const BASE_URL = process.env.BASE_URL;
const moment = require("moment-timezone");
const { createNotification } = require("./NotificationControllers");
const SV_Site_Alloment = require("../Models/Site_Allotment");

exports.SiteGetAllotmentUser = async (req, res) => {
  try {
    // Fetch user ID from the request headers
    const userId = req.headers.userID; // Assuming the user ID is stored in the headers with the key 'userid'
    // Update the user with the site_ids array
    const userData = await UserModel.findById(userId).populate({
      path: "site_id",
    });

    if (userData.site_id[0]) {
      // Fetching report_submit user data
      const reportSubmitUserId = userData.site_id[0].report_submit;
      const reportSubmitUserData = await UserModel.findById(reportSubmitUserId).select("_id full_name pic");
      // Merging report_submit user data into userData
      userData.site_id[0].report_submit = reportSubmitUserData;
    } else {
      userData.site_id[0].report_submit = null;
    }

    return res.status(200).json({ userData: userData, message: "Site get successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// coment by Atest 02/05/25

// exports.SE_Attendance = async (req, res) => {
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
//       return res.status(400).json({
//         message: "Site ID is required.",
//         status: false,
//       });
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

//       const userSiteIds = user.site_id.map((site) => site.toString());
//       if (!userSiteIds.includes(fields.site_id[0].toString())) {
//         return res.status(404).json({
//           message: "Not allotted this site.",
//           status: false,
//         });
//       }

//       // Count existing 'in' and 'out' entries for the date
//       const inEntriesCount = await SE_Attendance.countDocuments({ userId, date: fields.date[0], site_id: fields.site_id[0], entry: "in" });
//       const outEntriesCount = await SE_Attendance.countDocuments({ userId, date: fields.date[0], site_id: fields.site_id[0], entry: "out" });

//       if (fields.entry[0] === "in" && inEntriesCount >= 2) {
//         return res.status(404).json({
//           message: "You cannot create more than two 'in' entries for the same date.",
//           status: false,
//         });
//       }

//       if (fields.entry[0] === "out" && outEntriesCount >= 2) {
//         return res.status(404).json({
//           message: "You cannot create more than two 'out' entries for the same date.",
//           status: false,
//         });
//       }

//       const lastAttendance = await SE_Attendance.findOne({ userId, date: fields.date[0], site_id: fields.site_id[0] });

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
//         attendance = await SE_Attendance.create({
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

exports.SE_Attendance = async (req, res) => {
  let form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
  const userId = req.headers.userID;
  const timestamp = new Date();
  const formattedDate = formatDate(timestamp);
  const dateString = formattedDate.toLocaleString();
  const date = new Date(dateString);
  const timestampInSeconds = Math.floor(date.getTime() / 1000);
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

    try {
      const site = await Site.findById(fields.site_id[0]);
      if (!site) {
        return res.status(404).json({ message: "Site not found.", status: false });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found.", status: false });
      }

      const userSiteIds = user.site_id.map((site) => site.toString());
      if (!userSiteIds.includes(fields.site_id[0].toString())) {
        return res.status(403).json({ message: "Not allotted this site.", status: false });
      }

      const existingAttendance = await SE_Attendance.findOne({
        userId,
        date: fields.date[0],
        site_id: fields.site_id[0],
      });

      // If no attendance yet, allow only "in" entry
      if (!existingAttendance) {
        if (fields.entry[0] !== "in") {
          return res.status(400).json({
            message: "Your first attendance must be an 'in' entry.",
            status: false,
          });
        }

        const newAttendance = await SE_Attendance.create({
          date: fields.date[0],
          userId,
          site_id: fields.site_id[0],
          timeIn: fields.time[0],
          picIn: newFilePaths,
          entry: "in",
          datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
        });

        return res.status(201).json({
          _id: newAttendance._id,
          date: newAttendance.date,
          userId: newAttendance.userId,
          site_id: newAttendance.site_id,
          timeIn: newAttendance.timeIn,
          timeOut: newAttendance.timeOut,
          picIn: newAttendance.picIn,
          picOut: newAttendance.picOut,
          entry: newAttendance.entry,
          status: true,
        });
      } else {
        // Handle update
        if (fields.entry[0] === "in") {
          if (existingAttendance.timeIn) {
            return res.status(400).json({
              message: "You have already marked 'in' for this site today.",
              status: false,
            });
          }

          existingAttendance.timeIn = fields.time[0];
          existingAttendance.picIn = newFilePaths;
          existingAttendance.entry = "in";
        } else if (fields.entry[0] === "out") {
          if (!existingAttendance.timeIn) {
            return res.status(400).json({
              message: "You must mark 'in' before marking 'out'.",
              status: false,
            });
          }

          if (existingAttendance.timeOut) {
            return res.status(400).json({
              message: "You have already marked 'out' for this site today.",
              status: false,
            });
          }

          existingAttendance.timeOut = fields.time[0];
          existingAttendance.picOut = newFilePaths;
          existingAttendance.entry = "out";
        } else {
          return res.status(400).json({ message: "Invalid entry type.", status: false });
        }

        const updatedAttendance = await existingAttendance.save();

        return res.status(200).json({
          _id: updatedAttendance._id,
          date: updatedAttendance.date,
          userId: updatedAttendance.userId,
          site_id: updatedAttendance.site_id,
          timeIn: updatedAttendance.timeIn,
          timeOut: updatedAttendance.timeOut,
          picIn: updatedAttendance.picIn,
          picOut: updatedAttendance.picOut,
          entry: updatedAttendance.entry,
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
      match: { show_SE: "Yes" }, // Filter during population
    });

    if (!userData) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Filter and update the image URLs in the product array
    const updatedProducts = userData.product
      .filter((product) => product._id && product._id.show_SE === "Yes")
      .map((product) => {
        return {
          ...product._doc, // Spread the existing product data
          image: `${BASE_URL}${product._id.image}`, // Prepend BASE_URL to the image path
        };
      });

    // Create a copy of userData and replace product with updatedProducts
    const updatedUserData = {
      ...userData._doc,
      product: updatedProducts,
    };

    return res.status(200).json({ Product: updatedUserData, message: "Product get successful" });
  } catch (error) {
    console.error(error);
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

// comment by Atest 23/04/25

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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./Uploads/Report");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit per file
//     files: 3, // Max 3 files per request
//   },
//   fileFilter: (req, file, cb) => {
//     console.log("File MIME type:", file.mimetype); // Log MIME type for debugging
//     const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, and GIF are allowed.`));
//     }
//   },
// }).fields([
//   { name: "image_0", maxCount: 1 },
//   { name: "image_1", maxCount: 1 },
//   { name: "image_2", maxCount: 1 },
// ]);

console.log("upload", upload);
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
      .sort({ _id: -1 }) // Sort by date in descending order
      .limit(1)
      .populate({
        path: "userId",
        select: "full_name role _id",
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
    const products = await Product.find({ _id: { $in: productIds }, show_SE: "Yes" }, { _id: 1, product_name: 1 }).sort({ product_name: 1 });

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

//comment by Atest 15/04/2025

// exports.AddWorkingType = async (req, res) => {
//   const { site_id, product_id, working_type } = req.body;
//   const user_id = req.headers.userID; // Assuming the user ID is stored in the headers with the key 'userID'
//   const currDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
//   try {
//     // Step 1: Create a new Product_Report
//     const newProductReport = new ProductReport({
//       working_status: working_type,
//       product_id: product_id,
//       date:currDate,
//       datetime:moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
//       site_id: site_id,
//       user_id: user_id,
//     });

//     const savedProductReport = await newProductReport.save();

//     // Step 2: Get the current date in the Asia/Kolkata timezone
//     const currentDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
//     const dateObj = new Date();

//     // Extract date components from the Date object
//     const day = String(dateObj.getDate()).padStart(2, '0');
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is zero-based
//     const year = dateObj.getFullYear();

//     // Format the date as DD-MM-YYYY
//     const formattedDate = `${day}-${month}-${year}`;
//     console.log(`Formatted Date: ${formattedDate}`);

//     let existingReport = await Report.findOne({ userId: user_id, site_id: site_id, date: currDate });

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
//       existingReport.datetime = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");
//       await existingReport.save();

//       responseData.message = "Working type added and existing report updated successfully";
//       responseData.report = existingReport;
//     } else {
//       // Step 3: Create a new Report and update it with the new Product_Report's _id
//       const newReport = new Report({
//         userId: user_id,
//         site_id: site_id,
//         product_report_id: [savedProductReport._id],
//         datetime:moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
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
  const currDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

  try {
    const datetimeNow = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");

    // Step 1: Check if ProductReport already exists for same user/site/product/date
    let existingProductReport = await ProductReport.findOne({
      site_id,
      product_id,
      user_id,
      date: currDate,
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
        date: currDate,
        datetime: datetimeNow,
        site_id,
        user_id,
      });
      savedProductReport = await newProductReport.save();
    }

    // Format the current date
    const formattedDate = currDate;

    // Step 2: Check for existing Report
    let existingReport = await Report.findOne({ userId: user_id, site_id, date: currDate });

    const responseData = {
      product_report: {
        ...savedProductReport.toObject(),
        product_report_id: savedProductReport._id,
        _id: undefined,
      },
    };

    if (existingReport) {
      // Avoid duplicate product_report_id
      const alreadyLinked = existingReport.product_report_id.some((id) => id.toString() === savedProductReport._id.toString());

      if (!alreadyLinked) {
        existingReport.product_report_id.push(savedProductReport._id);
      }

      existingReport.datetime = datetimeNow;
      await existingReport.save();

      responseData.message = existingProductReport ? "Working type updated in existing product report and report linked." : "Working type added and existing report updated successfully";
      responseData.report = existingReport;
    } else {
      // Create new Report
      const newReport = new Report({
        userId: user_id,
        site_id,
        product_report_id: [savedProductReport._id],
        datetime: datetimeNow,
        date: formattedDate,
      });

      const savedReport = await newReport.save();

      responseData.message = "Working type added and new report created successfully";
      responseData.report = savedReport;
    }

    // Add slight delay (1 second)
    setTimeout(() => {
      res.status(200).json(responseData);
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// comment by Atest 21/04/25

// exports.getnotworkingImage = async (req, res) => {
//   const { site_id } = req.body;
//   const working_status = "not_working";
//   const user_id = req.headers.userID;
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
//     await Product.populate(productReports, { path: "product_id", select: "product_name show_SE", match: { show_SE: "Yes" } });

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

// edit by Atest 21/04/25

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

    // Step 2: Populate product_name from Product model and apply match filter
    await Product.populate(productReports, {
      path: "product_id",
      select: "product_name show_SE", // Select necessary fields
      match: { show_SE: "Yes" }, // Apply filter for show_SE
    });

    // Filter out reports that didn't have a valid populated product_id
    const filteredReports = productReports.filter((report) => report.product_id !== null);

    // Map only the valid reports with product_id
    const responseData = filteredReports.map((report) => ({
      product_id: report.product_id._id,
      product_name: report.product_id.product_name,
    }));

    res.status(200).json({
      message: "ProductReports with not_working status for today retrieved successfully",
      productReports: responseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

// comment by 23/04/25

exports.AddImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading images", error: err.message });
    }

    const { site_id, product_id, product_report_id, problem_id } = req.body;
    console.log("req", req.body);
    // console.log(site_id);
    // console.log(product_id);
    // console.log(product_report_id);
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
      console.log("image1", req.files.image_0);
      console.log("image2", req.files.image_1);
      console.log("image3", req.files.image_2);
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

// edit by 23/04/25

// exports.AddImage = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       console.error("Multer Error:", err);
//       return res.status(400).json({ message: `Multer error: ${err.message}` });
//     } else if (err) {
//       console.error("File Filter Error:", err);
//       return res.status(400).json({ message: `File error: ${err.message}` });
//     }

//     console.log("Request Body:", req.body);
//     console.log("Request Files:", JSON.stringify(req.files, null, 2));

//     const { site_id, product_id, product_report_id, problem_id } = req.body;

//     if (!site_id || !product_id || !product_report_id || !problem_id) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const images = {
//       image_0: req.files["image_0"] ? req.files["image_0"][0].path : null,
//       image_1: req.files["image_1"] ? req.files["image_1"][0].path : null,
//       image_2: req.files["image_2"] ? req.files["image_2"][0].path : null,
//     };

//     if (!images.image_0 && !images.image_1 && !images.image_2) {
//       return res.status(400).json({ message: "At least one image is required" });
//     }

//     try {
//       const productReport = await getProductReportDetails(site_id, product_id, product_report_id);
//       if (!productReport) {
//         return res.status(404).json({ message: "Product report not found" });
//       }

//       if (images.image_0) productReport.image_0 = images.image_0;
//       if (images.image_1) productReport.image_1 = images.image_1;
//       if (images.image_2) productReport.image_2 = images.image_2;
//       productReport.problem_id = problem_id;

//       const updatedProductReport = await productReport.save();

//       res.status(200).json({
//         message: "Images and problem ID updated successfully",
//         product_report: updatedProductReport,
//       });
//     } catch (error) {
//       console.error("Database Error:", error);
//       res.status(500).json({ message: "Internal server error: " + error.message });
//     }
//   });
// };

// exports.AddImage = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: "Error uploading images", error: err.message });
//     }

//     console.log('Files received:', req.files);

//     const { site_id, product_id, product_report_id, problem_id } = req.body;

//     try {
//       const productReport = await getProductReportDetails(site_id, product_id, product_report_id);
//       if (!productReport) {
//         return res.status(404).json({ message: "Product report not found" });
//       }

//       if (req.files?.image_0) productReport.image_0 = req.files.image_0[0].path;
//       if (req.files?.image_1) productReport.image_1 = req.files.image_1[0].path;
//       if (req.files?.image_2) productReport.image_2 = req.files.image_2[0].path;

//       if (problem_id) productReport.problem_id = problem_id;

//       const updatedProductReport = await productReport.save();

//       res.status(200).json({
//         message: "Images and problem ID updated successfully",
//         product_report: updatedProductReport,
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

exports.dataSubmitupdate = async (req, res) => {
  const { report_id } = req.body;
  const user_id = req.headers.userID;

  try {
    // Step 1: Validate if report_id exists in the Report model
    const report = await Report.findById(report_id);
    const site = await Site.findById(report.site_id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Step 2: Update the all_data_submit field to true
    report.all_data_submit = true;

    // Step 3: Save the updated report
    await report.save();

    // Step 2: Update the all_data_submit field to true
    site.report_submit = user_id;

    // Step 3: Save the updated report
    await site.save();

    const siteId = report.site_id.toString();

    const SVSiteAllomentusers = await SV_Site_Alloment.aggregate([
      {
        $match: {
          site_id: { $in: [report.site_id] },
          date: { $gte: moment().format("DD/MM/YYYY") }, // Use moment to format current date
        },
      },
      {
        $sort: { date: -1 }, // Sort by date in descending order
      },
      {
        $group: {
          _id: "$site_id",
          latestRecord: { $first: "$$ROOT" }, // Get the latest record after sorting
        },
      },
      {
        $replaceRoot: { newRoot: "$latestRecord" }, // Replace root with the latest record
      },
    ]);

    // Check if there are any records
    if (SVSiteAllomentusers.length === 0) {
      return res.status(404).json({ message: "No valid records found" });
    }

    // Extract the user_id from the latest record
    const latestRecord = SVSiteAllomentusers[0];
    const latestUserId = latestRecord.user_id;

    // Step 3: Fetch users excluding the current user_id and match site_id
    const usersWithSameSiteId = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(user_id) },
          site_id: { $in: [siteId] }, // Match site_id array containing report.site_id
        },
      },
    ]);
    console.log("site", siteId);

    // Extract user IDs
    const userIDs = usersWithSameSiteId.map((user) => user._id);
    // Add the latest user ID to the received user array if it's not already included
    let receivedUserArray = userIDs;
    if (!receivedUserArray.includes(latestUserId)) {
      receivedUserArray.push(latestUserId);
    }

    const type = "Daily_report_update";
    const title = "Daily Report Submitted";
    const message = "Service Engineer has submitted the report. Please review.";
    console.log("send");
    createNotification(user_id, receivedUserArray, title, message, type);

    res.status(200).json({ message: "Data submission updated successfully", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    report.user_id = user_id;
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

//comment by Atest

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
//         select: "product_id image_0 image_1 image_2 problem_id solution problem_covered _id",
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

//edit by Atest

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
//         select: "product_id image_0 image_1 image_2 working_status problem_id solution problem_covered _id",
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

exports.EditgetImages = async (req, res) => {
  try {
    const { site_id } = req.body;

    if (!site_id) {
      return res.status(400).json({ error: "site_id is required" });
    }

    // Fetch all reports for site_id
    const reports = await Report.find({ site_id })
      .populate({
        path: "userId",
        select: "full_name _id",
      })
      .populate({
        path: "product_report_id",
        match: { working_status: "not_working" },
        select: "product_id image_0 image_1 image_2 working_status problem_id solution problem_covered _id",
        populate: [
          { path: "product_id", select: "product_name" },
          { path: "problem_id", select: "problem _id" },
        ],
      });

    if (!reports.length) {
      return res.status(404).json({ message: "No report found for the given site_id" });
    }

    // Sort reports by parsed datetime
    const sortedReports = reports.sort((a, b) => {
      const dateA = moment(a.datetime, "DD-MM-YYYY HH:mm:ss").toDate();
      const dateB = moment(b.datetime, "DD-MM-YYYY HH:mm:ss").toDate();
      return dateB - dateA; // descending
    });

    const latestReport = sortedReports[0].toObject();

    // Add BASE_URL to image paths
    latestReport.product_report_id = latestReport.product_report_id.map((product) => {
      if (product.image_0) product.image_0 = BASE_URL + product.image_0;
      if (product.image_1) product.image_1 = BASE_URL + product.image_1;
      if (product.image_2) product.image_2 = BASE_URL + product.image_2;
      return product;
    });

    res.status(200).json(latestReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//comment by Atest 19/04/25

exports.EditImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading images", error: err.message });
    }

    const { site_id, product_id, product_report_id, problem_id } = req.body;

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

//comment by Atest 10-01-25

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
//       match: { working_status: "not_working" },
//       parameter_min: { $ne: "" }, // Filter out products where parameter_min is not empty or null
//       parameter_max: { $ne: "" }, // Filter out products where parameter_max is not empty or null
//     }).select("_id product_name parameter_min parameter_max unit");

//     // Step 3: For each product, find matching ProductReport
//     const productReports = await Promise.all(
//       products.map(async (product) => {
//         const report = await ProductReport.findOne({
//           site_id: site_id,
//           product_id: product._id,
//         }).select("_id current_value");

//         if (report) {
//           return {
//             ...product.toObject(),
//             current_value: report.current_value,
//             product_report_id: report._id,
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

// edit by Atest 19/04/25

// exports.EditImages = (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(500).json({ message: "Error uploading images", error: err.message });
//     }

//     const { site_id, product_id, problem_id } = req.body;

//     try {
//       // Fetch all matching product reports
//       const productReports = await ProductReport.find({ site_id, product_id });

//       if (!productReports || productReports.length === 0) {
//         return res.status(404).json({ message: "No product reports found" });
//       }

//       const image_0 = req.files.image_0 ? req.files.image_0[0].path : null;
//       const image_1 = req.files.image_1 ? req.files.image_1[0].path : null;
//       const image_2 = req.files.image_2 ? req.files.image_2[0].path : null;

//       const updatedReports = await Promise.all(
//         productReports.map(async (report) => {
//           try {
//             if (image_0) {
//               if (report.image_0) await fs.promises.unlink(report.image_0).catch(() => {});
//               report.image_0 = image_0;
//             }

//             if (image_1) {
//               if (report.image_1) await fs.promises.unlink(report.image_1).catch(() => {});
//               report.image_1 = image_1;
//             }

//             if (image_2) {
//               if (report.image_2) await fs.promises.unlink(report.image_2).catch(() => {});
//               report.image_2 = image_2;
//             }

//             if (problem_id) report.problem_id = problem_id;

//             return await report.save();
//           } catch (innerErr) {
//             console.error("Error processing one report:", innerErr);
//             return null; // or throw if you'd rather stop on error
//           }
//         })
//       );

//       const filteredReports = updatedReports.filter((r) => r !== null);

//       res.status(200).json({
//         message: "Images and problem ID updated for all matching products",
//         updated_reports: filteredReports,
//       });
//     } catch (error) {
//       console.error("Server error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//edit by Atest 15/04/2025
// exports.getEditNotEmptyVaule = async (req, res) => {
//   const { site_id } = req.body;

//   try {
//     // Step 1: Find the Site by site_id
//     const site = await Site.findById(site_id);

//     if (!site) {
//       return res.status(404).json({ message: "Site not found" });
//     }

//     const allProductIds = site.product.map((p) => p._id);

//     // Step 3: Fetch those products from Product model with valid parameter_min and parameter_max
//     const products = await Product.find({
//       _id: { $in: allProductIds },
//       parameter_min: { $nin: ["", "0", 0] },
//       parameter_max: { $nin: ["", "0", 0] },
//     }).select("_id product_name parameter_min parameter_max unite");

//     // Step 4: For each product, get the related ProductReport
//     const productReports = await Promise.all(
//       products.map(async (product) => {
//         const report = await ProductReport.findOne({
//           site_id,
//           product_id: product._id,
//         }).select("_id current_value");

//         if (report) {
//           return {
//             ...product.toObject(),
//             current_value: report.current_value,
//             product_report_id: report._id,
//           };
//         } else {
//           return product.toObject();
//         }
       
//       })
//     );

//     const sortedProductReports = productReports.sort((a, b) => b.datetime - a.datetime);

//     res.status(200).json({
//       message: "Products with non-empty parameter_min and parameter_max retrieved successfully",
//       products: sortedProductReports,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getEditNotEmptyVaule = async (req, res) => {
//   const { site_id } = req.body;

//   try {
//     // Step 1: Find the Site by site_id
//     const site = await Site.findById(site_id);
//     if (!site) {
//       return res.status(404).json({ message: "Site not found" });
//     }

//     const allProductIds = site.product.map((p) => p._id);

//     // Step 3: Fetch those products from Product model with valid parameter_min and parameter_max
//     const products = await Product.find({
//       _id: { $in: allProductIds },
//       parameter_min: { $nin: ["", "0", 0] },
//       parameter_max: { $nin: ["", "0", 0] },
//     }).select("_id product_name parameter_min parameter_max unite");

//     // Step 4: For each product, get the related ProductReport
//     const productReports = await Promise.all(
//       products.map(async (product) => {
//         const report = await ProductReport.findOne({
//           site_id,
//           product_id: product._id,
//         }).select("_id current_value datetime");

//         if (report) {
//           // console.log("report", report);
//           // Convert datetime string to Date object
//           const [date, time] = report.datetime.split(" ");
//           const [dd, mm, yyyy] = date.split("-");
//           const isoDateStr = `${yyyy}-${mm}-${dd}T${time}`;
//           const datetimeObj = new Date(isoDateStr);

//           return {
//             ...product.toObject(),
//             current_value: report.current_value,
//             product_report_id: report._id,
//             datetime: datetimeObj, // Attach the Date object for sorting
//           };
//         } else {
//           return product.toObject();
//         }
//       })
//     );

// // console.log("productReports",productReports);
//     // Sort the productReports array by datetime
//     const sortedProductReports = productReports.sort((a, b) => b.datetime - a.datetime);

//     res.status(200).json({
//       message: "Products with non-empty parameter_min and parameter_max retrieved successfully",
//       products: sortedProductReports,
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
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    const allProductIds = site.product.map((p) => p._id);

    const products = await Product.find({
      _id: { $in: allProductIds },
      parameter_min: { $nin: ["", "0", 0] },
      parameter_max: { $nin: ["", "0", 0] },
    }).select("_id product_name parameter_min parameter_max unite");

    const productReports = await Promise.all(
      products.map(async (product) => {
        const reports = await ProductReport.find({
          site_id,
          product_id: product._id,
        }).select("_id current_value datetime");

        if (!reports || reports.length === 0) {
          return product.toObject();
        }

        // Convert to proper dates
        const parsedReports = reports.map((r) => {
          const [date, time] = r.datetime.split(" ");
          const [dd, mm, yyyy] = date.split("-");
          const isoString = `${yyyy}-${mm}-${dd}T${time}`;
          return {
            ...r.toObject(),
            parsedDate: new Date(isoString),
          };
        });

        // Sort manually by parsed date
        const latestReport = parsedReports.sort((a, b) => b.parsedDate - a.parsedDate)[0];

        return {
          ...product.toObject(),
          current_value: latestReport.current_value,
          product_report_id: latestReport._id,
          datetime: latestReport.parsedDate,
        };
      })
    );

    // Final sorting by latest datetime
    const sortedProductReports = productReports.sort((a, b) => b.datetime - a.datetime);

    res.status(200).json({
      message: "Products with latest reports retrieved successfully",
      products: sortedProductReports,
    });
  } catch (error) {
    console.error("Error in getEditNotEmptyVaule:", error);
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
