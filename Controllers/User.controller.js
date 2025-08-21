const UserModel = require("../Models/User.model");
const { Admin_Model } = require("../Models/Admin.model");
const { generateToken, blacklistToken } = require("../Config/generateToken.js");
const { leaveApplicationModel, ResignationApplicationModel } = require("../Models/leaveApplication.model");
const { NotificationMessages } = require("../Models/Notification.model");
const cookie = require("cookie");
const { uploadImagesProfile } = require("../Config/imageuplaode");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer({ storage: uploadImagesProfile });
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const profile_Upload_Dir = "./uploads/profile";
var multiparty = require("multiparty");
const path = require("path");
const fs = require("fs");
const baseURL = process.env.BASE_URL;
const { sendMail, generatePdf } = require("../Config/usermail.js");
const { leaveApplicationTemplate } = require("../Config/Template/leaveApplication.js");
const { ResignationApplicationTemplate } = require("../Config/Template/resignationApplication.js");
const axios = require("axios");
const qs = require('qs');
const { response } = require("express");
function generateOTP() {
  const min = 1000; // Minimum 4-digit number
  const max = 9999; // Maximum 4-digit number

  // Generate a random number between min and max (inclusive)
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp.toString(); // Convert the number to a string
}

function TextLocalApi(mobile, name, otp) {
  // Static message to be sent
  // const message = otp;

  const apiKey = process.env.TEXTLOCAL_API; // TextLocal API Key
  const sender = process.env.TEXTLOCAL_HEADER; // Sender name
  const number = `91+${mobile}`; // Recipient's mobile number
  const message = `Dear ${name}, Your OTP is ${otp}. Please do not share this with anyone.%nThank you, Evergreen` 
  // Constructing the URL for the API request
  const url = `http://api.textlocal.in/send/?apiKey=${apiKey}&sender=${sender}&numbers=${number}&message=${encodeURIComponent(message)}`;
  
  const sendSms = async () => {
    try {
      const response = await axios.post(url);
      // console.log("TextLocal API Response Data:", response.data); // Check the actual data
  
      return response.data; // Ensure it returns data
    } catch (error) {
      console.error("Error sending SMS:", error.message); // Log any errors
    }
  };

  sendSms(); // Call the sendSms function to send the message
}



// Example usage
// const mobileNumber = '917049866959'; // Replace with the recipient's mobile number
// const name = 'John Doe'; // Replace with the recipient's name
// const otp = '1234'; // OTP to send

// TextLocalApi(mobileNumber, name, otp); // Send the OTP


exports.getUser = async (req, res) => {
  const userId = req.headers.userID;
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        status: false,
      });
    }

    res.json({
      user: user,
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

exports.login = async (req, res) => {
  const { mobile, password, deviceId, firebase_token } = req.body;
  const userdata = await UserModel.findOne({ mobile: mobile });
  //console.log(userdata.pic);

  if (!userdata) {
    res.status(404).json({
      message: "User Not Found",
      status: false,
    });
    return;
  }

  if ("1111111110" !== mobile) {
    if (userdata.deviceId !== deviceId) {
      res.status(404).json({
        message: "Device Id Not Match",
        status: false,
      });
      return;
    }
  }

  if (userdata.otp_verified === 0) {
    const otp = generateOTP();
    const type = "Signup";
    const full_name = userdata.full_name;
    TextLocalApi(mobile, full_name, otp);
    const result = await UserModel.updateOne({ _id: userdata._id }, { $set: { otp: otp } });
    res.status(404).json({
      message: "OTP Not verified",
      status: true,
    });
    return;
  }

  if (userdata.role == null) {
    res.status(404).json({
      message: "Admin has not activated you yet",
      status: false,
    });
    return;
  }

  if (userdata.deactive_status) {
    res.status(404).json({
      message: "Admin has Deactive you please contact admin",
      status: false,
    });
    return;
  }

  if (userdata.termination) {
    res.status(404).json({
      message: "Admin has terminate you please contact admin",
      status: false,
    });
    return;
  }

  const isPasswordMatch = await userdata.matchPassword(password);

  if (!isPasswordMatch) {
    res.status(404).json({
      message: "Invalid Password",
      status: false,
    });
    return;
  }

  if (firebase_token) {
    await userdata.updateOne({ $set: { firebase_token: firebase_token } });
  }

  const token = jwt.sign({ _id: userdata._id, role: userdata.role }, process.env.JSON_SECRET);
  // Set the token in a cookie for 30 days

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("Websitetoken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
      path: "/",
    })
  );

  res.status(200).json({
    userdata,
    token,
    status: true,
  });
};

exports.logoutUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract token from "Bearer {token}"

    blacklistToken(token);

    // Expire the cookie immediately
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("Websitetoken", "", {
        httpOnly: false,
        expires: new Date(0),
        path: "/",
      })
    );

    res.json({ message: "Logout successful", status: true });
  } else {
    res.status(500).json({ message: "Invalid token", status: false });
  }
};

exports.registerUser = async (req, res) => {
  const form = new multiparty.Form({ uploadDir: profile_Upload_Dir });
  const timestamp = new Date(); // Get the current timestamp
  const formattedDate = formatDate(timestamp); // Format the timestamp
  const dateString = formattedDate.toLocaleString(); // Convert to string
  const date = new Date(dateString);
  const timestampInSeconds = Math.floor(date.getTime() / 1000);
  let newFilePaths;

  form.on("file", function (name, file) {
    // Getting the file extension
    const fileExtension = file.originalFilename.split(".").pop();
    // Creating the new filename with timestamp
    const newFilename = `${timestampInSeconds}.${fileExtension}`;
    // Setting the new filename to the file object
    const newFilePath = path.join(profile_Upload_Dir, newFilename).replace(/\\/g, "/"); // Replace backslashes with forward slashes
    newFilePaths = newFilePath;

    // Rename the file
    fs.rename(file.path, newFilePath, (err) => {
      if (err) {
        console.error("File renaming error:", err);
        return res.status(500).send({ error: "File renaming error" });
      }
    });
  });

  form.parse(req, async (err, fields) => {
    // console.log(fields);
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).send({ error: "Form parsing error" });
    }

    const full_name = fields.full_name[0];
    const mobile = fields.mobile[0];
    const password = fields.password[0];
    const deviceId = fields.deviceId[0];
    const email = fields.email[0];
    const address = fields.address[0];
    const firebase_token = fields.firebase_token[0];

    if (!full_name || !mobile || !password || !deviceId || !email || !address) {
      res.status(404).json({
        message: "Please enter all the required fields.",
        status: false,
      });
      return;
    }

    if (mobile.toString().length < 10) {
      res.status(404).json({
        message: "Mobile number must be at least 10 digits long.",
        status: false,
      });
      return;
    }

    const mobileExists = await UserModel.findOne({ mobile });
    if (mobileExists) {
      res.status(404).json({
        message: "User with this mobile number already exists.",
        status: false,
      });
      return;
    }

    // const deviceIdExists = await UserModel.findOne({ deviceId });
    // if (deviceIdExists) {
    //   res.status(404).json({
    //     message: "User with this DeviceId already exists.",
    //     status: false,
    //   });
    //   return;
    // }

    const otp = generateOTP();

    const user = await UserModel.create({
      full_name,
      mobile,
      password,
      otp,
      deviceId,
      email,
      address,
      datetime:moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
      pic: newFilePaths,
      firebase_token,
    });


    // for sms confirmation 
    // try {
    //   const otpResponse = await TextLocalApi(mobile, full_name, otp);

    //   // Check if OTP was sent successfully
    //   if (otpResponse.status === "success") {
    //     console.log("OTP sent successfully:", otpResponse);
    //   } else {
    //     console.error("Failed to send OTP:", otpResponse);
    //     return res.status(500).json({
    //       message: "OTP could not be sent. Please try again.",
    //       status: false,
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error sending OTP:", error);
    //   return res.status(500).json({
    //     message: "An error occurred while sending OTP.",
    //     status: false,
    //   });
    // }

    TextLocalApi(mobile, full_name, otp);

    if (user) {
      res.status(201).json({
        _id: user._id,
        full_name: user.full_name,
        mobile: user.mobile,
        profile_pic: user.pic,
        email: user.email,
        address: user.address,
        otp_verified: user.otp_verified,
        otp: user.otp,
        status: true,
      });
    } else {
      res.status(404).json({
        message: "User registration failed.",
        status: false,
      });
      return;
    }
  });
};


// edit by Atest

// exports.registerUser = async (req, res) => {
//   const form = new multiparty.Form({ uploadDir: profile_Upload_Dir });
//   // const timestamp = new Date(); // Get the current timestamp
//   // const formattedDate = formatDate(timestamp); // Format the timestamp
//   // const dateString = formattedDate.toLocaleString(); // Convert to string
//   const date = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");
//   // const timestampInSeconds = Math.floor(date.getTime() / 1000);
//   let newFilePaths;

//   form.on("file", function (name, file) {
//     // Getting the file extension
//     const fileExtension = file.originalFilename.split(".").pop();
//     // Creating the new filename with timestamp
//     const newFilename = `${timestampInSeconds}.${fileExtension}`;
//     // Setting the new filename to the file object
//     const newFilePath = path.join(profile_Upload_Dir, newFilename).replace(/\\/g, "/"); // Replace backslashes with forward slashes
//     newFilePaths = newFilePath;

//     // Rename the file
//     fs.rename(file.path, newFilePath, (err) => {
//       if (err) {
//         console.error("File renaming error:", err);
//         return res.status(500).send({ error: "File renaming error" });
//       }
//     });
//   });

//   form.parse(req, async (err, fields) => {
//     // console.log(fields);
//     if (err) {
//       console.error("Error parsing form:", err);
//       return res.status(500).send({ error: "Form parsing error" });
//     }

//     const full_name = fields.full_name[0];
//     const mobile = fields.mobile[0];
//     const password = fields.password[0];
//     const deviceId = fields.deviceId[0];
//     const email = fields.email[0];
//     const address = fields.address[0];
//     const firebase_token = fields.firebase_token[0];

//     if (!full_name || !mobile || !password || !deviceId || !email || !address) {
//       res.status(404).json({
//         message: "Please enter all the required fields.",
//         status: false,
//       });
//       return;
//     }

//     if (mobile.toString().length < 10) {
//       res.status(404).json({
//         message: "Mobile number must be at least 10 digits long.",
//         status: false,
//       });
//       return;
//     }

//     const mobileExists = await UserModel.findOne({ mobile });
//     if (mobileExists) {
//       res.status(404).json({
//         message: "User with this mobile number already exists.",
//         status: false,
//       });
//       return;
//     }

//     const otp = generateOTP();

//     const user = await UserModel.create({
//       full_name,
//       mobile,
//       password,
//       otp,
//       deviceId,
//       email,
//       address,
//       datetime:date,
//       pic: newFilePaths,
//       firebase_token,
//     });


//     // for sms confirmation 
//     // try {
//     //   const otpResponse = await TextLocalApi(mobile, full_name, otp);

//     //   // Check if OTP was sent successfully
//     //   if (otpResponse.status === "success") {
//     //     console.log("OTP sent successfully:", otpResponse);
//     //   } else {
//     //     console.error("Failed to send OTP:", otpResponse);
//     //     return res.status(500).json({
//     //       message: "OTP could not be sent. Please try again.",
//     //       status: false,
//     //     });
//     //   }
//     // } catch (error) {
//     //   console.error("Error sending OTP:", error);
//     //   return res.status(500).json({
//     //     message: "An error occurred while sending OTP.",
//     //     status: false,
//     //   });
//     // }

//     TextLocalApi(mobile, full_name, otp);

//     if (user) {
//       res.status(201).json({
//         _id: user._id,
//         full_name: user.full_name,
//         mobile: user.mobile,
//         profile_pic: user.pic,
//         email: user.email,
//         address: user.address,
//         otp_verified: user.otp_verified,
//         otp: user.otp,
//         datetime:user.datetime,
//         status: true,
//       });
//     } else {
//       res.status(404).json({
//         message: "User registration failed.",
//         status: false,
//       });
//       return;
//     }
//   });
// };


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

exports.verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const user = await UserModel.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found.",
        status: false,
      });
    }

    if (user.otp_verified) {
      return res.status(404).json({
        message: "User is already OTP verified.",
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

    // Update the user's otp_verified field to 1 (OTP verified)
    const result = await UserModel.updateOne({ _id: user._id }, { $set: { otp_verified: 1 } });

    if (result.nModified > 0) {
      console.log("OTP verification status updated successfully.");
    } else {
      console.log("No matching user found or OTP verification status already set.");
    }

    // Retrieve the updated user document
    const updatedUser = await UserModel.findById(user._id);

    res.status(200).json({
      user: updatedUser,
      message: "OTP verified successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ error: error.message, status: false });
  }
};

exports.resendOTP = async (req, res) => {
  const { mobile } = req.body;

  // Generate a new OTP
  const newOTP = generateOTP();

  // Find the user by mobile number
  const user = await UserModel.findOne({ mobile });

  //   const type = 'Resend';
    TextLocalApi(mobile, user.full_name, newOTP);
  if (!user) {
    res.status(404).json({
      message: "User Not Found.",
      status: false,
    });
    return;
  }

  // Update the user's otp field with the new OTP
  const result = await UserModel.updateOne({ _id: user._id }, { $set: { otp: newOTP } });

  // Send the new OTP to the user (you can implement this logic)

  res.json({
    message: "New OTP sent successfully.",
    status: true,
    otp: newOTP,
  });
};

exports.forgetPassword = async (req, res) => {
  const { newPassword, mobile, otp } = req.body;

  if (!newPassword || !mobile || !otp) {
    res.status(404).json({
      message: "Please enter all the required fields.",
      status: false,
    });
    return;
  }

  // Find the user by _id
  const user = await UserModel.findOne({ mobile });

  if (!user) {
    res.status(404).json({
      message: "User Not Found.",
      status: false,
    });
    return;
  }
  if (user.otp !== otp) {
    res.status(404).json({
      message: "Invalid OTP.",
      status: false,
    });
    return;
  }

  user.password = newPassword;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const result = await UserModel.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

  // Save the updated user with the new password
  res.json({
    message: "Password reset successfully.",
    status: true,
  });
};

exports.ChangePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.headers.userID; // Assuming you have user authentication middleware

  // Find the user by _id
  const user = await UserModel.findById(userId);

  if (!user) {
    res.status(404).json({
      message: "User Not Found.",
      status: false,
    });
    return;
  }

  user.password = newPassword;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const result = await UserModel.updateOne({ _id: user._id }, { $set: { password: hashedPassword } });

  res.json({
    message: "Password Change successfully.",
    status: true,
  });
};

exports.EditProfileData = async (req, res) => {
  const { full_name, email, address } = req.body;
  const userId = req.headers.userID; // Assuming you have user authentication middleware

  try {
    // Update the user's profile fields if they are provided in the request
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          full_name: full_name,
          email: email,
          address: address,
        },
      },
      { new: true }
    ); // Option to return the updated document

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      _id: updatedUser._id,
      pic: updatedUser.pic,
      mobile: updatedUser.mobile,
      full_name: updatedUser.full_name,
      email: updatedUser.email,
      address: updatedUser.address,
      status: true,
    });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.uploadImagesProfile = (req, res) => {
  upload.single("imageFile")(req, res, function (err) {
    if (err) {
      // Handle error if any
      return res.status(400).json({ error: "Error uploading image" });
    }
    // Return image name and path
    return res.json({ filename: "Profile/" + req.file.filename });
  });
};

const NotificationTimer = (databaseTime) => {
  try {
    if (!databaseTime) {
      return "Invalid time";
    }

    // Calculate current time in IST timezone
    const currentTime = moment().tz("Asia/Kolkata");

    // Parse the time strings using moment
    const databaseMoment = moment.tz(databaseTime, "DD-MM-YYYY HH:mm:ss", "Asia/Kolkata");

    // Calculate the difference between the two times
    const differenceInMilliseconds = currentTime.diff(databaseMoment);

    // Convert the difference to seconds, minutes, hours, and days
    const duration = moment.duration(differenceInMilliseconds);
    const seconds = duration.seconds();
    const minutes = duration.minutes();
    const hours = duration.hours();
    const days = duration.days();

    // Construct the time difference string
    let timeDifference = "";
    if (days > 0) {
      timeDifference += `${days} days `;
    } else if (hours > 0) {
      timeDifference += `${hours} hours `;
    } else if (minutes > 0) {
      timeDifference += `${minutes} minutes `;
    } else if (seconds > 0) {
      timeDifference += `${seconds} seconds`;
    }

    // Return the time difference string
    return timeDifference.trim() === "" ? "Just now" : timeDifference.trim();
  } catch (error) {
    console.error("Error calculating time difference:", error.message);
    return "Invalid time format";
  }
};

exports.editProfilePic = async (req, res) => {
  const userId = req.headers.userID;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required in the header." });
  }

  const form = new multiparty.Form({ uploadDir: profile_Upload_Dir });
  const timestamp = new Date();
  const timestampInSeconds = Math.floor(timestamp.getTime() / 1000);
  let newFilePath;

  form.on("file", function (name, file) {
    const fileExtension = file.originalFilename.split(".").pop();
    const newFilename = `${userId}.${fileExtension}`;
    newFilePath = path.join(profile_Upload_Dir, newFilename).replace(/\\/g, "/");

    fs.rename(file.path, newFilePath, (err) => {
      if (err) {
        console.error("File renaming error:", err);
        return res.status(500).send({ error: "File renaming error" });
      }
    });
  });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).send({ error: "Form parsing error" });
    }

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Store the old profile picture path
      // const oldFilePath = user.pic;

      // Update the user's profile picture path
      user.pic = newFilePath;
      await user.save();

      // Delete the old profile picture file if it exists and is not null or undefined
      // if (oldFilePath) {
      //   // Extract the relative path from the URL
      //   const oldFileLocalPath = path.join(__dirname, "../", oldFilePath.replace(baseURL, "")).replace(/\\/g, "/");
      //   fs.unlink(oldFileLocalPath, (err) => {
      //     if (err) {
      //       console.error("Error deleting old profile picture:", err);
      //     }
      //   });
      // }

      res.status(200).json({
        message: "Profile picture updated successfully.",
        profile_pic: user.pic,
        user,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ error: "Error updating profile picture." });
    }
  });
};

exports.getUnreadCount = async (req, res) => {
  try {
    const user_id = req.headers.userID;
    const unreadNotifications = await NotificationMessages.find({
      receiver_id: user_id,
      readstatus: false,
    });

    let unreadCount = unreadNotifications.length;
    if (unreadCount > 10) {
      unreadCount = 10;
    } else if (unreadCount == 0) {
      unreadCount = "";
    }

    return res.status(200).json({ status: true, Count: unreadCount });
  } catch (error) {
    console.error("Error getting unread count:", error.message);
    throw new Error("Error getting unread count");
  }
};

exports.NotificationList = async (req, res) => {
  try {
    const user_id = req.headers.userID;
    const page = req.query.page || 1;
    const pageSize = 500;

    const notifications = await NotificationMessages.find({
      receiver_id: user_id,
    })
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    if (!notifications || notifications.length === 0) {
      return res.status(200).json({ status: false, notifications: [] });
    }

    await Promise.all(
      notifications.map(async (notification) => {
        await NotificationMessages.findByIdAndUpdate(notification._id, { readstatus: true });
      })
    );

    const notificationList = await Promise.all(
      notifications.map(async (notification) => {
        let senderDetails;
        if (notification.type == "User_active_status") {
          senderDetails = await Admin_Model.findById(notification.sender_id);
        } else {
          senderDetails = await UserModel.findById(notification.sender_id);
        }

        console.log("senderDetails", senderDetails); // Check what senderDetails contains
        console.log("senderDetails.pic", senderDetails ? senderDetails.pic : "No pic property"); // Check pic property

        const sender = {
          _id: senderDetails._id,
          full_name: senderDetails.full_name,
          pic: senderDetails.pic || "https://app.evergreenion.com/static/media/evergreen_logo.33f099dc164c59331efa.png", // Default value if pic is undefined
        };

        const notificationWithSender = {
          _id: notification._id,
          sender,
          message: notification.message,
          metadata: notification.metadata,
          type: notification.type,
          time: NotificationTimer(notification.datetime),
          date: notification.datetime.split(" ")[0],
        };

        return notificationWithSender;
      })
    );

    res.status(200).json({
      status: true,
      notifications: notificationList,
    });
  } catch (error) {
    console.error("Error getting notification list:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.leaveApplication = async (req, res) => {
  try {
    const { start_date, end_date, reason } = req.body;
    const _id = req.headers.userID;
    // Create a new leave application instance
    const newLeaveApplication = new leaveApplicationModel({
      userID: _id,
      start_date,
      end_date,
      reason,
      datetime:moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
    });

    // Save the leave application to the database
    await newLeaveApplication.save();

    const user = await UserModel.findOne({ _id });

    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    let messag;
    if (reason == "family_event") {
      messag = `I am writing to formally request leave from work for the period starting from ${start_date} to ${end_date}. The reason for my leave is a family event.`;
    } else if (reason == "sickness") {
      messag = `I am writing to formally request leave from work for the period starting from ${start_date} to ${end_date}. The reason for my leave is due to sickness.`;
    } else if (reason == "urgent_work") {
      messag = `I am writing to formally request leave from work for the period starting from ${start_date} to ${end_date}. The reason for my leave is due to urgent work.`;
    } else if (reason == "family_issue") {
      messag = `I am writing to formally request leave from work for the period starting from ${start_date} to ${end_date}. The reason for my leave is a family issue.`;
    }

    const response = {
      user: user,
      formattedDate: formattedDate,
      leaveApplicationData: newLeaveApplication,
      messag: messag,
    };

    const htmlContent = leaveApplicationTemplate(response);
    const pdfPath = path.join(__dirname, "leave_application.pdf");

    // Generate the PDF
    await generatePdf(htmlContent, pdfPath);

    await sendMail({
      recipientEmail: "admin@evergreenion.com",
      subject: `Leave application of ${user.full_name}`,
      html: leaveApplicationTemplate(response),
      attachmentPath: pdfPath,
    });

    fs.unlinkSync(pdfPath);

    res.status(201).json({
      status: true,
      message: "Leave application submitted successfully",
      data: newLeaveApplication,
    });
  } catch (error) {
    console.error("Error submitting leave application:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.ResignationApplication = async (req, res) => {
  try {
    const { last_date_working, reason } = req.body;
    const _id = req.headers.userID;
    // Create a new leave application instance
    const newLeaveApplication = new ResignationApplicationModel({
      userID: _id,
      last_date_working,
      reason,
      datetime:moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
    });

    // Save the leave application to the database
    await newLeaveApplication.save();

    const user = await UserModel.findOne({ _id });

    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based in JavaScript
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    const displayRole = user.role === "super_engineer" ? "Service Engineer" : user.role === "supervisor" ? "Supervisor" : user.role;

    let resignationMessage;
    switch (reason) {
      case "new_job":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${last_date_working}. The reason for my resignation is that I have accepted a new job opportunity.`;
        break;
      case "personal_reasons":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${last_date_working}. The reason for my resignation is personal reasons.`;
        break;
      case "relocation":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${last_date_working}. The reason for my resignation is relocation.`;
        break;
      case "health_issues":
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${last_date_working}. The reason for my resignation is health issues.`;
        break;
      default:
        resignationMessage = `I am writing to formally resign from my position as ${displayRole} at Evergreen Ion Enviro, effective ${last_date_working}.`;
    }

    const response = {
      user: user,
      formattedDate: formattedDate,
      leaveApplicationData: newLeaveApplication,
      messag: resignationMessage,
    };

    const htmlContent = ResignationApplicationTemplate(response);
    const pdfPath = path.join(__dirname, "Resignation_application.pdf");

    // Generate the PDF
    await generatePdf(htmlContent, pdfPath);

    await sendMail({
      recipientEmail: "admin@evergreenion.com",
      subject: `Resignation from the position of ${displayRole}`,
      html: ResignationApplicationTemplate(response),
      attachmentPath: pdfPath,
    });

    fs.unlinkSync(pdfPath);

    res.status(201).json({
      status: true,
      message: "Leave application submitted successfully",
      data: newLeaveApplication,
    });
  } catch (error) {
    console.error("Error submitting leave application:", error.message);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
