// const Add_Client = require('../Controllers/Admin.controller');
const {
  addAdmin,
  authAdmin,
  addClient,
  logoutAdmin,
  getAllClient,
  getAllDashboardCount,
  getAllUsers,
  UserTypeUpdate,
  getAll_Super_Engineer,
  getAll_Supervisor,
  SiteAllotmentUser,
  SiteAllotmentSE,
  SESitesFromAllotment,
  getAll_Report,
  getReportOnlySite,
  AdminNotificationToken,
  updateUserType,
  getSuperEngineersName,
  getSuperEngineersNameEdit,
  getAllSEAttendance,
  getAllSVAttendance,
  EditWorkingType,
  EditImages,
  Editvalue,
  Reportverified,
  DeactiveUser,
  TerminationUser,
  getUserNameMail,
  UserSiteShifting,
  UserwarningMail,
  UserfestivelMail,
  getUserAdmin,
  editClient,
  getEditDetails,
  leaveApplicationGet,
  resignationApplicationGet,
  leaveApplicationdata,
  ResignationApplicationdata,
  getSiteEditData,
  DeleteProductBySite,
  changePassword,
  getAdminNotifications,
  DeleteNotification,
  getSelfieDetails,
  deleteSelfie,
  runMaintenanceAlertCheck
} = require("../Controllers/Admin.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const AdminRouter = express.Router();


AdminRouter.get("/runMaintenanceAlertCheck", runMaintenanceAlertCheck);


AdminRouter.get("/add_admin", addAdmin);
AdminRouter.post("/admin_login", authAdmin);
AdminRouter.put("/changePassword", Authentication, Authorization(["Admin", "Sub_Admin"]), changePassword);
AdminRouter.get("/admin_logout", Authentication, Authorization(["Admin", "Sub_Admin"]), logoutAdmin);
AdminRouter.get("/getAdminNotifications", Authentication, Authorization(["Admin", "Sub_Admin"]), getAdminNotifications);
AdminRouter.delete("/DeleteNotification/:id", Authentication, Authorization(["Admin", "Sub_Admin"]), DeleteNotification);
AdminRouter.delete("/deleteSelfie/:selfieId", Authentication, Authorization(["Admin", "Sub_Admin"]), deleteSelfie);
AdminRouter.get("/getAllDashboardCount", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllDashboardCount);
AdminRouter.get("/getSuperEngineersName", Authentication, Authorization(["Admin", "Sub_Admin"]), getSuperEngineersName);
AdminRouter.get("/getSelfieDetails", Authentication, Authorization(["Admin", "Sub_Admin"]), getSelfieDetails);
AdminRouter.get("/getSuperEngineersNameEdit", Authentication, Authorization(["Admin", "Sub_Admin"]), getSuperEngineersNameEdit);
AdminRouter.post("/getUserNameMail", Authentication, Authorization(["Admin", "Sub_Admin"]), getUserNameMail);
AdminRouter.post("/getUserAdmin", Authentication, Authorization(["Admin", "Sub_Admin"]), getUserAdmin);
AdminRouter.post("/SESitesFromAllotment", Authentication, Authorization(["Admin", "supervisor", "Sub_Admin"]), SESitesFromAllotment);
AdminRouter.post("/getAllUsers", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllUsers);
AdminRouter.post("/getAll_Super_Engineer", Authentication, Authorization(["Admin", "Sub_Admin"]), getAll_Super_Engineer);
AdminRouter.post("/updateUserType", Authentication, Authorization(["Admin", "Sub_Admin"]), updateUserType);
AdminRouter.post("/getAll_Supervisor", Authentication, Authorization(["Admin", "Sub_Admin"]), getAll_Supervisor);
AdminRouter.post("/get_all_client", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllClient);
AdminRouter.post("/add_client", Authentication, Authorization(["Admin", "Sub_Admin"]), addClient);
AdminRouter.post("/editClient", Authentication, Authorization(["Admin", "Sub_Admin"]), editClient);
AdminRouter.post("/getEditDetails", Authentication, Authorization(["Admin", "Sub_Admin"]), getEditDetails);
AdminRouter.post("/SiteAllotmentUser", Authentication, Authorization(["Admin", "Sub_Admin"]), SiteAllotmentUser);
AdminRouter.post("/UserTypeUpdate", Authentication, Authorization(["Admin", "Sub_Admin"]), UserTypeUpdate);
AdminRouter.post("/SiteAllotmentSE", Authentication, Authorization(["Admin", "Sub_Admin"]), SiteAllotmentSE);
AdminRouter.post("/getAll_Report", Authentication, Authorization(["Admin", "Sub_Admin"]), getAll_Report);
AdminRouter.post("/getReportOnlySite", Authentication, Authorization(["Admin", "Sub_Admin"]), getReportOnlySite);
AdminRouter.post("/AdminNotificationToken", Authentication, Authorization(["Admin", "Sub_Admin"]), AdminNotificationToken);
AdminRouter.post("/getAllSEAttendance", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllSEAttendance);
AdminRouter.post("/getAllSVAttendance", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllSVAttendance);
AdminRouter.post("/DeactiveUser", Authentication, Authorization(["Admin", "Sub_Admin"]), DeactiveUser);
AdminRouter.post("/TerminationUser", Authentication, Authorization(["Admin", "Sub_Admin"]), TerminationUser);
AdminRouter.post("/getSiteEditData", Authentication, Authorization(["Admin", "Sub_Admin"]), getSiteEditData);
AdminRouter.post("/DeleteProductBySite", Authentication, Authorization(["Admin", "Sub_Admin"]), DeleteProductBySite);

AdminRouter.post("/UserSiteShifting", Authentication, Authorization(["Admin", "Sub_Admin"]), UserSiteShifting);
AdminRouter.post("/UserwarningMail", Authentication, Authorization(["Admin", "Sub_Admin"]), UserwarningMail);
AdminRouter.post("/UserfestivelMail", Authentication, Authorization(["Admin", "Sub_Admin"]), UserfestivelMail);

AdminRouter.post("/leaveApplicationGet", Authentication, Authorization(["Admin", "Sub_Admin"]), leaveApplicationGet);
AdminRouter.post("/resignationApplicationGet", Authentication, Authorization(["Admin", "Sub_Admin"]), resignationApplicationGet);
AdminRouter.post("/leaveApplicationdata", Authentication, Authorization(["Admin", "Sub_Admin"]), leaveApplicationdata);
AdminRouter.post("/ResignationApplicationdata", Authentication, Authorization(["Admin", "Sub_Admin"]), ResignationApplicationdata);

// -------------- Edit Report  ----------------//
AdminRouter.post("/EditWorkingType", Authentication, Authorization(["Admin", "Sub_Admin"]), EditWorkingType);
AdminRouter.post("/EditImages", Authentication, Authorization(["Admin", "Sub_Admin"]), EditImages);
AdminRouter.post("/Editvalue", Authentication, Authorization(["Admin", "Sub_Admin"]), Editvalue);
AdminRouter.post("/Reportverified", Authentication, Authorization(["Admin", "Sub_Admin"]), Reportverified);
module.exports = AdminRouter;
