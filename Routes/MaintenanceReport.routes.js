const { MaintenanceReportSubmit, getAll_MaintenanceReport, MaintenanceReportGet, MaintenanceEditReport } = require("../Controllers/maintenance.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const MaintenanceReportRouter = express.Router();

MaintenanceReportRouter.post("/MaintenanceReportSubmit", Authentication, Authorization(["super_engineer", "supervisor", "Admin", "Sub_Admin"]), MaintenanceReportSubmit);
MaintenanceReportRouter.post("/getAll_MaintenanceReport", Authentication, Authorization(["Admin", "Sub_Admin"]), getAll_MaintenanceReport);
MaintenanceReportRouter.post("/MaintenanceReportGet", Authentication, Authorization(["Admin", "Sub_Admin"]), MaintenanceReportGet);
MaintenanceReportRouter.post("/MaintenanceEditReport", Authentication, Authorization(["Admin", "Sub_Admin"]), MaintenanceEditReport);
module.exports = MaintenanceReportRouter;
