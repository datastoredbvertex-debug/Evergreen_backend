const {
  Editvalue,
  getEditNotEmptyVaule,
  EditImages,
  EditgetImages,
  EditWorkingType,
  EditgetWorkingType,
  getnotworkingImage,
  getAllProductNamebySite,
  SiteGetAllotmentUser,
  SESitesFromAllotment,
  SV_Attendance,
  SiteByProduct,
  GetClientEmail,
  OtpSendClientEmail,
  ClientVerifyOtp,
  AddWorkingType,
  AddImage,
  Addvalue,
  dataSubmitupdate,
  AddSelfie,
  getSvAllData,
  svSiteAllotment
} = require("../Controllers/SV.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const SVRouter = express.Router();

SVRouter.get("/SiteGetAllotmentUser", Authentication, Authorization(["supervisor"]), SiteGetAllotmentUser);
SVRouter.get("/getSvAllData", Authentication, Authorization(["supervisor"]), getSvAllData);
SVRouter.post("/SVAttendance", Authentication, Authorization(["supervisor"]), SV_Attendance);
SVRouter.get("/SESitesFromAllotment", Authentication, Authorization(["Admin", "supervisor", "Sub_Admin"]), SESitesFromAllotment);
SVRouter.get("/svSiteAllotment", Authentication, Authorization(["supervisor"]), svSiteAllotment);
SVRouter.post("/SiteByProduct", Authentication, Authorization(["supervisor"]), SiteByProduct);
SVRouter.post("/GetClientEmail", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), GetClientEmail);
SVRouter.post("/OtpSendClientEmail", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), OtpSendClientEmail);
SVRouter.post("/ClientVerifyOtp", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), ClientVerifyOtp);
SVRouter.post("/AddSelfie", Authentication, Authorization(["supervisor"]), AddSelfie);

// -------------- Add Report  ----------------//
SVRouter.post("/getAllProductNamebySite", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), getAllProductNamebySite);
SVRouter.post("/AddWorkingType", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), AddWorkingType);
SVRouter.post("/getnotworkingImage", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), getnotworkingImage);
SVRouter.post("/AddImage", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), AddImage);
SVRouter.post("/Addvalue", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), Addvalue);
SVRouter.post("/dataSubmitupdate", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), dataSubmitupdate);

// -------------- Edit Report  ----------------//
SVRouter.post("/EditgetWorkingType", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), EditgetWorkingType);
SVRouter.post("/EditWorkingType", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), EditWorkingType);
SVRouter.post("/EditgetImages", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), EditgetImages);
SVRouter.post("/EditImages", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), EditImages);
SVRouter.post("/getEditNotEmptyVaule", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), getEditNotEmptyVaule);
SVRouter.post("/Editvalue", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), Editvalue);
module.exports = SVRouter;
