const { login, registerUser, leaveApplication, ResignationApplication, uploadImagesProfile, resendOTP, verifyOtp, forgetPassword, ChangePassword, logoutUser, EditProfileData, getUser, getUnreadCount, NotificationList, editProfilePic } = require("../Controllers/User.controller");

const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const UserRouter = express.Router();

UserRouter.post("/login", login);
UserRouter.post("/register_User", registerUser);
UserRouter.post("/resendOTP", resendOTP);
UserRouter.post("/verifyOtp", verifyOtp);
UserRouter.post("/forgetPassword", forgetPassword);

/*------------- Auth Routes --------------------- */
UserRouter.post("/upload_Images_Profile", uploadImagesProfile);
UserRouter.post("/ChangePassword", Authentication, Authorization(["super_engineer", "supervisor"]), ChangePassword);
UserRouter.get("/logoutUser", Authentication, Authorization(["super_engineer", "supervisor"]), logoutUser);
UserRouter.get("/getUser", Authentication, Authorization(["super_engineer", "supervisor"]), getUser);
UserRouter.post("/EditProfileData", Authentication, Authorization(["super_engineer", "supervisor"]), EditProfileData);
UserRouter.post("/editProfilePic", Authentication, Authorization(["super_engineer", "supervisor"]), editProfilePic);
UserRouter.get("/NotificationList", Authentication, Authorization(["super_engineer", "supervisor"]), NotificationList);
UserRouter.get("/getUnreadCount", Authentication, Authorization(["super_engineer", "supervisor"]), getUnreadCount);
UserRouter.post("/leaveApplication", Authentication, Authorization(["super_engineer", "supervisor"]), leaveApplication);
UserRouter.post("/resignationApplication", Authentication, Authorization(["super_engineer", "supervisor"]), ResignationApplication);
module.exports = UserRouter;
