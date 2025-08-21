const { ReportSend, getAll_Report, ReportGet } = require("../Controllers/ReportController");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const ReportRouter = express.Router();

ReportRouter.post("/ReportGet", Authentication, Authorization(["super_engineer", "supervisor", "Admin", "Sub_Admin"]), ReportGet);
ReportRouter.post("/getAll_Report", Authentication, Authorization(["Admin", "Sub_Admin"]), getAll_Report);
ReportRouter.post("/ReportSend", Authentication, Authorization(["supervisor", "Admin", "Sub_Admin"]), ReportSend);

module.exports = ReportRouter;
