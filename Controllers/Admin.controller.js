const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const ClientModel = require("../Models/Client.model");
const SiteAllotment = require("../Models/Site_Allotment");
const ProblemModel = require("../Models/Problem.model");
const bcrypt = require("bcryptjs");
const ReportModel = require("../Models/Report.model");
const ProductReport = require("../Models/Product_Report.model");
const { TerminationTemplate } = require("../Config/Template/terminationmail");
const { TerminationClientTemplate } = require("../Config/Template/terminationmailclient");
const { TerminationColleaguesTemplate } = require("../Config/Template/terminationmailcolleagues");
const { leaveApplicationModel, ResignationApplicationModel } = require("../Models/leaveApplication.model");
const { SiteShifitingTemplate } = require("../Config/Template/siteshifting");
const { NewSiteClientTemplate } = require("../Config/Template/newSiteClientTemplate");
const { SiteShifitingClientTemplate } = require("../Config/Template/siteshiftingclient");
const { SiteShifitingColleaguesTemplate } = require("../Config/Template/siteshiftingcolleagues");
const { WarningTemplate } = require("../Config/Template/warningmail");
const { FestivelTemplate } = require("../Config/Template/festivelmail");
const UserModel = require("../Models/User.model");
const ProductModel = require("../Models/Product.model");
const SiteModel = require("../Models/Site.model");
const CategoryModel = require("../Models/Category.model");
const { Admin_Model, Admin_Dashboard } = require("../Models/Admin.model");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const { blacklistToken } = require("../Config/generateToken");
const SE_Attendance = require("../Models/SE.model");
const SV_Attendance = require("../Models/SV.model");
const baseURL = process.env.BASE_URL;
var multiparty = require("multiparty");
const path = require("path");
const fs = require("fs");
const SendMail = require("../Config/mail");
const { WelcomeTemplate } = require("../Config/Template/welcomeclientmail");
const { ReportTemplate } = require("../Config/Template/reportmail");
const multer = require("multer");
var multiparty = require("multiparty");
const moment = require("moment-timezone");
const { createNotification } = require("./NotificationControllers");
const { NotificationMessages, AdminNotificationMessages } = require("../Models/Notification.model");
const SV_Site_Alloment = require("../Models/Site_Allotment");
const Site = require("../Models/Site.model");
const SV_Selfie = require("../Models/SV_Selfie.model");
const MaintenanceAlertTemplate = require("../Config/Template/MaintenanceAlertTemplate");
const Product = require("../Models/Product.model");

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.addAdmin = async (req, res) => {
  const payload = {
    full_name: "Sub Admin",
    password: 123456,
    mobile: 1234567891,
    email: "subadmin@gmail.com",
    role: "Sub_Admin",
  };

  try {
    const newAdmin = new Admin_Model(payload);
    await newAdmin.save();
    res.status(200).json({ message: "Admin added successfully", admin: newAdmin });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.authAdmin = async (req, res) => {
  const { email, password } = req.body;
  const userdata = await Admin_Model.findOne({ email: email });

  if (!userdata) {
    res.status(200).json({
      message: "Admin Not Found",
      status: false,
    });
    return;
  }

  const isPasswordMatch = await userdata.matchPassword(password);

  if (!isPasswordMatch) {
    res.status(200).json({
      message: "Invalid Password",
      status: false,
    });
    return;
  }

  if (isPasswordMatch) {
    const token = jwt.sign({ _id: userdata._id, role: userdata.role }, process.env.JSON_SECRET);
    // Set the token in a cookie for 30 days
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("Admintoken", token, {
        httpOnly: false,
        expires: new Date(Date.now() + 60 * 60 * 24 * 10 * 1000), // 30 days
        path: "/",
      })
    );

    res.json({
      userdata,
      token,
      status: true,
    });
  } else {
    res.status(200).json({
      message: "Invalid Password",
      status: false,
    });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin_Model.findById(req.headers.userID);

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const isMatch = await admin.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  // ✅ Just assign new password and save — hook will hash it
  admin.password = newPassword;
  await admin.save();

  res.json({ message: "Password changed successfully" });
};

exports.logoutAdmin = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract token from "Bearer {token}"

    blacklistToken(token);

    // Expire the cookie immediately
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("Admintoken", "", {
        httpOnly: false,
        expires: new Date(0),
        path: "/",
      })
    );

    res.json({ message: "Logout successful", status: true });
  } else {
    res.status(200).json({ message: "Invalid token", status: false });
  }
};

exports.addClient = async (req, res) => {
  const { clientName, clientEmail, address, state, city, gst, emailData, pincode, clientmobile } = req.body;
  const payload = {
    clientName: capitalizeFirstLetter(clientName),
    clientEmail: clientEmail,
    pincode: pincode,
    clientmobile,
    address: capitalizeFirstLetter(address),
    state: capitalizeFirstLetter(state),
    city: capitalizeFirstLetter(city),
    gst: gst,
    emailData: emailData,
  };

  try {
    const newAdmin = new ClientModel(payload);
    await newAdmin.save();
    SendMail({
      recipientEmail: clientEmail,
      subject: "Welcome Message",
      html: WelcomeTemplate(newAdmin),
    });

    res.status(200).json({ message: "Client added successfully", Client: newAdmin });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error adding Client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.editClient = async (req, res) => {
  const { clientId, clientName, clientEmail, address, state, city, gst, pincode, clientmobile } = req.body;

  // Prepare the updated data, only include fields that are present in the request
  const updateFields = {};
  if (clientName) updateFields.clientName = capitalizeFirstLetter(clientName);
  if (clientEmail) updateFields.clientEmail = clientEmail;
  if (address) updateFields.address = capitalizeFirstLetter(address);
  if (state) updateFields.state = capitalizeFirstLetter(state);
  if (city) updateFields.city = capitalizeFirstLetter(city);
  if (gst) updateFields.gst = gst;
  if (pincode) updateFields.pincode = pincode;
  if (clientmobile) updateFields.clientmobile = clientmobile;

  try {
    // Find the client by clientId and update their details
    const updatedClient = await ClientModel.findByIdAndUpdate(clientId, { $set: updateFields }, { new: true });

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client updated successfully", Client: updatedClient });
  } catch (error) {
    // Handle errors
    console.error("Error updating Client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getEditDetails = async (req, res) => {
  const { clientId } = req.body; // Assuming clientId is passed in the URL parameters

  try {
    // Find the client by clientId
    const client = await ClientModel.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Return the client details
    res.status(200).json({ Client: client });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving Client details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllClient = async (req, res) => {
  const { page = 1, search = "", Short = "" } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  // Build the query based on search and Short
  const query = search
    ? {
        $or: [{ clientName: { $regex: search, $options: "i" } }],
      }
    : {};

  sortCriteria = { _id: -1 };
  try {
    const users = await ClientModel.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage);

    let i = 0;
    // Add baseURL to pic property of each user
    const updatedUsers = users.map((user) => {
      i++;
      return {
        ...user.toObject(),
        orderId: i,
      };
    });

    const totalCount = await ClientModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      first_page_url: `${baseURL}api/users?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${baseURL}api/users?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${baseURL}api/users?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: null,
      path: `${baseURL}api/users`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Users: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

// exports.getAllDashboardCount = async (req, res) => {
//   try {
//     const Client = await ClientModel.countDocuments(); // Assuming there is only one document
//     const Problem = await ProblemModel.countDocuments();
//     const Product = await ProductModel.countDocuments();
//     const Site = await SiteModel.countDocuments();
//     const Category = await CategoryModel.countDocuments();
//     const admindata = await Admin_Dashboard.find();
//     const allSECount = admindata.length > 0 && admindata[0].All_SE_count ? admindata[0].All_SE_count.length : 0;
//     const activeSECount = admindata.length > 0 && admindata[0].Active_SE_count ? admindata[0].Active_SE_count.length : 0;
//     const allSVCount = admindata.length > 0 && admindata[0].All_SV_count ? admindata[0].All_SV_count.length : 0;

//     res.status(200).json({
//       Client: Client,
//       Problem: Problem,
//       Product: Product,
//       Site: Site,
//       Category: Category,
//       All_SE_count: allSECount,
//       Active_SE_count: activeSECount,
//       All_SV_count: allSVCount,
//     });
//   } catch (error) {
//     console.error("Error getting dashboard counts:", error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

exports.getAllDashboardCount = async (req, res) => {
  try {
    const Client = await ClientModel.countDocuments(); // Count documents in Client collection
    const Problem = await ProblemModel.countDocuments(); // Count documents in Problem collection
    const Product = await ProductModel.countDocuments(); // Count documents in Product collection
    const Site = await SiteModel.countDocuments(); // Count documents in Site collection
    const Category = await CategoryModel.countDocuments(); // Count documents in Category collection

    // Assuming you want to calculate the SE and SV counts based on attendance
    const allSECount = await UserModel.countDocuments({ role: "super_engineer" }); // All SE Attendance count
    const activeSECount = await UserModel.countDocuments({ role: "super_engineer", deactive_status: false, termination: false }); // Active SE Attendance count
    const allSVCount = await UserModel.countDocuments({
      role: "supervisor",
    }); // All SV Attendance count
    // Respond with the counts as a JSON object
    res.status(200).json({
      Client: Client,
      Problem: Problem,
      Product: Product,
      Site: Site,
      Category: Category,
      All_SE_count: allSECount,
      Active_SE_count: activeSECount,
      All_SV_count: allSVCount,
    });
  } catch (error) {
    console.error("Error getting dashboard counts:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

//  exports.runMaintenanceAlertCheck = async() => {
//   const allSites = await Site.find({});
//   const recipient = "php4.dbvertex@gmail.com";
//   const sendResults = [];

//   for (const site of allSites) {
//     for (const product of site.product) {
//       if (product.maintenance_alert && product.maintenance_alert !== "No") {

//         const productNameDoc = await Product.findById(product._id).select('product_name');
//         const productDetails = {
//           ...product.toObject(),
//           productName: productNameDoc?.product_name || "Unknown",
//           site_name: site.site_name,
//           location: site.location_name,
//         };

//         console.log("Sending maintenance alert for product:", {
//           name: productDetails.productName,
//           alert: product.maintenance_alert,
//           site: site.site_name
//         });

//         try {
//           const emailHtml = MaintenanceAlertTemplate(productDetails);

//           const sendmail = await SendMail({
//             recipientEmail: recipient,
//             subject: `Maintenance Alert for ${site.site_name} - ${productDetails.productName}`,
//             html: emailHtml,
//           });

//           sendResults.push({
//             site: site.site_name,
//             product: productDetails.productName,
//             status: sendmail,
//           });
//         } catch (err) {
//           console.error(`Failed to send alert for ${site.site_name} - ${productDetails.productName}:`, err);
//           sendResults.push({
//             site: site.site_name,
//             product: productDetails.productName,
//             status: "Failed",
//             error: err.message
//           });
//         }
//       }
//     }
//   }

//   return {
//     message: "Maintenance alerts processed",
//     totalMailsSent: sendResults.length,
//     details: sendResults
//   };
// }

// runMaintenanceAlertCheck();

//comment by Atest 25/03/25

// exports.getAllUsers = async (req, res) => {
//   const { page = 1, search = "" } = req.body;
//   const perPage = 10; // You can adjust this according to your requirements

//   // Build the query based on search and Short
//   const query = {
//     ...(search && { full_name: { $regex: search, $options: "i" } }),
//     role: null, // Filter users by role
//   };

//   // Sorting based on Short field
//   const sortCriteria = { _id: -1 };

//   try {
//     const users = await UserModel.find(query)
//       .sort(sortCriteria)
//       .skip((page - 1) * perPage)
//       .limit(perPage);
//     let i = 0;
//     // Add baseURL to pic property of each user
//     const updatedUsers = users.map((user) => {
//       i++;
//       return {
//         ...user.toObject(),
//         pic: `${process.env.BASE_URL}${user.pic}`,
//         orderId: i,
//       };
//     });

//     const totalCount = await UserModel.countDocuments(query);
//     const totalPages = Math.ceil(totalCount / perPage);

//     const paginationDetails = {
//       current_page: parseInt(page),
//       data: updatedUsers,
//       first_page_url: `${process.env.BASE_URL}api/users?page=1`,
//       from: (page - 1) * perPage + 1,
//       last_page: totalPages,
//       last_page_url: `${process.env.BASE_URL}api/users?page=${totalPages}`,
//       links: [
//         {
//           url: null,
//           label: "&laquo; Previous",
//           active: false,
//         },
//         {
//           url: `${process.env.BASE_URL}api/users?page=${page}`,
//           label: page.toString(),
//           active: true,
//         },
//         {
//           url: null,
//           label: "Next &raquo;",
//           active: false,
//         },
//       ],
//       next_page_url: null,
//       path: `${process.env.BASE_URL}api/users`,
//       per_page: perPage,
//       prev_page_url: null,
//       to: (page - 1) * perPage + updatedUsers.length,
//       total: totalCount,
//     };

//     res.json({
//       Users: paginationDetails,
//       page: page.toString(),
//       total_rows: totalCount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

// exports.UserTypeUpdate = async (req, res) => {
//   const userId = req.body.userId;
//   const type = req.body.type;
//   try {
//     // Find the video by its _id
//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // Check if deleted_at field is null or has a value
//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       {
//         $set: {
//           role: type,
//         },
//       },
//       { new: true }
//     );

//     if (type == "supervisor") {
//       const admindata = await Admin_Dashboard.find();
//       if (admindata.length === 0) {
//         // If the table is empty, initialize with default values
//         await Admin_Dashboard.create({ All_SV_count: [userId] });
//       } else {
//         await Admin_Dashboard.updateMany({}, { $addToSet: { All_SV_count: userId } });
//       }
//     } else {
//       const admindata = await Admin_Dashboard.find();
//       if (admindata.length === 0) {
//         // If the table is empty, initialize with default values
//         await Admin_Dashboard.create({ All_SE_count: [userId] });
//       } else {
//         await Admin_Dashboard.updateMany({}, { $addToSet: { All_SE_count: userId } });
//       }
//     }

//     return res.status(200).json({
//       message: "User soft delete status toggled successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

//edit by Atest 25/03/25

exports.runMaintenanceAlertCheck = async (req, res) => {
  const allSites = await Site.find({});
  const recipient = "service@evergreenion.com";
  const sendResults = [];

  for (const site of allSites) {
    for (const product of site.product) {
      if (product.maintenance_alert && product.maintenance_alert !== "No") {
        const productNameDoc = await Product.findById(product._id).select("product_name");
        const productDetails = {
          ...product.toObject(),
          productName: productNameDoc?.product_name || "Unknown",
          site_name: site.site_name,
          location: site.location_name,
        };

        console.log("Sending maintenance alert for product:", {
          name: productDetails.productName,
          alert: product.maintenance_alert,
          site: site.site_name,
          // maintanceDate: product.maintenance_date
        });

        try {
          const emailHtml = MaintenanceAlertTemplate(productDetails);

          const sendmail = await SendMail({
            recipientEmail: recipient,
            subject: `Maintenance Alert for ${site.site_name} - ${productDetails.productName}`,
            html: emailHtml,
          });

          sendResults.push({
            site: site.site_name,
            product: productDetails.productName,
            status: sendmail,
          });
        } catch (err) {
          console.error(`Failed to send alert for ${site.site_name} - ${productDetails.productName}:`, err);
          sendResults.push({
            site: site.site_name,
            product: productDetails.productName,
            status: "Failed",
            error: err.message,
          });
        }
      }
    }
  }

  console.log("Maintenance alert process completed.");
  res.status(200).json({
    message: "Maintenance alerts processed",
    totalMailsSent: sendResults.length,
    details: sendResults,
  });
};

exports.getAllUsers = async (req, res) => {
  const { search = "" } = req.body;
  let page = parseInt(req.body.page) || 1;
  page = Math.max(page, 1); // Ensure page is at least 1
  const perPage = 10; // Adjust as needed

  // Build the query based on search
  const query = {
    ...(search && { full_name: { $regex: search, $options: "i" } }),
    role: null, // Filter users by role
  };

  // Sorting based on _id field
  const sortCriteria = { _id: -1 };

  try {
    const users = await UserModel.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage);

    let i = (page - 1) * perPage; // Order starts from the first item of the page
    const updatedUsers = users.map((user) => ({
      ...user.toObject(),
      pic: `${process.env.BASE_URL}${user.pic}`,
      orderId: ++i, // Increment index
    }));

    const totalCount = await UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: page,
      data: updatedUsers,
      first_page_url: `${process.env.BASE_URL}api/users?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${process.env.BASE_URL}api/users?page=${totalPages}`,
      links: [
        {
          url: page > 1 ? `${process.env.BASE_URL}api/users?page=${page - 1}` : null,
          label: "&laquo; Previous",
          active: page > 1,
        },
        {
          url: `${process.env.BASE_URL}api/users?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: page < totalPages ? `${process.env.BASE_URL}api/users?page=${page + 1}` : null,
          label: "Next &raquo;",
          active: page < totalPages,
        },
      ],
      next_page_url: page < totalPages ? `${process.env.BASE_URL}api/users?page=${page + 1}` : null,
      path: `${process.env.BASE_URL}api/users`,
      per_page: perPage,
      prev_page_url: page > 1 ? `${process.env.BASE_URL}api/users?page=${page - 1}` : null,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Users: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.UserTypeUpdate = async (req, res) => {
  const { userId, type } = req.body; // Destructure userId and type
  try {
    // Find the user by its _id
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { role: type } },
      { new: true } // Return the updated user
    );

    // Check if the user is a supervisor or another type (e.g., senior engineer)
    const admindata = await Admin_Dashboard.find();
    if (type === "supervisor") {
      if (admindata.length === 0) {
        // If no data exists, create a new entry with the user in All_SV_count
        await Admin_Dashboard.create({ All_SV_count: [userId] });
      } else {
        // Add the user to All_SV_count (without duplicates)
        await Admin_Dashboard.updateMany({}, { $addToSet: { All_SV_count: userId } });
      }
    } else {
      if (admindata.length === 0) {
        // If no data exists, create a new entry with the user in All_SE_count
        await Admin_Dashboard.create({ All_SE_count: [userId] });
      } else {
        // Add the user to All_SE_count (without duplicates)
        await Admin_Dashboard.updateMany({}, { $addToSet: { All_SE_count: userId } });
      }
    }

    return res.status(200).json({
      message: "User role updated and Admin Dashboard updated successfully",
    });
  } catch (error) {
    console.error("Error updating user type:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserAdmin = async (req, res) => {
  const { userId } = req.body; // Destructure to get userId directly
  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
      status: false,
    });
  }

  try {
    const user = await UserModel.findById(userId); // Use findById for better clarity

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        status: false,
      });
    }

    const userCopy = {
      ...user.toObject(),
      medical_card: `${baseURL}${user.medical_card}`,
      identity_card: `${baseURL}${user.identity_card}`,
    };

    res.json({
      user: userCopy,
      status: true,
    });
  } catch (error) {
    console.error("GetUsers API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getAll_Super_Engineer = async (req, res) => {
  const { page = 1, search = "", statusType } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  // Build the query based on search
  const query = {
    ...(search && { full_name: { $regex: search, $options: "i" } }),
    role: "super_engineer", // Filter users by role
  };

  if (statusType === "active") {
    query.deactive_status = false;
    query.termination = false; // Ensure terminated users are not included
  } else if (statusType === "deactive") {
    query.deactive_status = true;
    query.termination = false; // Ensure terminated users are not included
  } else if (statusType === "terminated") {
    query.termination = true;
    // No need to check deactive_status for terminated users
  }

  // Sorting based on _id field
  const sortCriteria = { _id: -1 };

  try {
    const users = await UserModel.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "site_id",
        select: "site_name  _id",
      });
    let i = 0;
    // Add baseURL to pic property of each user
    const updatedUsers = users.map((user) => {
      i++;
      return {
        ...user.toObject(),
        pic: `${process.env.BASE_URL}${user.pic}`,
        medical_card: user.medical_card ? `${process.env.BASE_URL}${user.medical_card}` : null,
        identity_card: user.identity_card ? `${process.env.BASE_URL}${user.identity_card}` : null,
        orderId: i,
      };
    });

    const totalCount = await UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      first_page_url: `${process.env.BASE_URL}api/users?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${process.env.BASE_URL}api/users?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${process.env.BASE_URL}api/users?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: null,
      path: `${process.env.BASE_URL}api/users`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Users: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getAll_Supervisor = async (req, res) => {
  const { page = 1, search = "", statusType } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  // Build the query based on search
  const query = {
    ...(search && { full_name: { $regex: search, $options: "i" } }),
    role: "supervisor", // Filter users by role
  };

  if (statusType === "active") {
    query.deactive_status = false;
    query.termination = false; // Ensure terminated users are not included
  } else if (statusType === "deactive") {
    query.deactive_status = true;
    query.termination = false; // Ensure terminated users are not included
  } else if (statusType === "terminated") {
    query.termination = true;
    // No need to check deactive_status for terminated users
  }
  // Sorting based on _id field
  const sortCriteria = { _id: -1 };

  try {
    const users = await UserModel.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "site_id",
        select: "site_name  _id",
      });
    let i = 0;
    // Add baseURL to pic property of each user
    const updatedUsers = users.map((user) => {
      i++;
      return {
        ...user.toObject(),
        pic: `${process.env.BASE_URL}${user.pic}`,
        medical_card: user.medical_card ? `${process.env.BASE_URL}${user.medical_card}` : null,
        identity_card: user.identity_card ? `${process.env.BASE_URL}${user.identity_card}` : null,
        orderId: i,
      };
    });

    const totalCount = await UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      first_page_url: `${process.env.BASE_URL}api/users?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${process.env.BASE_URL}api/users?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${process.env.BASE_URL}api/users?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: null,
      path: `${process.env.BASE_URL}api/users`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Users: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.SiteAllotmentUser = async (req, res) => {
  try {
    // Fetch site names from the request body
    const { site_names, userId } = req.body;

    // Initialize an array to store site IDs
    let siteIds = [];

    // Loop through each site name
    for (const site_name of site_names) {
      // Find the site by its name
      const site = await SiteModel.findOne({ site_name });
      // If site not found, return error
      if (!site) {
        return res.status(404).json({ message: `Site ${site_name} not found` });
      }
      // Push site ID into the siteIds array
      siteIds.push(site._id);
    }

    // Update the user with the site_ids array
    await UserModel.findByIdAndUpdate(userId, { site_id: siteIds });

    const admindata = await Admin_Dashboard.find();

    if (admindata.length === 0) {
      // If the table is empty, initialize with default values
      await Admin_Dashboard.create({ Active_SE_count: [userId] });
    } else {
      if (siteIds && siteIds.length > 0) {
        // If siteIds is not empty, add userId to both Active_SE_count and All_SE_count
        await Admin_Dashboard.updateMany(
          {},
          {
            $addToSet: { Active_SE_count: userId },
          }
        );
      } else {
        // If siteIds is empty, remove userId from Active_SE_count
        await Admin_Dashboard.updateMany(
          {},
          {
            $pull: { Active_SE_count: userId },
          }
        );
      }
    }

    return res.status(200).json({ message: "Site allotment successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.SiteAllotmentSE = async (req, res) => {
  try {
    // Fetch site names from the request body
    const { site_names, userId, date } = req.body;

    // Initialize an array to store site IDs
    let siteIds = [];

    // Loop through each site name
    for (const site_name of site_names) {
      // Find the site by its name
      const site = await SiteModel.findOne({ site_name });
      // If site not found, return error
      if (!site) {
        return res.status(404).json({ message: `Site ${site_name} not found` });
      }

      // Push site ID into the siteIds array
      siteIds.push(site._id);
    }

    const formattedDates = new Date(date).toLocaleDateString("en-IN");
    // Format the date with leading zero for the day portion
    const formattedDate = formatDateWithLeadingZero(formattedDates);

    // Check if there is an existing entry for the userId and formattedDate
    const existingEntry = await SiteAllotment.findOne({ user_id: userId, date: formattedDate });

    if (existingEntry) {
      // If an entry exists, update the site_ids array
      existingEntry.site_id = siteIds;
      await existingEntry.save();
      return res.status(200).json({ message: "Site allotment updated successfully" });
    } else {
      // If no entry exists, create a new one
      const newSiteAllotment = await SiteAllotment.create({
        site_id: siteIds,
        user_id: userId,
        date: formattedDate,
      });

      return res.status(200).json({ message: "Site allotment successful" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const formatDateWithLeadingZero = (dateString) => {
  const parts = dateString.split("/");
  // Pad the day portion with a leading zero if it's a single digit
  const formattedDay = parts[0].length === 1 ? `0${parts[0]}` : parts[0];
  const formattedMonth = parts[1].length === 1 ? `0${parts[1]}` : parts[1];
  // Reconstruct the date string with the formatted day portion
  return `${formattedDay}/${formattedMonth}/${parts[2]}`;
};

exports.SESitesFromAllotment = async (req, res) => {
  const { page = 1, userId } = req.body;
  const perPage = 10;

  try {
    // Find the total count of SiteAllotment entries for the given userId
    const totalCount = await SiteAllotment.countDocuments({ user_id: userId }).sort({ _id: -1 });

    // Calculate pagination variables
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    // Find the SiteAllotment entries for the given userId with pagination
    const allotments = await SiteAllotment.find({ user_id: userId })
      .sort({ _id: -1 }) // Sorting by _id in descending order
      .skip(startIndex)
      .limit(perPage);

    // Extract unique site IDs and date from the allotments
    const siteDetails = allotments.flatMap((allotment) => {
      return allotment.site_id.map((siteId) => ({
        site_id: siteId,
        date: allotment.date,
      }));
    });

    // Extract unique site IDs
    const uniqueSiteIds = [...new Set(siteDetails.map((detail) => detail.site_id))];

    // Find sites based on the unique site IDs and retrieve site_name
    const sites = await SiteModel.find({ _id: { $in: uniqueSiteIds } }, { site_name: 1 });

    // Find unique dates from all allotments
    const uniqueDates = [...new Set(allotments.map((allotment) => allotment.date))].sort((a, b) => {
      // Sort dates in descending order
      return moment(b, "DD/MM/YYYY").valueOf() - moment(a, "DD/MM/YYYY").valueOf();
    });
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
          })),
      };
    });

    // Pagination details
    const paginationDetails = {
      current_page: parseInt(page),
      data: populatedSites,
      first_page_url: `${baseURL}api/sites/${userId}?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${baseURL}api/sites/${userId}?page=${totalPages}`,
      next_page_url: page < totalPages ? `${baseURL}api/sites/${userId}?page=${parseInt(page) + 1}` : null,
      path: `${baseURL}api/sites/${userId}`,
      per_page: perPage,
      prev_page_url: page > 1 ? `${baseURL}api/sites/${userId}?page=${parseInt(page) - 1}` : null,
      to: Math.min(endIndex, totalCount),
      total: totalCount,
    };

    // Return the populated site data along with pagination details
    return res.status(200).json({
      pagination: paginationDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// comment by Atest 30/04/25

// exports.getAll_Report = async (req, res) => {
//   const { page = 1, search = "", date = null } = req.body;
//   const perPage = 10; // You can adjust this according to your requirements
//   //  const perPage = await ReportModel.countDocuments({});
//   // Sorting based on _id field
//   const sortCriteria = { _id: -1, datetime: -1  };

//   try {
//     let query = { all_data_submit: true };
//     // Add date filter if date is not null
//     if (date !== null) {
//       query.date = date;
//     }
//     // Add search filter if search is not empty
//     if (search) {
//       query.$text = { $search: search };
//     }

//     // Fetch the filtered results
//     const users = await ReportModel.find(query)
//       .sort(sortCriteria)
//       .skip((page - 1) * perPage)
//       .limit(perPage)
//       .populate({
//         path: "userId",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "verified_userId",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "verified_adminId",
//         select: "name _id",
//       })
//       .populate({
//         path: "site_id",
//         select: "site_name _id",
//       });

//     // Prepend baseURL to images in each product of each report
//     users.forEach((report) => {
//       if (report.product && Array.isArray(report.product)) {
//         report.product.forEach((product) => {
//           if (product.images && Array.isArray(product.images)) {
//             product.images = product.images.map((image) => baseURL + image);
//           }
//         });
//       }
//     });

//     let i = 0;
//     // Add baseURL to pic property of each user
//     const updatedUsers = users.map((user) => {
//       i++;
//       return {
//         ...user.toObject(),
//         orderId: i,
//       };
//     });

//     const totalCount = await ReportModel.countDocuments();
//     const totalPages = Math.ceil(totalCount / perPage);

//     const paginationDetails = {
//       current_page: parseInt(page),
//       data: updatedUsers,
//       first_page_url: `${process.env.BASE_URL}api/admin?page=1`,
//       from: (page - 1) * perPage + 1,
//       last_page: totalPages,
//       last_page_url: `${process.env.BASE_URL}api/admin?page=${totalPages}`,
//       links: [
//         {
//           url: null,
//           label: "&laquo; Previous",
//           active: false,
//         },
//         {
//           url: `${process.env.BASE_URL}api/admin?page=${page}`,
//           label: page.toString(),
//           active: true,
//         },
//         {
//           url: null,
//           label: "Next &raquo;",
//           active: false,
//         },
//       ],
//       next_page_url: null,
//       path: `${process.env.BASE_URL}api/admin`,
//       per_page: perPage,
//       prev_page_url: null,
//       to: (page - 1) * perPage + updatedUsers.length,
//       total: totalCount,
//     };

//     res.json({
//       Report: paginationDetails,
//       page: page.toString(),
//       total_rows: totalCount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

// edit by Atest 30/04/25

exports.getAll_Report = async (req, res) => {
  const { page = 1, search = "", date = null } = req.body;
  const perPage = 10;
  const sortCriteria = { _id: -1, datetime: -1 };
  const role = req.headers.role;

  try {
    let query = { all_data_submit: true };

    if (date !== null) {
      query.date = date;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const allReports = await ReportModel.find(query).sort(sortCriteria).populate("userId", "full_name role").populate("verified_userId", "full_name _id").populate("verified_adminId", "name _id").populate("site_id", "site_name _id");

    const now = moment();

    const filteredReports = allReports.filter((report) => {
      const submitterRole = report.userId?.role;
      const reportTime = moment(report.datetime, "DD-MM-YYYY HH:mm:ss");

      if (!submitterRole || !reportTime.isValid()) return false;

      if (role === "Sub_Admin") {
        if (submitterRole === "super_engineer") {
          return now.diff(reportTime, "minutes") >= 60;
        } else if (submitterRole === "supervisor") {
          return true;
        }
      } else if (role === "Admin") {
        if (submitterRole === "super_engineer") {
          return now.diff(reportTime, "minutes") >= 120;
        } else if (submitterRole === "supervisor") {
          // return now.diff(reportTime, "minutes") >= 60;
          return true;
        }
      } else {
        return true;
      }
    });

    const updatedUsers = filteredReports.slice((page - 1) * perPage, page * perPage).map((user, index) => {
      if (user.product && Array.isArray(user.product)) {
        user.product.forEach((product) => {
          if (product.images && Array.isArray(product.images)) {
            product.images = product.images.map((img) => baseURL + img);
          }
        });
      }

      return {
        ...user.toObject(),
        orderId: (page - 1) * perPage + index + 1,
      };
    });

    const totalCount = filteredReports.length;
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      per_page: perPage,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Report: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error("Get Report Error: ", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getReportOnlySite = async (req, res) => {
  const { page = 1, search = "", site_Id } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  // Sorting based on _id field
  const sortCriteria = { _id: -1 };

  try {
    const users = await ReportModel.find({ site_id: site_Id })
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "userId",
        select: "full_name _id",
      })
      .populate({
        path: "verified_userId",
        select: "full_name _id",
      })
      .populate({
        path: "verified_adminId",
        select: "full_name _id",
      })
      .populate({
        path: "site_id",
        select: "site_name _id",
      });

    // Prepend baseURL to images in each product of each report
    users.forEach((report) => {
      if (report.product && Array.isArray(report.product)) {
        report.product.forEach((product) => {
          if (product.images && Array.isArray(product.images)) {
            product.images = product.images.map((image) => baseURL + image);
          }
        });
      }
    });

    let i = 0;
    // Add baseURL to pic property of each user
    const updatedUsers = users.map((user) => {
      i++;
      return {
        ...user.toObject(),
        orderId: i,
      };
    });

    const totalCount = await ReportModel.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      first_page_url: `${process.env.BASE_URL}api/admin?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${process.env.BASE_URL}api/admin?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${process.env.BASE_URL}api/admin?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: null,
      path: `${process.env.BASE_URL}api/admin`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Report: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.AdminNotificationToken = async (req, res) => {
  const id = req.headers.userID;
  const { newToken } = req.body;
  try {
    // Find the admin by id and update the firebase_token
    const result = await Admin_Model.findByIdAndUpdate(id, { firebase_token: newToken }, { new: true });

    if (result) {
      res.status(200).json({ message: "Firebase token updated successfully", result: result });
      return result;
    } else {
      res.status(404).json({ message: "Admin not found with the given id" });
      return null;
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating firebase token", error });
    throw error;
  }
};

exports.DeleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationMessages.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.getAdminNotifications = async (req, res) => {
//   try {
//     const notifications = await NotificationMessages.find();

//     const result = await Promise.all(
//       notifications.map(async (noti) => {
//         const sender = await UserModel.findById(noti.sender_id);
//         if (!sender) {
//           return {
//             notification_id: noti._id,
//             message: noti.message,
//             sender_name: "Unknown",
//             receiver_names: [],
//             site_name: "",
//             datetime: moment(noti.datetime, "DD-MM-YYYY HH:mm:ss").toDate(), // convert to Date
//             formatted_datetime: noti.datetime, // original string for display
//           };
//         }

//         let senderSites = [];

//         // Get sender's site_id based on role
//         if (sender.role === "super_engineer") {
//           senderSites = sender.site_id || [];
//         } else if (sender.role === "supervisor") {
//           const supervisorData = await SV_Site_Alloment.findOne({ user_id: sender._id });
//           if (supervisorData) {
//             senderSites = supervisorData.site_id || [];
//           }
//         }

//         // Get latest report by this sender
//         const latestReport = await ReportModel.findOne({ userId: sender._id }).sort({ datetime: -1 }).limit(1);

//         let siteName = "";

//         if (latestReport?.site_id) {
//           const site = await Site.findById(latestReport.site_id);
//           siteName = site?.site_name || "";
//         } else if (senderSites.length > 0) {
//           const fallbackSite = await Site.findById(senderSites[0]);
//           siteName = fallbackSite?.site_name || "";
//         }

//         // Get receiver names
//         const receiverNames = await Promise.all(
//           (noti.receiver_id || []).map(async (id) => {
//             const user = await UserModel.findById(id);
//             return user?.full_name || "Unknown";
//           })
//         );

//         return {
//           notification_id: noti._id,
//           message: noti.message,
//           sender_name: sender.full_name || "Unknown",
//           receiver_names: receiverNames,
//           site_name: siteName,
//           datetime: moment(noti.datetime, "DD-MM-YYYY HH:mm:ss").toDate(), // for sorting
//           formatted_datetime: noti.datetime, // keep original string format for response
//         };
//       })
//     );

//     // Sort notifications by converted datetime (most recent first)
//     const sortedResult = result.sort((a, b) => b.datetime - a.datetime);

//     // Replace datetime field with formatted string and remove raw Date if needed
//     const finalResult = sortedResult.map((noti) => ({
//       notification_id: noti.notification_id,
//       message: noti.message,
//       sender_name: noti.sender_name,
//       receiver_names: noti.receiver_names,
//       site_name: noti.site_name,
//       datetime: noti.formatted_datetime,
//     }));

//     res.status(200).json(finalResult);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await NotificationMessages.find();

    const result = await Promise.all(
      notifications.map(async (noti) => {
        const sender = await UserModel.findById(noti.sender_id);
        if (!sender) {
          return {
            notification_id: noti._id,
            message: noti.message,
            sender_name: "Unknown",
            receiver_names: [],
            site_name: "",
            datetime: moment(noti.datetime, "DD-MM-YYYY HH:mm:ss").toDate(),
            formatted_datetime: noti.datetime,
          };
        }

        let senderSites = [];

        // Get sender's site IDs based on role
        if (sender.role === "super_engineer") {
          senderSites = sender.site_id || [];
        } else if (sender.role === "supervisor") {
          const supervisorData = await SV_Site_Alloment.findOne({ user_id: sender._id });
          if (supervisorData) {
            senderSites = supervisorData.site_id || [];
          }
        }

        // Convert site IDs to strings for reliable comparison
        senderSites = senderSites.map((id) => String(id));

        // Get latest report by this sender
        const latestReport = await ReportModel.findOne({ userId: sender._id }).sort({ datetime: -1 }).limit(1);

        let siteName = "";

        if (latestReport?.site_id && senderSites.includes(String(latestReport.site_id))) {
          const site = await Site.findById(latestReport.site_id);
          siteName = site?.site_name || "";
        } else if (senderSites.length > 0) {
          const fallbackSite = await Site.findById(senderSites[0]);
          siteName = fallbackSite?.site_name || "";
        }

        // Get receiver names
        const receiverNames = await Promise.all(
          (noti.receiver_id || []).map(async (id) => {
            const user = await UserModel.findById(id);
            return user?.full_name || "Unknown";
          })
        );

        return {
          notification_id: noti._id,
          message: noti.message,
          sender_name: sender.full_name || "Unknown",
          receiver_names: receiverNames,
          site_name: siteName,
          datetime: moment(noti.datetime, "DD-MM-YYYY HH:mm:ss").toDate(),
          formatted_datetime: noti.datetime,
        };
      })
    );

    const sortedResult = result.sort((a, b) => b.datetime - a.datetime);

    const finalResult = sortedResult.map((noti) => ({
      notification_id: noti.notification_id,
      message: noti.message,
      sender_name: noti.sender_name,
      receiver_names: noti.receiver_names,
      site_name: noti.site_name,
      datetime: noti.formatted_datetime,
    }));

    res.status(200).json(finalResult);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
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

// exports.updateUserType = async (req, res) => {
//   const Medical_Card_Upload_Dir = "./uploads/Medical_Card";
//   const Identity_Card_Upload_Dir = "./uploads/Identity_Card";

//   const form = new multiparty.Form();
//   const timestamp = new Date(); // Get the current timestamp
//   const formattedDate = formatDate(timestamp); // Format the timestamp
//   const dateString = formattedDate.toLocaleString(); // Convert to string
//   const date = new Date(dateString);
//   const timestampInSeconds = Math.floor(date.getTime() / 1000);

//   let medicalCardFilePath = "";
//   let identityCardFilePath = "";

//   form.on("file", function (name, file) {
//     // Getting the file extension
//     const fileExtension = file.originalFilename.split(".").pop();
//     // Creating the new filename with timestamp
//     const newFilename = `${timestampInSeconds}.${fileExtension}`;

//     if (name === "medical_card") {
//       const newFilePath = path.join(Medical_Card_Upload_Dir, newFilename).replace(/\\/g, "/"); // Replace backslashes with forward slashes
//       medicalCardFilePath = newFilePath;

//       // Rename the file
//       fs.rename(file.path, newFilePath, (err) => {
//         if (err) {
//           console.error("File renaming error (medical_card):", err);
//           return res.status(500).send({ error: "File renaming error (medical_card)" });
//         }
//       });
//     } else if (name === "identity_card") {
//       const newFilePath = path.join(Identity_Card_Upload_Dir, newFilename).replace(/\\/g, "/"); // Replace backslashes with forward slashes
//       identityCardFilePath = newFilePath;

//       // Rename the file
//       fs.rename(file.path, newFilePath, (err) => {
//         if (err) {
//           console.error("File renaming error (identity_card):", err);
//           return res.status(500).send({ error: "File renaming error (identity_card)" });
//         }
//       });
//     }
//   });

//   form.parse(req, async (err, fields) => {
//     if (err) {
//       console.error("Error parsing form:", err);
//       return res.status(500).send({ error: "Form parsing error" });
//     }

//     const PF_number = fields.PF_number[0];
//     const Esic = fields.Esic[0];
//     const type = fields.type[0];
//     const user_id = fields.user_id[0];

//     try {
//       const user = await UserModel.findById({ _id: user_id });

//       if (!user) {
//         return res.status(404).send({ error: "User not found" });
//       }

//       user.PF_number = PF_number;
//       user.ESIC = Esic;
//       user.role = type;
//       user.medical_card = medicalCardFilePath;
//       user.identity_card = identityCardFilePath;

//       await user.save();

//       res.status(200).json({
//         _id: user._id,
//         PF_number: PF_number,
//         ESIC: Esic,
//         role: type,
//         medical_card: medicalCardFilePath,
//         identity_card: identityCardFilePath,
//         status: true,
//       });
//     } catch (err) {
//       console.error("Error updating user:", err);
//       res.status(500).send({ error: "User update failed" });
//     }
//   });
// };

// comment by Atest 28/03/25

// exports.updateUserType = async (req, res) => {
//   const Medical_Card_Upload_Dir = "./uploads/Medical_Card";
//   const Identity_Card_Upload_Dir = "./uploads/Identity_Card";

//   const form = new multiparty.Form();
//   const timestamp = new Date(); // Get the current timestamp
//   const formattedDate = formatDate(timestamp); // Format the timestamp
//   const dateString = formattedDate.toLocaleString(); // Convert to string
//   const date = new Date(dateString);
//   const timestampInSeconds = Math.floor(date.getTime() / 1000);

//   let medicalCardFilePath = "";
//   let identityCardFilePath = "";

//   form.on("file", function (name, file) {
//     // Getting the file extension
//     const fileExtension = file.originalFilename.split(".").pop();
//     // Creating the new filename with timestamp
//     const newFilename = `${timestampInSeconds}.${fileExtension}`;

//     if (name === "medical_card") {
//       const newFilePath = path.join(Medical_Card_Upload_Dir, newFilename).replace(/\\/g, "/"); // Replace backslashes with forward slashes
//       medicalCardFilePath = newFilePath;

//       // Rename the file
//       fs.rename(file.path, newFilePath, (err) => {
//         if (err) {
//           console.error("File renaming error (medical_card):", err);
//           return res.status(500).send({ error: "File renaming error (medical_card)" });
//         }
//       });
//     } else if (name === "identity_card") {
//       const newFilePath = path.join(Identity_Card_Upload_Dir, newFilename).replace(/\\/g, "/"); // Replace backslashes with forward slashes
//       identityCardFilePath = newFilePath;

//       // Rename the file
//       fs.rename(file.path, newFilePath, (err) => {
//         if (err) {
//           console.error("File renaming error (identity_card):", err);
//           return res.status(500).send({ error: "File renaming error (identity_card)" });
//         }
//       });
//     }
//   });

//   form.parse(req, async (err, fields) => {
//     if (err) {
//       console.error("Error parsing form:", err);
//       return res.status(500).send({ error: "Form parsing error" });
//     }

//     const PF_number = fields.PF_number[0];
//     const Esic = fields.Esic[0];
//     const type = fields.type[0];
//     const user_id = fields.user_id[0];

//     try {
//       console.log(medicalCardFilePath);
//       console.log(identityCardFilePath);
//       const updateFields = {};

//       // Conditionally add fields to updateFields if they are not empty or null
//       if (PF_number) updateFields.PF_number = PF_number;
//       if (Esic) updateFields.ESIC = Esic;
//       if (type) updateFields.role = type;
//       if (medicalCardFilePath) updateFields.medical_card = medicalCardFilePath;
//       if (identityCardFilePath) updateFields.identity_card = identityCardFilePath;

//       // Perform the update only if there are fields to update
//       if (Object.keys(updateFields).length > 0) {
//         const result = await UserModel.updateOne({ _id: user_id }, { $set: updateFields });
//         if (result.nModified === 0) {
//           return res.status(404).send({ error: "User not found or data is the same" });
//         }
//       }

//       res.status(200).json({
//         _id: user_id,
//         PF_number: PF_number,
//         ESIC: Esic,
//         role: type,
//         medical_card: medicalCardFilePath,
//         identity_card: identityCardFilePath,
//         status: true,
//       });
//     } catch (err) {
//       console.error("Error updating user:", err);
//       res.status(500).send({ error: "User update failed" });
//     }
//   });
// };

//edit by Atest

exports.updateUserType = async (req, res) => {
  const Medical_Card_Upload_Dir = "./uploads/Medical_Card";
  const Identity_Card_Upload_Dir = "./uploads/Identity_Card";

  const form = new multiparty.Form();
  const timestamp = new Date();
  const formattedDate = formatDate(timestamp);
  const dateString = formattedDate.toLocaleString();
  const date = new Date(dateString);
  const timestampInSeconds = Math.floor(date.getTime() / 1000);

  let medicalCardFilePath = "";
  let identityCardFilePath = "";

  form.on("file", function (name, file) {
    const fileExtension = file.originalFilename.split(".").pop();
    const newFilename = `${timestampInSeconds}.${fileExtension}`;

    if (name === "medical_card") {
      const newFilePath = path.join(Medical_Card_Upload_Dir, newFilename).replace(/\\/g, "/");
      medicalCardFilePath = newFilePath;
      fs.rename(file.path, newFilePath, (err) => {
        if (err) {
          console.error("File renaming error (medical_card):", err);
          return res.status(500).send({ error: "File renaming error (medical_card)" });
        }
      });
    } else if (name === "identity_card") {
      const newFilePath = path.join(Identity_Card_Upload_Dir, newFilename).replace(/\\/g, "/");
      identityCardFilePath = newFilePath;
      fs.rename(file.path, newFilePath, (err) => {
        if (err) {
          console.error("File renaming error (identity_card):", err);
          return res.status(500).send({ error: "File renaming error (identity_card)" });
        }
      });
    }
  });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).send({ error: "Form parsing error" });
    }

    const user_id = fields.user_id?.[0];

    try {
      // Fetch the existing user details
      const existingUser = await UserModel.findOne({ _id: user_id });

      if (!existingUser) {
        return res.status(404).send({ error: "User not found" });
      }

      // Get new values from the request
      const PF_number = fields.PF_number?.[0];
      const Esic = fields.Esic?.[0];
      const type = fields.type?.[0];

      // 🔴 Check if PF_number or ESIC is already taken by another user
      if (PF_number) {
        const pfExists = await UserModel.findOne({ PF_number, _id: { $ne: user_id } });
        if (pfExists) {
          return res.status(400).json({
            error: `PF Number "${PF_number}" is already taken by another user.`,
          });
        }
      }

      if (Esic) {
        const esicExists = await UserModel.findOne({ ESIC: Esic, _id: { $ne: user_id } });
        if (esicExists) {
          return res.status(400).json({
            error: `ESIC Number "${Esic}" is already taken by another user.`,
          });
        }
      }

      const updateFields = {};

      if (PF_number) updateFields.PF_number = PF_number;
      if (Esic) updateFields.ESIC = Esic;
      if (type) updateFields.role = type;
      if (medicalCardFilePath) updateFields.medical_card = medicalCardFilePath;
      if (identityCardFilePath) updateFields.identity_card = identityCardFilePath;

      // Perform update only if there are changes
      if (Object.keys(updateFields).length > 0) {
        await UserModel.updateOne({ _id: user_id }, { $set: updateFields });
      }
      res.status(200).json({ success: true, message: "Updated successfully" });
      // res.status(200).json({
      //   _id: user_id,
      //   PF_number: updateFields.PF_number || existingUser.PF_number,
      //   ESIC: updateFields.ESIC || existingUser.ESIC,
      //   role: updateFields.role || existingUser.role,
      //   medical_card: updateFields.medical_card || existingUser.medical_card,
      //   identity_card: updateFields.identity_card || existingUser.identity_card,
      //   status: true,
      // });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).send({ error: "User update failed" });
    }
  });
};

// comment by Atest

// exports.getSuperEngineersName = async (req, res) => {
//   try {
//     // Query the database to find users with the role 'super_engineer' and whose site_id is an empty array,
//     // and select only 'full_name' and '_id'
//     const superEngineers = await UserModel.find({ role: "super_engineer", site_id: { $size: 0 } }, "full_name _id");

//     // Respond with the retrieved data
//     res.status(200).json({ superEngineers: superEngineers });
//   } catch (error) {
//     console.error("Error fetching super engineers:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// edit by Atest

exports.getSuperEngineersName = async (req, res) => {
  try {
    // Query the database to find users with the role 'super_engineer' and whose site_id is an empty array,
    // and select only 'full_name' and '_id'
    const superEngineers = await UserModel.find({ role: "super_engineer", deactive_status: false, termination: false, site_id: { $size: 0 } }, "full_name _id")
      .collation({ locale: "en", strength: 1 })
      .sort({ full_name: 1 });

    // Respond with the retrieved data
    res.status(200).json({ superEngineers: superEngineers });
  } catch (error) {
    console.error("Error fetching super engineers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSuperEngineersNameEdit = async (req, res) => {
  try {
    // Query the database to find users with the role 'super_engineer' and whose site_id is an empty array,
    // and select only 'full_name' and '_id'
    const superEngineers = await UserModel.find({ role: "super_engineer", deactive_status: false, termination: false }, "full_name _id").collation({ locale: "en", strength: 1 }).sort({ full_name: 1 });

    // Respond with the retrieved data
    res.status(200).json({ superEngineers: superEngineers });
  } catch (error) {
    console.error("Error fetching super engineers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// comment by Atest 07/01/25

// exports.getAllSEAttendance = async (req, res) => {
//   try {
//     let { page = 1, search = "", datestart, dateend } = req.body;
//     const limit = 1000; // Number of records per page
//     const skip = (page - 1) * limit;

//     // Setup date filters
//     const dateFilter = {};
//     if (datestart && dateend) {
//       dateFilter.date = { $gte: datestart, $lte: dateend };
//     } else if (datestart) {
//       dateFilter.date = { $gte: datestart };
//     } else if (dateend) {
//       dateFilter.date = { $lte: dateend };
//     }

//     // Setup search query
//     const query = {};
//     if (search) {
//       query.$or = [{ "userId.full_name": { $regex: new RegExp(search, "i") } }, { date: { $regex: new RegExp(search, "i") } }];
//     }

//     // Fetch attendance records based on filters
//     const attendanceRecords = await SE_Attendance.find({ ...dateFilter, ...query })
//       .sort({ datetime: -1 }) // Sort by datetime in ascending order
//       .populate("userId", "full_name") // Populate user details by userId and include only the name field
//       .populate({
//         path: "site_id",
//         select: "working_hrs _id",
//       })
//       .skip(skip)
//       .limit(limit);

//     // Get total count of matching attendance records
//     const totalCount = await SE_Attendance.countDocuments({ ...dateFilter, ...query });
//     const modifiedRecords = attendanceRecords.map((record) => ({
//       ...record._doc,
//       picIn: baseURL + record.picIn,
//       picOut: baseURL + record.picOut,
//     }));

//     // Prepare response
//     res.json({
//       totalCount: totalCount,
//       attendanceRecords: modifiedRecords,
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

// edit by Atest 07/01/25
exports.getAllSEAttendance = async (req, res) => {
  try {
    let { page = 1, search = "", datestart, dateend } = req.body;
    const limit = 1000;
    const skip = (page - 1) * limit;

    // Setup date filter
    const dateFilter = {};
    if (datestart && dateend) {
      const formattedStart = moment(datestart, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");
      const formattedEnd = moment(dateend, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");

      if (formattedStart === formattedEnd) {
        dateFilter.date = formattedStart;
      } else {
        dateFilter.date = { $gte: formattedStart, $lte: formattedEnd };
      }
    } else if (datestart) {
      const formattedStart = moment(datestart, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");
      dateFilter.date = { $gte: formattedStart };
    } else if (dateend) {
      const formattedEnd = moment(dateend, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");
      dateFilter.date = { $lte: formattedEnd };
    }
    
    // Setup main query
    const query = {
      entry: { $regex: /^(in|out)$/i }, // Only "in" or "out" entries
    };

    // If search is provided, add search filters
    if (search) {
      query.$or = [{ "userId.full_name": { $regex: new RegExp(search, "i") } }, { date: { $regex: new RegExp(search, "i") } }];
    }
    
    // Fetch filtered attendance records
    const attendanceRecords = await SE_Attendance.find({ ...dateFilter, ...query })
      .sort({ datetime: -1 }) // Sort by latest first
      .populate("userId", "full_name")
      .populate({
        path: "site_id",
        select: "working_hrs _id",
      })
      .skip(skip)
      .limit(limit);

    // Get total count
    const totalCount = await SE_Attendance.countDocuments({ ...dateFilter, ...query });

    // Format image URLs
    const modifiedRecords = attendanceRecords.map((record) => ({
      ...record._doc,
      picIn: baseURL + record.picIn,
      picOut: baseURL + record.picOut,
    }));

    // Send response
    res.json({
      totalCount,
      attendanceRecords: modifiedRecords,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

// exports.getAllSVAttendance = async (req, res) => {
//   try {
//     let { page = 1, search = "", datestart, dateend } = req.body;
//     const limit = 1000; // Number of records per page
//     const skip = (page - 1) * limit;

//     // Setup date filters
//     const dateFilter = {};
//     if (datestart && dateend) {
//       dateFilter.date = { $gte: datestart, $lte: dateend };
//     } else if (datestart) {
//       dateFilter.date = { $gte: datestart };
//     } else if (dateend) {
//       dateFilter.date = { $lte: dateend };
//     }

//     // Setup search query
//     const query = {};
//     if (search) {
//       query.$or = [{ "userId.full_name": { $regex: new RegExp(search, "i") } }, { date: { $regex: new RegExp(search, "i") } }];
//     }

//     // Fetch attendance records based on filters
//     const attendanceRecords = await SV_Attendance.find({ ...dateFilter, ...query })
//       .sort({ datetime: 1 }) // Sort by datetime in ascending order
//       .populate("userId", "full_name") // Populate user details by userId and include only the name field
//       .populate({
//         path: "site_id",
//         select: "working_hrs _id",
//         match: { role: "supervisor" },
//       })
//       .skip(skip)
//       .limit(limit);

//     // Get total count of matching attendance records
//     const totalCount = await SV_Attendance.countDocuments({ ...dateFilter, ...query });

//     const modifiedRecords = attendanceRecords.map((record) => ({
//       ...record._doc,
//       picIn: baseURL + record.picIn,
//       picOut: baseURL + record.picOut,
//     }));

//     // Prepare response
//     res.json({
//       totalCount: totalCount,
//       attendanceRecords: modifiedRecords,
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

exports.getAllSVAttendance = async (req, res) => {
  try {
    let { page = 1, search = "", datestart, dateend } = req.body;
    const limit = 1000; // Number of records per page
    const skip = (page - 1) * limit;

    
   // Setup date filter
    const dateFilter = {};
    if (datestart && dateend) {
      const formattedStart = moment(datestart, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");
      const formattedEnd = moment(dateend, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");

      if (formattedStart === formattedEnd) {
        dateFilter.date = formattedStart;
      } else {
        dateFilter.date = { $gte: formattedStart, $lte: formattedEnd };
      }
    } else if (datestart) {
      const formattedStart = moment(datestart, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");
      dateFilter.date = { $gte: formattedStart };
    } else if (dateend) {
      const formattedEnd = moment(dateend, ["MM/DD/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"]).format("DD/MM/YYYY");
      dateFilter.date = { $lte: formattedEnd };
    }
    // Setup search query
    const query = {};
    if (search) {
      query.$or = [{ "userId.full_name": { $regex: new RegExp(search, "i") } }, { date: { $regex: new RegExp(search, "i") } }];
    }

    // Fetch attendance records with proper population
    const attendanceRecords = await SV_Attendance.find({ ...dateFilter, ...query })
      .sort({ datetime: 1 }) // Sort by datetime in ascending order
      .populate("userId", "full_name") // Populate user details by userId
      .populate({
        path: "site_id",
        select: "working_hrs _id", // Include relevant fields
      })
      .skip(skip)
      .limit(limit);

    // Get total count of matching attendance records
    const totalCount = await SV_Attendance.countDocuments({ ...dateFilter, ...query });

    // Modify records for response
    const modifiedRecords = attendanceRecords.map((record) => ({
      ...record._doc,
      picIn: baseURL + record.picIn,
      picOut: baseURL + record.picOut,
    }));

    // Send response
    res.json({
      totalCount,
      attendanceRecords: modifiedRecords,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};




exports.getUserNameMail = async (req, res) => {
  const { type } = req.body;
  try {
    // Query the database to find users with the role 'super_engineer' and whose site_id is an empty array,
    // and select only 'full_name' and '_id'

    let user;

    if (type === "shifting") {
      user = await UserModel.find({ role: "super_engineer" }).select("full_name _id");
    } else {
      user = await UserModel.find().select("full_name _id");
    }

    // Respond with the retrieved data
    res.status(200).json({ User: user });
  } catch (error) {
    console.error("Error fetching super engineers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSiteEditData = async (req, res) => {
  const { siteId } = req.body;

  try {
    const site = await SiteModel.findById(siteId);

    // Filter products to include only those with deleted_at: false
    site.product = site.product.filter((product) => !product.deleted_at);

    // Populate filtered products
    await SiteModel.populate(site, {
      path: "product._id",
      select: "product_name",
      model: "Product",
    });
    if (!site) {
      return res.status(200).json({
        message: "Site Not Found",
        status: false,
      });
    }

    // Prepend baseURL to contractfile paths
    if (site.contractfile) {
      site.contractfile = site.contractfile.map((file) => baseURL + file);
    }

    // Change date format
    if (site.start_date) {
      site.start_date = moment(site.start_date, "D/M/YYYY").format("YYYY/MM/DD");
    }
    if (site.end_date) {
      site.end_date = moment(site.end_date, "D/M/YYYY").format("YYYY/MM/DD");
    }

    const firstSiteId = siteId.toString();
    // Find user IDs associated with this site_id
    let userIds = await UserModel.aggregate([
      {
        $match: {
          site_id: { $in: [firstSiteId] }, // Match site_id array containing siteIdObject
          role: "super_engineer",
        },
      },
      {
        $project: {
          _id: 1, // Include only the _id field
          full_name: 1,
        },
      },
    ]);

    //userIds = userIds.map((user) => user._id); // Extract only the _id values

    res.json({
      site: site,
      userIds: userIds, // Return user IDs associated with the site
      status: true,
    });
  } catch (error) {
    console.error("GetSiteEditData API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.DeleteProductBySite = async (req, res) => {
  const { site_id, product_id } = req.body;

  try {
    // साइट को साइट ID के आधार पर खोजें
    const site = await SiteModel.findById(site_id);

    if (!site) {
      return res.status(404).json({
        message: "Site Not Found",
        status: false,
      });
    }

    // उत्पाद को प्रोडक्ट ID के आधार पर खोजें और अपडेट करें
    const productIndex = site.product.findIndex((product) => product._id.toString() === product_id);

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product Not Found",
        status: false,
      });
    }

    // प्रोडक्ट के 'deleted_at' फ़ील्ड को true पर सेट करें
    site.product[productIndex].deleted_at = true;

    // साइट को सहेजें
    await site.save();

    const productReport = await ProductReport.findOne({ site_id, product_id });
    if (productReport) {
      const reportModel = await ReportModel.findOne({ site_id: site_id });
      if (reportModel) {
        // Remove the product's _id from the product_report_id array
        const productReportId = productReport._id;
        // Remove the product's _id from the product_report_id array using productReport._id
        reportModel.product_report_id = reportModel.product_report_id.filter((id) => !id.equals(productReportId));
        // Save the updated report model
        await reportModel.save();
      }

      // Remove the ProductReport document
      await ProductReport.deleteOne({ _id: productReport._id });
    }

    res.status(200).json({
      message: "Product marked as deleted",
      status: true,
    });
  } catch (error) {
    console.error("DeleteProductBySite API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
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

    const main_report = await ReportModel.findById(report_id);

    if (!main_report) {
      return res.status(404).json({ message: "Report not found" });
    }
    const currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");

    // Step 2: Update the all_data_submit field to true
    // main_report.userId = user_id;
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

exports.EditImages = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading images", error: err.message });
    }

    const { site_id, product_id, product_report_id, solution, problem_id, problem_covered } = req.body;
    //console.log(req);
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

exports.Editvalue = async (req, res) => {
  const { site_id, product_id, product_report_id, current_value } = req.body;

  try {
    // Step 1: Find the Product_Report document
    const productReport = await getProductReportDetails(site_id, product_id, product_report_id);

    if (!productReport) {
      return res.status(404).json({ message: "Product report not found" });
    }

    // Step 2: Fetch the Product details to validate current_value
    const product = await ProductModel.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 3: Validate current_value against parameter_min and parameter_max
    const { parameter_min, parameter_max } = product;
    const param_min = Number(parameter_min);
    const param_max = Number(parameter_max);
    const curr_value = Number(current_value);

    if (curr_value < param_min || curr_value > param_max) {
      return res.status(200).json({
        message: `Value must be between ${param_min} and ${param_max}`,
        status: false,
      });
    }

    // Step 4: Update the current_value
    productReport.current_value = current_value;

    // Step 5: Save the updated Product_Report
    const updatedProductReport = await productReport.save();

    // Step 6: Find all Reports that reference this Product_Report
    const reports = await ReportModel.find({ product_report_id: updatedProductReport._id });

    // Extracting just the _id from each report
    const reportIds = reports.map((report) => report._id);

    // Respond with the updated product_report and main_report_id
    res.status(200).json({
      message: "Value updated successfully",
      status: true,
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

async function ReportSend(ReportId, email, type) {
  let sendmail;

  if (type == "Daily") {
    const report = await ReportModel.findByIdAndUpdate(ReportId, { mail_send: true }, { new: true });
    if (!report) {
      return { message: "Report not found", status: false };
    }
    const sitesdata = await ReportMailSend(ReportId);
    sendmail = SendMail({
      recipientEmail: email,
      subject: "Daily Product Report Update",
      html: ReportTemplate(sitesdata),
    });
  } else if (type == "Maintenance") {
    const report = await MaintenanceReport.findByIdAndUpdate(ReportId, { mail_send: true }, { new: true });
    if (!report) {
      return { message: "Maintenance Report not found", status: false };
    }
    const sitesdata = await MaintenanceReportMailSend(ReportId);
    sendmail = SendMail({
      recipientEmail: email,
      subject: "Maintenance Product Report Update",
      html: MaintenanceReportTemplate(sitesdata),
    });
  }

  return { message: sendmail, status: true };
}

exports.Reportverified = async (req, res) => {
  const { report_id, Type, report_type } = req.body;
  const userId = req.headers.userID;
  const updatedReport = await ReportModel.findOne({ _id: report_id });

  if (!updatedReport) {
    return res.status(404).json({ message: "Report not found" });
  }

  const verified_type = Type === "Admin" ? "verified_adminId" : "verified_userId";

  updatedReport.verified_status = true;
  updatedReport[verified_type] = userId; // Corrected line
  updatedReport.verified_user = Type;
  updatedReport.mail_send = true;

  const savedReport = await updatedReport.save();

  const sitedata = await SiteModel.findOne({ _id: updatedReport.site_id });
  const clientdata = await ClientModel.findOne({ _id: sitedata.client_id });

  const ReportSends = await ReportSend(report_id, clientdata.clientEmail, report_type);

  return res.status(200).json({ updatedReport: savedReport, message: "Report Verified successfully" });
};

// comment by Atest 06/05/2025

// async function ReportMailSend(ReportId) {
//   const sitesdata = await ReportModel.findById(ReportId)
//     .populate({
//       path: "site_id",
//     })
//     .populate({
//       path: "product_report_id",
//       populate: [
//         { path: "user_id", select: "full_name" },
//         { path: "problem_id", select: "problem" },
//         { path: "product_id", select: "product_name parameter_min parameter_max" },
//       ],
//     });

//   // Populate Product details and update images URLs
//   const updatedProducts = sitesdata.product_report_id.map((product) => {
//     // Modify images array to include baseURL
//     const updatedImages = [product.image_0, product.image_1, product.image_2].map((image) => baseURL + image);

//     // Return updated product object
//     return {
//       ...product.toObject(),
//       images: updatedImages,
//       product_name: product.product_id ? product.product_id.product_name : "",
//       parameter_min: product.product_id ? product.product_id.parameter_min : "",
//       parameter_max: product.product_id ? product.product_id.parameter_max : "",
//       problem_name: product.problem_id ? product.problem_id.problem : "",
//       user_name: product.user_id ? product.user_id.full_name : "Not Verified",
//     };
//   });

//   const notWorkingProducts = updatedProducts
//     .filter((product) => product.working_status === "not_working")
//     .map((product) => {
//       const { image_0, image_1, image_2, ...rest } = product;
//       return rest;
//     });

//   const workingProducts = updatedProducts.filter((product) => product.working_status === "working_ok");

//   const sitedata = {
//     ...sitesdata.toObject(),
//     notWorkingProducts,
//     workingProducts,
//   };

//   // Remove `product_report_id` and `product` array from `site_id`
//   delete sitedata.product_report_id;
//   delete sitedata.site_id.product;

//   return sitedata;
// }

// edit by AAtest 06/05/2025

async function ReportMailSend(ReportId) {
  const sitesdata = await ReportModel.findById(ReportId)
    .populate({
      path: "site_id",
      populate: [{ path: "product._id", select: "product_quantity used_quantity" }],
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
    const matchedProduct = siteProducts.find((siteProduct) => siteProduct._id && product.product_id && siteProduct._id._id.toString() === product.product_id._id.toString());

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

  const notWorkingProducts = updatedProducts.filter((product) => product.working_status === "not_working").map(({ image_0, image_1, image_2, ...rest }) => rest);

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

exports.DeactiveUser = async (req, res) => {
  const { userId, stutas } = req.body; // Assuming userId is passed in the request body
  const adminId = req.headers.userID;
  try {
    // Find the user by userId
    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const result = await UserModel.updateOne({ _id: userId }, { $set: { deactive_status: stutas } });
    // Respond with updated user

    const active = "Your account has been activated by an administrator.";
    const deactive = "Your account has been deactivated by an administrator. Please contact support for assistance.";

    if (stutas) {
      const type = "User_active_status";
      const title = "Admin Update";
      const message = deactive;
      createNotification(adminId, user._id, title, message, type);
    } else {
      const type = "User_active_status";
      const title = "Admin Update";
      const message = active;
      createNotification(adminId, user._id, title, message, type);
    }

    res.status(200).json({ message: "User deactivated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.TerminationUser = async (req, res) => {
  const { userId, status } = req.body;
  const adminId = req.headers.userID;
  try {
    // Find the user by userId
    let user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user.role);
    const currentDate = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
    if (user.role == "supervisor") {
      await UserModel.updateOne({ _id: userId }, { $set: { termination: status, deleted_at: currentDate, site_id: [] } });

      if (status) {
        const terminatedmessage = "The administrator has terminated you. Please check your mail account.";
        const type = "User_active_status";
        const title = "Admin Update";
        const message = terminatedmessage;
        createNotification(adminId, user._id, title, message, type);
      } else {
        const terminatedmessage = "The administrator has reactivated your account. Please check your email for more details.";
        const type = "User_active_status";
        const title = "Admin Update";
        const message = terminatedmessage;
        createNotification(adminId, user._id, title, message, type);
      }

      res.status(200).json({ message: "User termination status updated successfully", useremail });
    } else {
      useremail = await UserModel.findById(userId).select("full_name email deleted_at").populate({
        path: "site_id",
        select: "site_name location_name _id client_id",
      });
    }

    let clientdata = await ClientModel.findById(useremail.site_id[0].client_id);

    const firstSiteId = user.site_id[0].toString();
    let usersWithSameSiteId = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: new ObjectId(userId) }, // Exclude the current user
          site_id: { $in: [firstSiteId] }, // Match site_id array containing siteIdObject
        },
      },
    ]);

    await SendMail({
      recipientEmail: useremail.email,
      subject: "Termination of letter",
      html: TerminationTemplate(useremail),
    });

    if (clientdata.clientEmail) {
      await SendMail({
        recipientEmail: clientdata.clientEmail,
        subject: `Notification of User Termination ${useremail.full_name}`,
        html: TerminationClientTemplate(useremail),
      });
    }

    if (usersWithSameSiteId) {
      for (let userData of usersWithSameSiteId) {
        await SendMail({
          recipientEmail: userData.email,
          subject: `${useremail.full_name} Terminated from Position`,
          html: TerminationColleaguesTemplate(useremail),
        });
      }
    }

    if (user.role == "super_engineer") {
      let sitemailData = await SiteModel.findById(user.site_id[0]);
      let clientmailData = await ClientModel.findById(sitemailData.client_id);
      await SendMail({
        recipientEmail: clientmailData.clientEmail,
        subject: "Termination of letter",
        html: TerminationTemplate(useremail),
      });
    }

    if (status) {
      const firstSiteId = user.site_id[0].toString();
      let usersWithSameSiteId = await UserModel.aggregate([
        {
          $match: {
            _id: { $ne: new ObjectId(userId) }, // Exclude the current user
            site_id: { $in: [firstSiteId] }, // Match site_id array containing siteIdObject
          },
        },
      ]);

      for (let userData of usersWithSameSiteId) {
        await SendMail({
          recipientEmail: userData.email,
          subject: "Termination of letter",
          html: TerminationTemplate(useremail),
        });
      }
    }

    await UserModel.updateOne({ _id: userId }, { $set: { termination: status, deleted_at: currentDate, site_id: [] } });

    if (status) {
      const terminatedmessage = "The administrator has terminated you. Please check your mail account.";
      const type = "User_active_status";
      const title = "Admin Update";
      const message = terminatedmessage;
      createNotification(adminId, user._id, title, message, type);
    } else {
      const terminatedmessage = "The administrator has reactivated your account. Please check your email for more details.";
      const type = "User_active_status";
      const title = "Admin Update";
      const message = terminatedmessage;
      createNotification(adminId, user._id, title, message, type);
    }

    res.status(200).json({ message: "User termination status updated successfully", useremail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// comment by Atest 13/05/2025

// exports.UserSiteShifting = async (req, res) => {
//   const { userId, site_id } = req.body; // Assuming userId is passed in the request body
//   try {
//     // Find the user by userId
//     let user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Find the old and new sites
//     const oldsite = await SiteModel.findById(user.site_id[0]).select("site_name location_name client_id");
//     const newsite = await SiteModel.findById(site_id).select("site_name location_name");
//     const clientdata = await ClientModel.findById(oldsite.client_id);

//     // Get the current date and calculate the date 42 hours later
//     const currentDate = moment().tz("Asia/Kolkata");
//     const date42HoursLater = currentDate.clone().add(42, "hours");

//     // Format the dates as needed
//     const formattedCurrentDate = currentDate.format("DD-MM-YYYY");

//     // Add the 42 hours to the user's join date
//     const userJoinDate = moment(user.join_date).tz("Asia/Kolkata");
//     const newJoinDate = userJoinDate.clone().add(42, "hours").format("DD-MM-YYYY");

//     const siteAllotments = await SiteAllotment.find({
//       site_id: { $in: [site_id] }, // Check if site_id exists in the site_id array of SiteAllotment
//       date: { $gte: currentDate.format("DD/MM/YYYY") }, // Filter for future dates or current date
//     }).populate({
//       path: "user_id",
//       select: "full_name mobile _id",
//     });

//     // Prepare response data
//     const response = {
//       presentsite: oldsite,
//       newsite: newsite,
//       currentDate: formattedCurrentDate,
//       newJoinDate: newJoinDate,
//       supervisor: siteAllotments.map((allotment) => ({
//         _id: allotment.user_id._id,
//         full_name: allotment.user_id.full_name,
//         mobile: allotment.user_id.mobile,
//       })),
//       service_engineer: user.full_name,
//     };

//     const firstSiteId = user.site_id[0].toString();
//     let usersWithSameSiteId = await UserModel.aggregate([
//       {
//         $match: {
//           _id: { $ne: new ObjectId(userId) }, // Exclude the current user
//           site_id: { $in: [firstSiteId] }, // Match site_id array containing siteIdObject
//         },
//       },
//     ]);

//     SendMail({
//       recipientEmail: user.email,
//       subject: "Your inter Site transfer Letter",
//       html: SiteShifitingTemplate(response),
//     });

//     SendMail({
//       recipientEmail: clientdata.clientEmail,
//       subject: "Service Engineer Transfer Notification",
//       html: SiteShifitingClientTemplate(response),
//     });

//     if (usersWithSameSiteId) {
//       for (let userData of usersWithSameSiteId) {
//         await SendMail({
//           recipientEmail: userData.email,
//           subject: "Service Engineer Transfer Notification",
//           html: SiteShifitingColleaguesTemplate(response),
//         });
//       }
//     }

//     await UserModel.updateOne({ _id: userId }, { $set: { site_id: [] } });
//     await UserModel.updateOne({ _id: userId }, { $set: { site_id: site_id } });

//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// edit byb Atest 13/05/2025

exports.UserSiteShifting = async (req, res) => {
  const { userId, site_id } = req.body;

  try {
    // Find the user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find old site and new site
    const oldsite = await SiteModel.findById(user.site_id[0]).select("site_name location_name client_id");
    const newsite = await SiteModel.findById(site_id).select("site_name location_name client_id");

    // Get client data for old and new site
    const oldClientData = await ClientModel.findById(oldsite.client_id);
    const newClientData = await ClientModel.findById(newsite.client_id);

    // Time-related calculations
    const currentDate = moment().tz("Asia/Kolkata");
    const formattedCurrentDate = currentDate.format("DD-MM-YYYY");

    const userJoinDate = moment(user.join_date).tz("Asia/Kolkata");
    const newJoinDate = userJoinDate.clone().add(42, "hours").format("DD-MM-YYYY");

    // Get supervisors for new site
    const siteAllotments = await SiteAllotment.find({
      site_id: { $in: [site_id] },
      date: { $gte: currentDate.format("DD/MM/YYYY") },
    }).populate({
      path: "user_id",
      select: "full_name mobile _id",
    });

    // Prepare email/template response data
    const response = {
      presentsite: oldsite,
      newsite: newsite,
      currentDate: formattedCurrentDate,
      newJoinDate: newJoinDate,
      supervisor: siteAllotments.map((allotment) => ({
        _id: allotment.user_id._id,
        full_name: allotment.user_id.full_name,
        mobile: allotment.user_id.mobile,
      })),
      service_engineer: user.full_name,
    };

    // Get other users from the old site
    const firstSiteId = user.site_id[0].toString();
    const usersWithSameSiteId = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: new ObjectId(userId) },
          site_id: { $in: [firstSiteId] },
        },
      },
    ]);

    // Send mail to service engineer
    await SendMail({
      recipientEmail: user.email,
      subject: "Your Inter Site Transfer Letter",
      html: SiteShifitingTemplate(response),
    });

    // Send mail to old site client
    await SendMail({
      recipientEmail: oldClientData.clientEmail,
      subject: "Service Engineer Transfer Notification",
      html: SiteShifitingClientTemplate(response),
    });

    // Send mail to colleagues at old site
    for (const userData of usersWithSameSiteId) {
      await SendMail({
        recipientEmail: userData.email,
        subject: "Service Engineer Transfer Notification",
        html: SiteShifitingColleaguesTemplate(response),
      });
    }

    // Send mail to new site client
    await SendMail({
      recipientEmail: newClientData.clientEmail,
      subject: "New Service Engineer Assigned",
      html: NewSiteClientTemplate(response),
    });

    // Update user's site
    await UserModel.updateOne({ _id: userId }, { $set: { site_id: [site_id] } });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.UserwarningMail = async (req, res) => {
  const { userId } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const currentDate = moment().tz("Asia/Kolkata");
  const formattedCurrentDate = currentDate.format("DD-MM-YYYY");

  const response = {
    currentDate: formattedCurrentDate,
    full_name: user.full_name,
  };
  SendMail({
    recipientEmail: user.email,
    subject: "Warning Letter",
    html: WarningTemplate(response),
  });

  res.status(200).json({ message: "Warning Mail Send Succesfully" });
};

const storagemail = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/festival");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = generateRandomTimestamp();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const uploadmail = multer({ storage: storagemail }).fields([{ name: "image", maxCount: 1 }]);

exports.UserfestivelMail = async (req, res) => {
  uploadmail(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading images", error: err.message });
    }
    const { HtmlData, festivalheading } = req.body;

    let imagePath;
    if (req.files) {
      imagePath = `${baseURL}${req.files.image[0].path}`;
    } else {
      imagePath = null;
    }

    const response = {
      festivalheading: festivalheading,
      image: imagePath,
      HtmlData: HtmlData,
    };

    const activeUsers = await UserModel.find({ termination: false, deactive_status: false });
    const clientUsers = await ClientModel.find();

    for (const client of clientUsers) {
      // Send email to client's primary email
      await SendMail({
        recipientEmail: client.clientEmail,
        subject: festivalheading,
        html: FestivelTemplate(response),
      });

      // Send emails to each email in client's emailData
      for (const email of client.emailData) {
        await SendMail({
          recipientEmail: email.email,
          subject: festivalheading,
          html: FestivelTemplate(response),
        });
      }
    }
    for (const user of activeUsers) {
      await SendMail({
        recipientEmail: user.email,
        subject: festivalheading,
        html: FestivelTemplate(response),
      });
      await delay(3000); // Delay for 1 second
    }

    res.status(200).json({ message: "festival Send Succesfully" });
  });
};

exports.leaveApplicationGet = async (req, res) => {
  const { page = 1 } = req.body;
  const perPage = 10; // Adjust this according to your requirements

  const sortCriteria = { _id: -1 };

  const reasonMap = {
    sickness: "Sickness",
    urgent_work: "Urgent Work",
    family_issue: "Family Issues",
    family_event: "Family Event",
  };

  try {
    const leaveApplications = await leaveApplicationModel
      .find()
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "userID",
        select: "full_name _id",
      });

    let i = 0;
    // Map the reasons
    const mappedLeaveApplications = leaveApplications.map((app) => {
      const mappedApp = app.toObject();
      i++;
      mappedApp.reason = reasonMap[app.reason] || app.reason;
      mappedApp.orderId = i;
      return mappedApp;
    });

    const totalCount = await leaveApplicationModel.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: mappedLeaveApplications,
      first_page_url: `${process.env.BASE_URL}api/leaveApplicationGet?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${process.env.BASE_URL}api/leaveApplicationGet?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${process.env.BASE_URL}api/leaveApplicationGet?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: null,
      path: `${process.env.BASE_URL}api/leaveApplicationGet`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + mappedLeaveApplications.length,
      total: totalCount,
    };

    res.json({
      LeaveApplications: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.resignationApplicationGet = async (req, res) => {
  const { page = 1 } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  const sortCriteria = { _id: -1 };

  const reasonMap = {
    new_job: "New job",
    personal_reasons: "Personal reasons",
    relocation: "Relocation",
    health_issues: "Health issues",
  };

  try {
    const resignationApplications = await ResignationApplicationModel.find()
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "userID",
        select: "full_name _id",
      });

    let i = 0;
    const mappedresignationApplications = resignationApplications.map((app) => {
      const mappedApp = app.toObject();
      i++;
      mappedApp.reason = reasonMap[app.reason] || app.reason;
      mappedApp.orderId = i;
      return mappedApp;
    });

    const totalCount = await ResignationApplicationModel.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: mappedresignationApplications,
      first_page_url: `${process.env.BASE_URL}api/resignationApplicationGet?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${process.env.BASE_URL}api/resignationApplicationGet?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${process.env.BASE_URL}api/resignationApplicationGet?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: null,
      path: `${process.env.BASE_URL}api/resignationApplicationGet`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + mappedresignationApplications.length,
      total: totalCount,
    };

    res.json({
      ResignationApplications: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.leaveApplicationdata = async (req, res) => {
  try {
    const { leaveApplicationId } = req.body;

    const leaveApplicationDetails = await leaveApplicationModel.findOne({ _id: leaveApplicationId });

    const user = await UserModel.findOne({ _id: leaveApplicationDetails.userID });

    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    let messag;
    if (leaveApplicationDetails.reason == "family_event") {
      messag = `I am writing to formally request leave from work for the period starting from ${leaveApplicationDetails.start_date} to ${leaveApplicationDetails.end_date}. The reason for my leave is a family event.`;
    } else if (leaveApplicationDetails.reason == "sickness") {
      messag = `I am writing to formally request leave from work for the period starting from ${leaveApplicationDetails.start_date} to ${leaveApplicationDetails.end_date}. The reason for my leave is due to sickness.`;
    } else if (leaveApplicationDetails.reason == "urgent_work") {
      messag = `I am writing to formally request leave from work for the period starting from ${leaveApplicationDetails.start_date} to ${leaveApplicationDetails.end_date}. The reason for my leave is due to urgent work.`;
    } else if (leaveApplicationDetails.reason == "family_issue") {
      messag = `I am writing to formally request leave from work for the period starting from ${leaveApplicationDetails.start_date} to ${leaveApplicationDetails.end_date}. The reason for my leave is a family issue.`;
    }

    const response = {
      user: user,
      formattedDate: formattedDate,
      leaveApplicationData: leaveApplicationDetails,
      messag: messag,
    };

    res.status(201).json({
      status: true,
      message: "Leave application Get successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error submitting leave application:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.ResignationApplicationdata = async (req, res) => {
  try {
    const { resignationApplicationId } = req.body;
    // Create a new leave application instance

    const resignationApplicationDetails = await ResignationApplicationModel.findOne({ _id: resignationApplicationId });

    const user = await UserModel.findOne({ _id: resignationApplicationDetails.userID });

    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    const displayRole = user.role === "super_engineer" ? "Service Engineer" : user.role === "supervisor" ? "Supervisor" : user.role;

    let resignationMessage;
    switch (resignationApplicationDetails.reason) {
      case "new_job":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${resignationApplicationDetails.last_date_working}. The reason for my resignation is that I have accepted a new job opportunity.`;
        break;
      case "personal_reasons":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${resignationApplicationDetails.last_date_working}. The reason for my resignation is personal reasons.`;
        break;
      case "relocation":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${resignationApplicationDetails.last_date_working}. The reason for my resignation is relocation.`;
        break;
      case "health_issues":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${resignationApplicationDetails.last_date_working}. The reason for my resignation is health issues.`;
        break;
      default:
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${resignationApplicationDetails.last_date_working}.`;
    }

    const response = {
      user: user,
      formattedDate: formattedDate,
      leaveApplicationData: resignationApplicationDetails,
      messag: resignationMessage,
    };

    res.status(201).json({
      status: true,
      message: "Resignation application Get successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error submitting leave application:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.getSelfieDetails = async (req, res) => {
  try {
    // Fetch selfies with the populated user and site information
    const selfies = await SV_Selfie.find().populate({ path: "userId", select: "full_name" }).populate({ path: "site_id", select: "site_name" }).select("pic userId site_id datetime");

    // Sort selfies by datetime manually
    selfies.sort((a, b) => {
      const dateA = moment(a.datetime, "DD-MM-YYYY HH:mm:ss").toDate();
      const dateB = moment(b.datetime, "DD-MM-YYYY HH:mm:ss").toDate();
      return dateB - dateA; // Sorting in descending order
    });

    // Add baseURL to pic
    const response = selfies.map((selfie) => ({
      _id: selfie._id,
      pic: selfie.pic ? baseURL + selfie.pic : null,
      datetime: selfie.datetime, // Use datetime as is
      userId: selfie.userId,
      site_id: selfie.site_id,
    }));

    // Send successful response with data
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching selfie details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch selfie details",
    });
  }
};

exports.deleteSelfie = async (req, res) => {
  try {
    const { selfieId } = req.params; // Get the selfie ID from the request parameters

    // Find the selfie by its ID to check the image path before deleting
    const selfie = await SV_Selfie.findById(selfieId);

    // If the selfie doesn't exist, return an error
    if (!selfie) {
      return res.status(404).json({
        success: false,
        message: "Selfie not found",
      });
    }

    // If the selfie has a pic field and the image exists, delete the image
    if (selfie.pic) {
      const imagePath = path.join(__dirname, "..", "uploads", "Selfie", selfie.pic); // Adjust the path based on your directory structure
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Deletes the image file
      }
    }

    // Delete the selfie document
    await SV_Selfie.findByIdAndDelete(selfieId);

    // Return a success response
    res.status(200).json({
      success: true,
      message: "Selfie and image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting selfie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete selfie",
    });
  }
};
