const {
  dataSubmitupdate,
  Editvalue,
  getEditNotEmptyVaule,
  EditImages,
  EditgetImages,
  getReportHomePage,
  EditWorkingType,
  EditgetWorkingType,
  getnotworkingImage,
  getAllProductNamebySite,
  SiteGetAllotmentUser,
  SE_Attendance,
  SiteByProduct,
  AddWorkingType,
  AddImage,
  Addvalue,
} = require("../Controllers/SE.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const SERouter = express.Router();

SERouter.get("/SiteGetAllotmentUser", Authentication, Authorization(["super_engineer"]), SiteGetAllotmentUser);
SERouter.post("/SEAttendance", Authentication, Authorization(["super_engineer"]), SE_Attendance);
SERouter.post("/SiteByProduct", Authentication, Authorization(["super_engineer"]), SiteByProduct);

// -------------- Home Page Report  ----------------//
SERouter.post("/getReportHomePage", Authentication, Authorization(["super_engineer"]), getReportHomePage);

// -------------- Add Report  ----------------//
SERouter.post("/getAllProductNamebySite", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), getAllProductNamebySite);
SERouter.post("/AddWorkingType", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), AddWorkingType);
SERouter.post("/getnotworkingImage", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), getnotworkingImage);
SERouter.post("/AddImage", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), AddImage);
SERouter.post("/Addvalue", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), Addvalue);
SERouter.post("/dataSubmitupdate", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), dataSubmitupdate);

// -------------- Edit Report  ----------------//
SERouter.post("/EditgetWorkingType", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), EditgetWorkingType);
SERouter.post("/EditWorkingType", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), EditWorkingType);
SERouter.post("/EditgetImages", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), EditgetImages);
SERouter.post("/EditImages", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), EditImages);
SERouter.post("/getEditNotEmptyVaule", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), getEditNotEmptyVaule);
SERouter.post("/Editvalue", Authentication, Authorization(["super_engineer", "Admin", "Sub_Admin"]), Editvalue);

module.exports = SERouter;
