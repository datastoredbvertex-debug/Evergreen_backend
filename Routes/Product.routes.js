const { getNotEmptyVaule, getProductdetails, getSiteProduct, Createproduct, getAllProduct, UpdateProduct, getAllProductName, Createproductimage, ProductSubmit, ProductCheckCurrentValue, UpdateChemicallist, GetChemicallist } = require("../Controllers/Product.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const ProductsRouter = express.Router();

ProductsRouter.get("/getAllProductName", Authentication, Authorization(["Admin", "supervisor", "super_engineer", "Sub_Admin"]), getAllProductName);
ProductsRouter.post("/Createproduct", Authentication, Authorization(["Admin", "Sub_Admin"]), Createproduct);
ProductsRouter.post("/Createproductimage", Authentication, Authorization(["Admin", "Sub_Admin"]), Createproductimage);
ProductsRouter.post("/get_all_product", Authentication, Authorization(["Admin", "Sub_Admin"]), getAllProduct);
ProductsRouter.post("/UpdateProduct", Authentication, Authorization(["Admin", "Sub_Admin"]), UpdateProduct);
ProductsRouter.post("/ProductSubmit", Authentication, Authorization(["super_engineer", "supervisor", "Sub_Admin"]), ProductSubmit);
ProductsRouter.post("/ProductCheckCurrentValue", Authentication, Authorization(["super_engineer", "supervisor", "Sub_Admin"]), ProductCheckCurrentValue);
ProductsRouter.post("/UpdateChemicallist", Authentication, Authorization(["Admin", "supervisor", "super_engineer", "Sub_Admin"]), UpdateChemicallist);
ProductsRouter.post("/GetChemicallist", Authentication, Authorization(["Admin", "supervisor", "super_engineer", "Sub_Admin"]), GetChemicallist);
ProductsRouter.post("/getSiteProduct", Authentication, Authorization(["Admin", "supervisor", "super_engineer", "Sub_Admin"]), getSiteProduct);
ProductsRouter.post("/getProductdetails", Authentication, Authorization(["Admin", "supervisor", "super_engineer", "Sub_Admin"]), getProductdetails);
ProductsRouter.post("/getNotEmptyVaule", Authentication, Authorization(["Admin", "supervisor", "super_engineer", "Sub_Admin"]), getNotEmptyVaule);
module.exports = ProductsRouter;
