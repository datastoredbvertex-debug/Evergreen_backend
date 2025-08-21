const { Createsite, getAllSite, UpdateSite, getAllSiteName, GetSiteHistory, CreateSiteimage, DeleteSiteImage, EditSiteData, EditSiteAllotUser, EditSiteProductData } = require("../Controllers/Site.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const SitesRouter = express.Router();

SitesRouter.post("/Createsite", Authentication, Authorization(["Admin", "Sub_Admin"]), Createsite);
SitesRouter.post("/CreateSiteimage", Authentication, Authorization(["Admin", "Sub_Admin"]), CreateSiteimage);
SitesRouter.post("/get_all_site", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllSite);
SitesRouter.post("/UpdateSite", Authentication, Authorization(["Admin", "Sub_Admin"]), UpdateSite);
SitesRouter.get("/getAllSiteName", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllSiteName);
SitesRouter.post("/DeleteSiteImage", Authentication, Authorization(["Admin", "Sub_Admin"]), DeleteSiteImage);
SitesRouter.post("/EditSiteData", Authentication, Authorization(["Admin", "Sub_Admin"]), EditSiteData);
SitesRouter.post("/EditSiteAllotUser", Authentication, Authorization(["Admin", "Sub_Admin"]), EditSiteAllotUser);
SitesRouter.post("/EditSiteProductData", Authentication, Authorization(["Admin", "Sub_Admin"]), EditSiteProductData);

// -----------------------  SE -------------------------
SitesRouter.post("/GetSiteHistory", Authentication, Authorization(["super_engineer"]), GetSiteHistory);
module.exports = SitesRouter;
