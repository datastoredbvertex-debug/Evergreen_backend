const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const path = require("path");
const app = express();
const __dirname1 = path.resolve();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
// test

// --------------------- Routes -------------------------------
const AdminRouter = require("./Routes/Admin.routes");
const CategorysRouter = require("./Routes/Category.routes");
const ProblemsRouter = require("./Routes/Problem.routes");
const ProductsRouter = require("./Routes/Product.routes.js");
const SitesRouter = require("./Routes/Site.routes");
const ClientRouter = require("./Routes/Client.routes");
const UserRouter = require("./Routes/User.routes");
const SERouter = require("./Routes/SE.routes.js");
const SVRouter = require("./Routes/SV.routes.js");
const ReportRouter = require("./Routes/Report.routes.js");
const { CompanyDetails } = require("./Routes/Companydetails.routes.js");
const UnitRouter = require("./Routes/Unit.routes.js");
const MaintenanceReport = require("./Routes/MaintenanceReport.routes.js");

// --------------------- Routes -------------------------------
connectDB();
app.use(cors());
app.use(express.static(path.join(__dirname1, "")));
app.use("/public", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads/Attendance/SE"));
app.use("/uploads", express.static("uploads/Attendance/SV"));
app.use("/uploads", express.static("uploads/Contract_Pages"));
app.use("/uploads", express.static("uploads/Identity_Card"));
app.use("/uploads", express.static("uploads/Medical_Card"));
app.use("/uploads", express.static("uploads/Not_Work_Product"));
app.use("/uploads", express.static("uploads/Product"));
app.use("/uploads", express.static("uploads/profile"));
app.use("/uploads", express.static("uploads/Report"));
app.use("/uploads", express.static("uploads/Maintenance_Report"));

app.use("/static", express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// --------------------- Routes -------------------------------
app.use("/api/admin", AdminRouter);
app.use("/api/categorys", CategorysRouter);
app.use("/api/problems", ProblemsRouter);
app.use("/api/products", ProductsRouter);
app.use("/api/sites", SitesRouter);
app.use("/api/client", ClientRouter);
app.use("/api/user", UserRouter);
app.use("/api/CompanyDetails", CompanyDetails);
app.use("/api/se", SERouter);
app.use("/api/sv", SVRouter);
app.use("/api/Report", ReportRouter);
app.use("/api/unit", UnitRouter);
app.use("/api/Maintenance_Report", MaintenanceReport);

// --------------------- Routes -------------------------------

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "/view")));

  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname1, "view", "index.html")));
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`);
  console.log(`Base URL: ${BASE_URL}`);
});
