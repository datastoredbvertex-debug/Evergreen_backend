const express = require("express");
const { Createunite, GetAllUnit, UpdateUnit, getUnit } = require("../Controllers/Unit.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");

const UnitRouter = express.Router();

UnitRouter.post("/add_Unit", Authentication, Authorization(["Admin", "Sub_Admin"]), Createunite);
UnitRouter.get("/getAllUnit", Authentication, Authorization(["Admin", "Sub_Admin"]), GetAllUnit);
UnitRouter.post("/UpdateUnit", Authentication, Authorization(["Admin", "Sub_Admin"]), UpdateUnit);
UnitRouter.post("/getUnit", Authentication, Authorization(["Admin", "Sub_Admin"]), getUnit);

module.exports = UnitRouter;
