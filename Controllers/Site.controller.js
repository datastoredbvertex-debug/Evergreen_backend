const mongoose = require("mongoose");
const Site = require("../Models/Site.model");
const Client = require("../Models/Client.model");
const SendMail = require("../Config/mail");
const { SiteTemplate } = require("../Config/Template/sitemail");
const Product = require("../Models/Product.model");
const Problem = require("../Models/Problem.model");
const baseURL = process.env.BASE_URL;
const UserModel = require("../Models/User.model");
const Not_Work_Product = require("../Models/Not_Work_Product.model");
const Report = require("../Models/Report.model");
const { UploadContractPages } = require("../Config/imageuplaode");
const multer = require("multer");
const upload = multer({ storage: UploadContractPages });
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// exports.Createsite = async (req, res) => {
//   const { client_id } = req.body;
//   // console.log(req.body);
//   if (
//     !client_id.client_id ||
//     !client_id.site_name ||
//     !client_id.location_lat ||
//     !client_id.location_long ||
//     !client_id.location_name ||
//     !client_id.start_date ||
//     !client_id.end_date ||
//     !client_id.sv_visit ||
//     !client_id.working_hrs ||
//     !client_id.man_power ||
//     !client_id.productdata ||
//     !client_id.amc ||
//     !client_id.selectedIds
//   ) {
//     return res.status(400).json({
//       message: "Please enter all the required fields.",
//       status: false,
//     });
//   }

//   const client_ids = client_id.client_id;
//   const site_name = client_id.site_name;
//   const location_name = client_id.location_name;
//   const location_lat = client_id.location_lat;
//   const location_long = client_id.location_long;
//   const start_date = client_id.start_date;
//   const end_date = client_id.end_date;
//   const sv_visit = client_id.sv_visit;
//   const working_hrs = client_id.working_hrs;
//   const man_power = client_id.man_power;
//   const imageFiles = client_id.imageFiles;
//   const amc = client_id.amc;
//   const product = client_id.productdata;
//   // const discount = client_id.discount;
//   const amc_description = client_id.amc_descriptions;

//   try {
//     const productIdNames = product.map((p) => p.product_id.trim());

//     // Utpadak kollection ko dhoondhna
//     const products = await Product.find({
//       product_name: { $in: productIdNames },
//     });

//     // Utpadak ke naam aur maatra ko map mein store karna
//     const productMap = new Map(products.map((p) => [p.product_name, { _id: p._id, product_quantity: p.product_quantity, remaining_quantity: p.product_quantity, product_min_quantity: p.min_product_quantity }]));

//     for (const p of product) {
//       const productDetails = productMap.get(p.product_id);
//       const productQuantity = parseInt(p.product_quantity, 10);
//       const productMinQuantity = parseInt(p.product_min_quantity, 10);

//       if (amc != "Non - Comprehensive") {
//         if (productDetails) {
//           const newQuantity = productDetails.product_quantity - productQuantity;
//           const newMinQuantity = productDetails.product_min_quantity - productMinQuantity;
//           // Utpadak maatra ko kollection mein update karna
//           await Product.updateOne({ _id: productDetails._id }, { $set: { product_quantity: newQuantity, product_min_quantity: newMinQuantity } });
//         }
//       }
//     }

//     // Aakhri sthiti ko log karne ke liye (tarkikta ke liye)
//     const updatedProductDetails = product.map(({ product_id, product_quantity, remaining_quantity, product_min_quantity, maintenance_count }) => {
//       const productDetails = productMap.get(product_id);

//       // Maintenance dates calculation
//       let maintenance_dates = null;

//       if (maintenance_count && maintenance_count > 0) {
//         maintenance_dates = [];
//         const totalMonths = moment(end_date).diff(moment(start_date), "months");
//         const interval = Math.floor(totalMonths / maintenance_count);
//         for (let i = 1; i <= maintenance_count; i++) {
//           maintenance_dates.push(
//             moment(start_date)
//               .add(i * interval, "months")
//               .format("DD/MM/YYYY")
//           );
//         }
//       }
//       return { _id: productDetails._id, product_quantity, remaining_quantity, product_min_quantity, maintenance_date: maintenance_dates };
//     });

//     const formattedStartDate = new Date(start_date).toLocaleDateString("en-IN");
//     const formattedEndDate = new Date(end_date).toLocaleDateString("en-IN");

//     const sites = await Site.create({
//       client_id: client_ids,
//       location_name,
//       location_lat,
//       location_long,
//       site_name,
//       start_date: formattedStartDate,
//       end_date: formattedEndDate,
//       contractfile: imageFiles,
//       sv_visit,
//       working_hrs,
//       man_power,
//       datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
//       amc,
//       product: updatedProductDetails,
//       amc_description,
//       // discount,
//     });

//     if (client_id.selectedIds.length > 0) {
//       try {
//         // Update all users with the selectedIds to have the same site_id
//         await UserModel.updateMany({ _id: { $in: client_id.selectedIds } }, { $set: { site_id: sites._id } });
//         console.log("Users updated with site_id successfully.");
//       } catch (error) {
//         console.error("Error updating users with site_id:", error);
//         // Handle error as needed
//       }
//     }

//     const clientmail = await Client.findById(client_ids);
//     const sitesdata = await SiteMailSend(sites._id);

//     SendMail({
//       recipientEmail: clientmail.clientEmail,
//       subject: "Site Create Update",
//       html: SiteTemplate(sitesdata),
//     });

//     if (sites) {
//       return res.status(201).json({
//         sites: sites,
//         status: true,
//       });
//     } else {
//       return res.status(200).json({
//         message: "Sites Not Created.",
//         status: false,
//       });
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.Createsite = async (req, res) => {
//   const { client_id } = req.body;

//   // Log the entire request body for debugging
//   console.log("Request body:", JSON.stringify(req.body, null, 2));

//   // Validate required fields
//   if (
//     !client_id.client_id ||
//     !client_id.site_name ||
//     !client_id.location_lat ||
//     !client_id.location_long ||
//     !client_id.location_name ||
//     !client_id.start_date ||
//     !client_id.end_date ||
//     !client_id.sv_visit ||
//     !client_id.working_hrs ||
//     !client_id.man_power ||
//     !client_id.productdata ||
//     !client_id.amc ||
//     !client_id.selectedIds
//   ) {
//     console.log("Missing required fields:", req.body);
//     return res.status(400).json({
//       message: "Please enter all the required fields.",
//       status: false,
//     });
//   }

//   const client_ids = client_id.client_id;
//   const site_name = client_id.site_name;
//   const location_name = client_id.location_name;
//   const location_lat = client_id.location_lat;
//   const location_long = client_id.location_long;
//   const start_date = client_id.start_date;
//   const end_date = client_id.end_date;
//   const sv_visit = client_id.sv_visit;
//   const working_hrs = client_id.working_hrs;
//   const man_power = client_id.man_power;
//   const imageFiles = client_id.imageFiles;
//   const amc = client_id.amc;
//   const product = client_id.productdata;
//   const amc_description = client_id.amc_descriptions;

//   try {
//     // Validate productdata array
//     if (!Array.isArray(product) || product.length === 0) {
//       console.log("Invalid productdata:", product);
//       return res.status(400).json({
//         message: "Product data is empty or invalid.",
//         status: false,
//       });
//     }

//     // Normalize product IDs for matching (trim and lowercase)
//     const productIdNames = product.map((p) => {
//       if (!p.product_id) {
//         throw new Error("Product ID missing in productdata");
//       }
//       return p.product_id.trim();
//     });

//     // Fetch products from the database
//     const products = await Product.find({
//       _id : { $in: productIdNames },
//     });

//     // Create a map of product details with normalized keys
//     const productMap = new Map(
//       products.map((p) => [
//         p.product_name.trim().toLowerCase(),
//         {
//           _id: p._id,
//           product_quantity: Number(p.product_quantity) || 0,
//           product_min_quantity: Number(p.product_min_quantity) || 0,
//         },
//       ])
//     );

//     console.log("Product Map:", Array.from(productMap.entries()));
//     console.log("Requested products:", productIdNames);

//     // Step 1: Check product availability (only product_quantity)
//     const availabilityErrors = [];
//     for (const p of product) {
//       const productId = p.product_id.trim().toLowerCase();
//       const productDetails = productMap.get(productId);

//       // Check if product exists
//       if (!productDetails) {
//         availabilityErrors.push(`Product ${p.product_id} not found in database.`);
//         continue;
//       }

//       const requestedQuantity = parseInt(p.product_quantity, 10);

//       // Validate requested quantity
//       if (isNaN(requestedQuantity) || requestedQuantity < 0) {
//         availabilityErrors.push(`Invalid product quantity for ${p.product_id}: ${p.product_quantity}`);
//         continue;
//       }

//       // Check if sufficient product_quantity is available
//       if (productDetails.product_quantity < requestedQuantity) {
//         availabilityErrors.push(
//           `Insufficient stock for product ${p.product_id}. Available: ${productDetails.product_quantity}, Requested: ${requestedQuantity}`
//         );
//         continue;
//       }

//       console.log(
//         `Product ${p.product_id} check: Available ${productDetails.product_quantity}, Requested ${requestedQuantity}`
//       );
//     }

//     // If there are any availability errors, stop and return
//     if (availabilityErrors.length > 0) {
//       console.log("Availability errors:", availabilityErrors);
//       return res.status(400).json({
//         message: "Product availability issues",
//         errors: availabilityErrors,
//         status: false,
//       });
//     }

//     // Step 2: Update product quantities for all products
//     const bulkOps = product.map((p) => {
//       const productId = p.product_id.trim().toLowerCase();
//       const productDetails = productMap.get(productId);
//       const requestedQuantity = parseInt(p.product_quantity, 10);
//       // Optionally update min_product_quantity if provided
//       const requestedMinQuantity = parseInt(p.product_min_quantity, 10);
//       const newQuantity = productDetails.product_quantity - requestedQuantity;
//       // const newMinQuantity = isNaN(requestedMinQuantity)
//       //   ? productDetails.product_min_quantity
//       //   : productDetails.product_min_quantity - requestedMinQuantity;

//       console.log(
//         `Preparing update for ${p.product_id}: product_quantity ${productDetails.product_quantity} -> ${newQuantity}, min_product_quantity ${productDetails.product_min_quantity} -> ${requestedMinQuantity}`
//       );

//       return {
//         updateOne: {
//           filter: { _id: productDetails._id },
//           update: { $set: { product_quantity: newQuantity } },
//         },
//       };
//     });

//     if (bulkOps.length > 0) {
//       try {
//         const bulkResult = await Product.bulkWrite(bulkOps);
//         console.log("Bulk update result:", bulkResult);
//       } catch (bulkError) {
//         console.error("Bulk update failed:", bulkError);
//         return res.status(500).json({
//           message: "Failed to update product quantities",
//           error: bulkError.message,
//           status: false,
//         });
//       }
//     } else {
//       console.log("No products to update (empty bulkOps)");
//       return res.status(400).json({
//         message: "No valid products to update",
//         status: false,
//       });
//     }

//     // Step 3: Prepare updated product details for the site
//     const updatedProductDetails = product.map(
//       ({ product_id, product_quantity, remaining_quantity, product_min_quantity, maintenance_count }) => {
//         const productId = product_id.trim().toLowerCase();
//         const productDetails = productMap.get(productId);

//         // Maintenance dates calculation
//         let maintenance_dates = null;
//         if (maintenance_count && maintenance_count > 0) {
//           maintenance_dates = [];
//           const totalMonths = moment(end_date).diff(moment(start_date), "months");
//           const interval = Math.floor(totalMonths / maintenance_count);
//           for (let i = 1; i <= maintenance_count; i++) {
//             maintenance_dates.push(
//               moment(start_date)
//                 .add(i * interval, "months")
//                 .format("DD/MM/YYYY")
//             );
//           }
//         }

//         return {
//           _id: productDetails._id,
//           product_quantity,
//           remaining_quantity,
//           product_min_quantity,
//           maintenance_date: maintenance_dates,
//         };
//       }
//     );

//     // Step 4: Create the site
//     const formattedStartDate = new Date(start_date).toLocaleDateString("en-IN");
//     const formattedEndDate = new Date(end_date).toLocaleDateString("en-IN");

//     const sites = await Site.create({
//       client_id: client_ids,
//       location_name,
//       location_lat,
//       location_long,
//       site_name,
//       start_date: formattedStartDate,
//       end_date: formattedEndDate,
//       contractfile: imageFiles,
//       sv_visit,
//       working_hrs,
//       man_power,
//       datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
//       amc,
//       product: updatedProductDetails,
//       amc_description,
//     });

//     console.log("Site created:", sites._id);

//     // Step 5: Update users with site_id if selectedIds are provided
//     if (client_id.selectedIds.length > 0) {
//       try {
//         const updateResult = await UserModel.updateMany(
//           { _id: { $in: client_id.selectedIds } },
//           { $set: { site_id: sites._id } }
//         );
//         console.log("Users updated with site_id:", updateResult);
//       } catch (error) {
//         console.error("Error updating users with site_id:", error);
//       }
//     }

//     // Step 6: Send email notification
//     const clientmail = await Client.findById(client_ids);
//     const sitesdata = await SiteMailSend(sites._id);

//     SendMail({
//       recipientEmail: clientmail.clientEmail,
//       subject: "Site Create Update",
//       html: SiteTemplate(sitesdata),
//     });

//     // Step 7: Return success response
//     return res.status(201).json({
//       sites: sites,
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error in Createsite:", error);
//     return res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

//its ruuning method coment 16/06/2025

// exports.Createsite = async (req, res) => {
//   const { client_id } = req.body;

//   // Log the entire request body for debugging
//   console.log("Request body:", JSON.stringify(req.body, null, 2));

//   // Validate required fields
//   if (
//     !client_id?.client_id ||
//     !client_id?.site_name ||
//     !client_id?.location_lat ||
//     !client_id?.location_long ||
//     !client_id?.location_name ||
//     !client_id?.start_date ||
//     !client_id?.end_date ||
//     !client_id?.sv_visit ||
//     !client_id?.working_hrs ||
//     !client_id?.man_power ||
//     !client_id?.productdata ||
//     !client_id?.amc ||
//     !client_id?.selectedIds
//   ) {
//     console.log("Missing required fields:", req.body);
//     return res.status(400).json({
//       message: "Please enter all the required fields.",
//       errors: {
//         client_id: !client_id?.client_id ? "Client ID is required" : undefined,
//         site_name: !client_id?.site_name ? "Site name is required" : undefined,
//         location_name: !client_id?.location_name ? "Location name is required" : undefined,
//         location_lat: !client_id?.location_lat ? "Location latitude is required" : undefined,
//         location_long: !client_id?.location_long ? "Location longitude is required" : undefined,
//         start_date: !client_id?.start_date ? "Start date is required" : undefined,
//         end_date: !client_id?.end_date ? "End date is required" : undefined,
//         sv_visit: !client_id?.sv_visit ? "SV visit is required" : undefined,
//         working_hrs: !client_id?.working_hrs ? "Working hours is required" : undefined,
//         man_power: !client_id?.man_power ? "Man power is required" : undefined,
//         productdata: !client_id?.productdata ? "Product data is required" : undefined,
//         amc: !client_id?.amc ? "AMC is required" : undefined,
//         selectedIds: !client_id?.selectedIds ? "Selected IDs is required" : undefined,
//       },
//       status: false,
//     });
//   }

//   const client_ids = client_id.client_id;
//   const site_name = client_id.site_name;
//   const location_name = client_id.location_name;
//   const location_lat = client_id.location_lat;
//   const location_long = client_id.location_long;
//   const start_date = client_id.start_date;
//   const end_date = client_id.end_date;
//   const sv_visit = client_id.sv_visit;
//   const working_hrs = client_id.working_hrs;
//   const man_power = client_id.man_power;
//   const imageFiles = client_id.imageFiles;
//   const amc = client_id.amc;
//   const product = client_id.productdata;
//   const amc_description = client_id.amc_descriptions;

//   try {
//     // Validate productdata array
//     if (!Array.isArray(product) || product.length === 0) {
//       console.log("Invalid productdata:", product);
//       return res.status(400).json({
//         message: "Product data is empty or invalid.",
//         status: false,
//       });
//     }

//     // Validate product IDs and ensure they are valid ObjectIds
//     const productIds = product.map((p, index) => {
//       if (!p.product_id || !mongoose.isValidObjectId(p.product_id)) {
//         throw new Error(`Invalid product ID at index ${index}: ${p.product_id}`);
//       }
//       return p.product_id;
//     });

//     // Fetch products from the database by _id
//     const products = await Product.find({
//       _id: { $in: productIds },
//     });

//     // Create a map of product details with _id as the key
//     const productMap = new Map(
//       products.map((p) => [
//         p._id.toString(), // Use _id as string for comparison
//         {
//           _id: p._id,
//           product_quantity: Number(p.product_quantity) || 0,
//           product_min_quantity: Number(p.product_min_quantity) || 0,
//         },
//       ])
//     );

//     console.log("Product Map:", Array.from(productMap.entries()));
//     console.log("Requested product IDs:", productIds);

//     // Step 1: Check product availability
//     const availabilityErrors = [];
//     product.forEach((p, index) => {
//       const productId = p.product_id; // No normalization needed for _id
//       const productDetails = productMap.get(productId);

//       // Check if product exists
//       if (!productDetails) {
//         availabilityErrors.push({
//           [`productdata[${index}].product_id`]: `Product with ID ${p.product_id} not found in database.`,
//         });
//         return;
//       }

//       const requestedQuantity = parseInt(p.product_quantity, 10);

//       // Validate requested quantity
//       if (isNaN(requestedQuantity) || requestedQuantity < 0) {
//         availabilityErrors.push({
//           [`productdata[${index}].product_quantity`]: `Invalid product quantity for ID ${p.product_id}: ${p.product_quantity}`,
//         });
//         return;
//       }

//       // Check if sufficient product_quantity is available
//       if (productDetails.product_quantity < requestedQuantity) {
//         availabilityErrors.push({
//           [`productdata[${index}].product_quantity`]: `Insufficient stock for this Product. Available: ${productDetails.product_quantity}, Requested: ${requestedQuantity}`,
//         });
//         return;
//       }

//       console.log(`Product ID ${p.product_id} check: Available ${productDetails.product_quantity}, Requested ${requestedQuantity}`);
//     });

//     // If there are any availability errors, stop and return
//     if (availabilityErrors.length > 0) {
//       console.log("Availability errors:", availabilityErrors);
//       return res.status(400).json({
//         message: "Product availability issues",
//         errors: availabilityErrors.reduce((acc, err) => ({ ...acc, ...err }), {}),
//         status: false,
//       });
//     }

//     // Step 2: Update product quantities for all products
//     const bulkOps = product.map((p) => {
//       const productId = p.product_id;
//       const productDetails = productMap.get(productId);
//       const requestedQuantity = parseInt(p.product_quantity, 10);
//       const newQuantity = productDetails.product_quantity - requestedQuantity;

//       console.log(`Preparing update for product ID ${p.product_id}: product_quantity ${productDetails.product_quantity} -> ${newQuantity}`);

//       return {
//         updateOne: {
//           filter: { _id: productDetails._id },
//           update: { $set: { product_quantity: newQuantity } },
//         },
//       };
//     });

//     if (bulkOps.length > 0) {
//       try {
//         const bulkResult = await Product.bulkWrite(bulkOps);
//         console.log("Bulk update result:", bulkResult);
//       } catch (bulkError) {
//         console.error("Bulk update failed:", bulkError);
//         return res.status(500).json({
//           message: "Failed to update product quantities",
//           error: bulkError.message,
//           status: false,
//         });
//       }
//     } else {
//       console.log("No products to update (empty bulkOps)");
//       return res.status(400).json({
//         message: "No valid products to update",
//         status: false,
//       });
//     }

//     // Step 3: Prepare updated product details for the site
//     const updatedProductDetails = product.map(({ product_id, product_quantity, remaining_quantity, product_min_quantity, maintenance_count }) => {
//       const productDetails = productMap.get(product_id);

//       // Maintenance dates calculation
//       let maintenance_dates = null;
//       if (maintenance_count && maintenance_count > 0) {
//         maintenance_dates = [];
//         const totalMonths = moment(end_date).diff(moment(start_date), "months");
//         const interval = Math.floor(totalMonths / maintenance_count);
//         for (let i = 1; i <= maintenance_count; i++) {
//           maintenance_dates.push(
//             moment(start_date)
//               .add(i * interval, "months")
//               .format("DD/MM/YYYY")
//           );
//         }
//       }

//       return {
//         _id: productDetails._id,
//         product_quantity,
//         remaining_quantity,
//         product_min_quantity,
//         maintenance_date: maintenance_dates,
//       };
//     });

//     // Step 4: Create the site
//     const formattedStartDate = new Date(start_date).toLocaleDateString("en-IN");
//     const formattedEndDate = new Date(end_date).toLocaleDateString("en-IN");

//     const sites = await Site.create({
//       client_id: client_ids,
//       location_name,
//       location_lat,
//       location_long,
//       site_name,
//       start_date: formattedStartDate,
//       end_date: formattedEndDate,
//       contractfile: imageFiles,
//       sv_visit,
//       working_hrs,
//       man_power,
//       datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
//       amc,
//       product: updatedProductDetails,
//       amc_description,
//     });

//     console.log("Site created:", sites._id);

//     // Step 5: Update users with site_id if selectedIds are provided
//     if (client_id.selectedIds.length > 0) {
//       try {
//         const updateResult = await UserModel.updateMany({ _id: { $in: client_id.selectedIds } }, { $set: { site_id: sites._id } });
//         console.log("Users updated with site_id:", updateResult);
//       } catch (error) {
//         console.error("Error updating users with site_id:", error);
//       }
//     }

//     // Step 6: Send email notification
//     const clientmail = await Client.findById(client_ids);
//     const sitesdata = await SiteMailSend(sites._id);

//     SendMail({
//       recipientEmail: clientmail.clientEmail,
//       subject: "Site Create Update",
//       html: SiteTemplate(sitesdata),
//     });

//     // Step 7: Return success response
//     return res.status(201).json({
//       sites,
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error in Createsite:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//       status: false,
//     });
//   }
// };

/// its working method

exports.Createsite = async (req, res) => {
  const { client_id } = req.body;

  // Log the entire request body for debugging
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  // Validate required fields
  if (
    !client_id?.client_id ||
    !client_id?.site_name ||
    !client_id?.location_lat ||
    !client_id?.location_long ||
    !client_id?.location_name ||
    !client_id?.start_date ||
    !client_id?.end_date ||
    !client_id?.sv_visit ||
    !client_id?.working_hrs ||
    !client_id?.man_power ||
    !client_id?.productdata ||
    !client_id?.amc ||
    !client_id?.selectedIds
  ) {
    console.log("Missing required fields:", req.body);
    return res.status(400).json({
      message: "Please enter all the required fields.",
      errors: {
        client_id: !client_id?.client_id ? "Client ID is required" : undefined,
        site_name: !client_id?.site_name ? "Site name is required" : undefined,
        location_name: !client_id?.location_name ? "Location name is required" : undefined,
        location_lat: !client_id?.location_lat ? "Location latitude is required" : undefined,
        location_long: !client_id?.location_long ? "Location longitude is required" : undefined,
        start_date: !client_id?.start_date ? "Start date is required" : undefined,
        end_date: !client_id?.end_date ? "End date is required" : undefined,
        sv_visit: !client_id?.sv_visit ? "SV visit is required" : undefined,
        working_hrs: !client_id?.working_hrs ? "Working hours is required" : undefined,
        man_power: !client_id?.man_power ? "Man power is required" : undefined,
        productdata: !client_id?.productdata ? "Product data is required" : undefined,
        amc: !client_id?.amc ? "AMC is required" : undefined,
        selectedIds: !client_id?.selectedIds ? "Selected IDs is required" : undefined,
      },
      status: false,
    });
  }

  const client_ids = client_id.client_id;
  const site_name = client_id.site_name;
  const location_name = client_id.location_name;
  const location_lat = client_id.location_lat;
  const location_long = client_id.location_long;
  const start_date = client_id.start_date;
  const end_date = client_id.end_date;
  const sv_visit = client_id.sv_visit;
  const working_hrs = client_id.working_hrs;
  const man_power = client_id.man_power;
  const imageFiles = client_id.imageFiles;
  const amc = client_id.amc;
  const product = client_id.productdata;
  const amc_description = client_id.amc_descriptions;

  try {
    // Validate productdata array
    if (!Array.isArray(product) || product.length === 0) {
      console.log("Invalid productdata:", product);
      return res.status(400).json({
        message: "Product data is empty or invalid.",
        status: false,
      });
    }

    // Validate product IDs and ensure they are valid ObjectIds
    const productIds = product.map((p, index) => {
      if (!p.product_id || !mongoose.isValidObjectId(p.product_id)) {
        throw new Error(`Invalid product ID at index ${index}: ${p.product_id}`);
      }
      return p.product_id;
    });

    // Fetch products from the database by _id
    const products = await Product.find({
      _id: { $in: productIds },
    });

    // Create a map of product details with _id as the key
    const productMap = new Map(
      products.map((p) => [
        p._id.toString(), // Use _id as string for comparison
        {
          _id: p._id,
          product_quantity: Number(p.product_quantity) || 0,
          product_min_quantity: Number(p.product_min_quantity) || 0,
        },
      ])
    );

    console.log("Product Map:", Array.from(productMap.entries()));
    console.log("Requested product IDs:", productIds);

    // Step 1: Check product availability
    const availabilityErrors = [];
    product.forEach((p, index) => {
      const productId = p.product_id; // No normalization needed for _id
      const productDetails = productMap.get(productId);

      // Check if product exists
      if (!productDetails) {
        availabilityErrors.push({
          [`productdata[${index}].product_id`]: `Product with ID ${p.product_id} not found in database.`,
        });
        return;
      }

      const requestedQuantity = parseInt(p.product_quantity, 10);

      // Validate requested quantity
      if (isNaN(requestedQuantity) || requestedQuantity < 0) {
        availabilityErrors.push({
          [`productdata[${index}].product_quantity`]: `Invalid product quantity for ID ${p.product_id}: ${p.product_quantity}`,
        });
        return;
      }

      // Check if sufficient product_quantity is available
      if (productDetails.product_quantity < requestedQuantity) {
        availabilityErrors.push({
          [`productdata[${index}].product_quantity`]: `Insufficient stock for this Product. Available: ${productDetails.product_quantity}, Requested: ${requestedQuantity}`,
        });
        return;
      }

      console.log(`Product ID ${p.product_id} check: Available ${productDetails.product_quantity}, Requested ${requestedQuantity}`);
    });

    // If there are any availability errors, stop and return
    if (availabilityErrors.length > 0) {
      console.log("Availability errors:", availabilityErrors);
      return res.status(400).json({
        message: "Product availability issues",
        errors: availabilityErrors.reduce((acc, err) => ({ ...acc, ...err }), {}),
        status: false,
      });
    }

    // Step 2: Update product quantities for all products
    const bulkOps = product.map((p) => {
      const productId = p.product_id;
      const productDetails = productMap.get(productId);
      const requestedQuantity = parseInt(p.product_quantity, 10);
      const newQuantity = productDetails.product_quantity - requestedQuantity;

      console.log(`Preparing update for product ID ${p.product_id}: product_quantity ${productDetails.product_quantity} -> ${newQuantity}`);

      return {
        updateOne: {
          filter: { _id: productDetails._id },
          update: { $set: { product_quantity: newQuantity } },
        },
      };
    });

    if (bulkOps.length > 0) {
      try {
        const bulkResult = await Product.bulkWrite(bulkOps);
        console.log("Bulk update result:", bulkResult);
      } catch (bulkError) {
        console.error("Bulk update failed:", bulkError);
        return res.status(500).json({
          message: "Failed to update product quantities",
          error: bulkError.message,
          status: false,
        });
      }
    } else {
      console.log("No products to update (empty bulkOps)");
      return res.status(400).json({
        message: "No valid products to update",
        status: false,
      });
    }

    // Step 3: Prepare updated product details for the site
    const updatedProductDetails = product.map(({ product_id, product_quantity, remaining_quantity, product_min_quantity, maintenance_count }) => {
      const productDetails = productMap.get(product_id);

      // Maintenance dates calculation
      // Maintenance dates calculation
      let maintenance_dates = null;
      if (maintenance_count && maintenance_count > 0) {
        const start = moment(start_date, moment.ISO_8601, true);
        const end = moment(end_date, moment.ISO_8601, true);

        if (!start.isValid() || !end.isValid()) {
          return res.status(400).json({
            message: "Invalid start_date or end_date format.",
            status: false,
          });
        }

        const totalMonths = end.diff(start, "months");
        const interval = Math.floor(totalMonths / maintenance_count);
        maintenance_dates = [];
        console.log("maintenance", maintenance_dates)

        for (let i = 1; i <= maintenance_count; i++) {
          maintenance_dates.push(
            start
              .clone()
              .add(i * interval, "months")
              .format("DD/MM/YYYY")
          );
        }
      }

      return {
        _id: productDetails._id,
        product_quantity,
        remaining_quantity,
        product_min_quantity,
        maintenance_date: maintenance_dates,
      };
    });

    // Step 4: Create the site
    const formattedStartDate = new Date(start_date).toLocaleDateString("en-IN");
    const formattedEndDate = new Date(end_date).toLocaleDateString("en-IN");
   console.log("updatedProductDetails", updatedProductDetails)
    const sites = await Site.create({
      client_id: client_ids,
      location_name,
      location_lat,
      location_long,
      site_name,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      contractfile: imageFiles,
      sv_visit,
      working_hrs,
      man_power,
      datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
      amc,
      product: updatedProductDetails,
      amc_description,
    });

    console.log("Site created:", sites._id);

    // Step 5: Update users with site_id if selectedIds are provided
    if (client_id.selectedIds.length > 0) {
      try {
        const updateResult = await UserModel.updateMany({ _id: { $in: client_id.selectedIds } }, { $set: { site_id: sites._id } });
        console.log("Users updated with site_id:", updateResult);
      } catch (error) {
        console.error("Error updating users with site_id:", error);
      }
    }

    // Step 6: Send email notification
    const clientmail = await Client.findById(client_ids);
    const sitesdata = await SiteMailSend(sites._id);

    SendMail({
      recipientEmail: clientmail.clientEmail,
      subject: "Site Create Update",
      html: SiteTemplate(sitesdata),
    });

    // Step 7: Return success response
    return res.status(201).json({
      sites,
      status: true,
    });
  } catch (error) {
    console.error("Error in Createsite:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

exports.CreateSiteimage = (req, res) => {
  upload.array("contractfile", 10)(req, res, function (err) {
    // Allow up to 10 files
    if (err) {
      console.error("Error uploading images:", err);
      // Handle error if any
      return res.status(400).json({ error: "Error uploading images" });
    }
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    // Return image names and paths
    const fileDetails = req.files.map((file) => ({
      filename: "./uploads/Contract_Pages/" + file.filename,
    }));
    return res.json({ files: fileDetails });
  });
};

exports.EditSiteData = async (req, res) => {
  const { client_id } = req.body;
  if (!client_id.client_id || !client_id.site_name || !client_id.location_name || !client_id.start_date || !client_id.end_date || !client_id.sv_visit || !client_id.working_hrs || !client_id.man_power || !client_id.amc || !client_id.siteId) {
    return res.status(400).json({
      message: "Please enter all the required fields.",
      status: false,
    });
  }

  const client_ids = client_id.client_id;
  const site_name = client_id.site_name;
  const location_name = client_id.location_name;
  const location_lat = client_id.location_lat;
  const location_long = client_id.location_long;
  const start_date = client_id.start_date;
  const end_date = client_id.end_date;
  const sv_visit = client_id.sv_visit;
  const working_hrs = client_id.working_hrs;
  const man_power = client_id.man_power;
  const imageFiles = client_id.imageFiles;
  const amc = client_id.amc;
  const discount = client_id.discount || null;
  const amc_description = client_id.amc_descriptions;
  const site_id = client_id.siteId;

  try {
    const formattedStartDate = new Date(start_date).toLocaleDateString("en-IN");
    const formattedEndDate = new Date(end_date).toLocaleDateString("en-IN");

    const site = await Site.findOne({ _id: site_id });
    if (!site) {
      return res.status(404).json({
        message: "Site not found",
        status: false,
      });
    }

    site.client_id = client_ids;
    site.location_name = location_name;
    site.site_name = site_name;
    site.start_date = formattedStartDate;
    site.end_date = formattedEndDate;
    site.sv_visit = sv_visit;
    site.working_hrs = working_hrs;
    site.man_power = man_power;
    site.amc = amc;
    site.amc_description = amc_description;
    site.discount = discount;
    site.datetime = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");

    if (Array.isArray(site.contractfile)) {
      if (imageFiles !== null) {
        // Add new imageFiles to the existing contractfile array
        site.contractfile.push(...imageFiles);
      }
    } else {
      if (imageFiles !== null) {
        // If contractfile is not an array, initialize it and add imageFiles
        site.contractfile = imageFiles;
      }
    }

    if (location_lat !== "" || location_long !== "") {
      site.location_lat = location_lat;
      site.location_long = location_long;
    }

    await site.save();

    return res.status(200).json({
      site: site,
      status: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.EditSiteAllotUser = async (req, res) => {
  const { selectedIds, site_id } = req.body;

  // Check if selectedIds is provided and not empty
  if (!selectedIds || selectedIds.length === 0) {
    return res.status(400).json({
      message: "Please Select Service Engineer or some blank field.",
      status: false,
    });
  }

  // Convert site_id to string
  const firstSiteId = site_id.toString();
  try {
    // Step 1: Find all users with the given site_id
    let usersWithSiteId = await UserModel.aggregate([
      {
        $match: {
          site_id: firstSiteId, // Match users with the given site_id as a string
        },
      },
      {
        $project: { _id: 1 }, // Only include the _id field
      },
    ]);

    // Extract user IDs from the aggregation result
    const userIdsWithSiteId = usersWithSiteId.map((user) => user._id);

    // Step 2: Remove the site_id from all users who have the given site_id
    await UserModel.updateMany({ _id: { $in: userIdsWithSiteId } }, { $set: { site_id: [] } });
    //console.log("Site_id removed from all users who had it.");

    // Step 3: Update the users in selectedIds with the new site_id
    await UserModel.updateMany({ _id: { $in: selectedIds } }, { $set: { site_id: firstSiteId } });
    //console.log("Users updated with site_id successfully.");

    return res.status(200).json({
      message: "Users updated successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Error updating users with site_id:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

// exports.EditSiteAllotUser = async (req, res) => {
//   const { selectedIds, site_id } = req.body;

//   // Log the request body for debugging
//   console.log("Request body:", JSON.stringify(req.body, null, 2));

//   // Check if selectedIds and site_id are provided
//   if (!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
//     console.log("Missing or invalid selectedIds:", selectedIds);
//     return res.status(400).json({
//       message: "Please provide valid selected IDs.",
//       status: false,
//     });
//   }

//   if (!site_id) {
//     console.log("Missing site_id:", site_id);
//     return res.status(400).json({
//       message: "Please provide the site ID.",
//       status: false,
//     });
//   }

//   // Convert site_id to string
//   const firstSiteId = site_id.toString();

//   try {
//     // Step 1: Fetch the site to get its product details
//     const site = await Site.findById(firstSiteId);
//     if (!site) {
//       console.log("Site not found:", firstSiteId);
//       return res.status(400).json({
//         message: "Site not found.",
//         status: false,
//       });
//     }

//     // Validate site.product array
//     if (!site.product || !Array.isArray(site.product) || site.product.length === 0) {
//       console.log("No products associated with site:", site.product);
//       return res.status(400).json({
//         message: "No products associated with the site.",
//         status: false,
//       });
//     }

//     // Step 2: Fetch products from the Product collection
//     const productIds = site.product.map((p) => p._id);
//     const products = await Product.find({
//       _id: { $in: productIds },
//     });

//     // Create a map of product details
//     const productMap = new Map(
//       products.map((p) => [
//         p._id.toString(),
//         {
//           _id: p._id,
//           product_quantity: Number(p.product_quantity) || 0,
//           product_min_quantity: Number(p.product_min_quantity) || 0,
//         },
//       ])
//     );

//     console.log("Product Map:", Array.from(productMap.entries()));
//     console.log("Site products:", site.product);

//     // Step 3: Check product availability (only product_quantity)
//     const availabilityErrors = [];
//     for (const p of site.product) {
//       const productId = p._id.toString();
//       const productDetails = productMap.get(productId);

//       // Check if product exists
//       if (!productDetails) {
//         availabilityErrors.push(`Product with ID ${productId} not found in database.`);
//         continue;
//       }

//       const requestedQuantity = parseInt(p.product_quantity, 10);

//       // Validate requested quantity
//       if (isNaN(requestedQuantity) || requestedQuantity < 0) {
//         availabilityErrors.push(`Invalid product quantity for product ID ${productId}: ${p.product_quantity}`);
//         continue;
//       }

//       // Check if sufficient product_quantity is available
//       if (productDetails.product_quantity < requestedQuantity) {
//         availabilityErrors.push(
//           `Insufficient stock for product ID ${productId}. Available: ${productDetails.product_quantity}, Requested: ${requestedQuantity}`
//         );
//         continue;
//       }

//       console.log(
//         `Product ${productId} check: Available ${productDetails.product_quantity}, Requested ${requestedQuantity}`
//       );
//     }

//     // If there are any availability errors, stop and return
//     if (availabilityErrors.length > 0) {
//       console.log("Availability errors:", availabilityErrors);
//       return res.status(400).json({
//         message: "Product availability issues",
//         errors: availabilityErrors,
//         status: false,
//       });
//     }

//     // Step 4: Update product quantities for all products
//     const bulkOps = site.product.map((p) => {
//       const productId = p._id.toString();
//       const productDetails = productMap.get(productId);
//       const requestedQuantity = parseInt(p.product_quantity, 10);
//       // Optionally update min_product_quantity if provided
//       const requestedMinQuantity = parseInt(p.min_product_quantity, 10);
//       const newQuantity = productDetails.product_quantity - requestedQuantity;
//       // const newMinQuantity = isNaN(requestedMinQuantity)
//       //   ? productDetails.product_min_quantity
//       //   : productDetails.product_min_quantity - requestedMinQuantity;

//       console.log(
//         `Preparing update for product ID ${productId}: product_quantity ${productDetails.product_quantity} -> ${newQuantity}, min_product_quantity ${productDetails.product_min_quantity} -> ${requestedMinQuantity}`
//       );

//       return {
//         updateOne: {
//           filter: { _id: productDetails._id },
//           update: { $set: { product_quantity: newQuantity, product_min_quantity: requestedMinQuantity } },
//         },
//       };
//     });

//     if (bulkOps.length > 0) {
//       try {
//         const bulkResult = await Product.bulkWrite(bulkOps);
//         console.log("Bulk update result:", bulkResult);
//       } catch (bulkError) {
//         console.error("Bulk update failed:", bulkError);
//         return res.status(500).json({
//           message: "Failed to update product quantities",
//           error: bulkError.message,
//           status: false,
//         });
//       }
//     } else {
//       console.log("No products to update (empty bulkOps)");
//       return res.status(400).json({
//         message: "No valid products to update",
//         status: false,
//       });
//     }

//     // Step 5: Find all users with the given site_id
//     let usersWithSiteId = await UserModel.aggregate([
//       {
//         $match: {
//           site_id: firstSiteId,
//         },
//       },
//       {
//         $project: { _id: 1 },
//       },
//     ]);

//     // Extract user IDs
//     const userIdsWithSiteId = usersWithSiteId.map((user) => user._id);

//     // Step 6: Remove site_id from all users who have the given site_id
//     await UserModel.updateMany(
//       { _id: { $in: userIdsWithSiteId } },
//       { $set: { site_id: [] } }
//     );
//     console.log("Site_id removed from users:", userIdsWithSiteId);

//     // Step 7: Update the users in selectedIds with the new site_id
//     const updateResult = await UserModel.updateMany(
//       { _id: { $in: selectedIds } },
//       { $set: { site_id: firstSiteId } }
//     );
//     console.log("Users updated with site_id:", updateResult);

//     return res.status(200).json({
//       message: "Users and product quantities updated successfully.",
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error in EditSiteAllotUser:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//       status: false,
//     });
//   }
// };

//  comment by Atest 24/04/25

// exports.EditSiteProductData = async (req, res) => {
//   const { productdata, site_id } = req.body;

//   // Check if productdata is provided and not empty
//   if (!productdata || productdata.length === 0) {
//     return res.status(400).json({
//       message: "Please provide the product data.",
//       status: false,
//     });
//   }

//   try {
//     const site = await Site.findOne({ _id: site_id });
//     if (!site) {
//       return res.status(404).json({
//         message: "Site not found",
//         status: false,
//       });
//     }

//     // Create a map of product IDs to their existing data
//     const productIds = productdata.map((p) => p.product_id.trim());
//     const products = await Product.find({ _id: { $in: productIds } });

//     const productMap = new Map(products.map((p) => [p._id.toString(), { _id: p._id, product_quantity: p.product_quantity, product_min_quantity: p.min_product_quantity }]));

//     // Initialize updatedProductArray with existing products
//     const updatedProductArray = [];

//     // Update existing products
//     site.product.forEach((p) => {
//       const productDetails = productMap.get(p._id.toString());
//       if (productDetails) {
//         const productData = productdata.find((pd) => pd.product_id === p._id.toString());
//         const productQuantity = parseInt(productData.product_quantity, 10);
//         const productMinQuantity = parseInt(productData.product_min_quantity, 10);

//         updatedProductArray.push({
//           ...p,
//           product_quantity: productQuantity,
//           remaining_quantity: productQuantity,
//           product_min_quantity: productMinQuantity,
//           deleted_at: false,
//         });
//       } else {
//         // Keep existing product if it's not in the productdata
//         updatedProductArray.push(p);
//       }
//     });

//     // Add new products
//     for (const pd of productdata) {
//       if (!site.product.some((p) => p._id.toString() === pd.product_id)) {
//         //2025-07-31T18:30:00.000Z
//         const startDate = moment(site.start_date, "D/M/YYYY");
//         const endDate = moment(site.end_date, "D/M/YYYY");

//         // Convert dates to ISO format
//         const startDateISO = startDate.toISOString();
//         const endDateISO = endDate.toISOString();

//         console.log("Start Date in ISO format:", startDateISO);
//         console.log("End Date in ISO format:", endDateISO);
//         const maintenance_dates =
//           pd.maintenance_count && pd.maintenance_count > 0
//             ? Array.from({ length: pd.maintenance_count }, (_, i) =>
//                 moment(startDateISO)
//                   .add(i * (moment(endDateISO).diff(moment(startDateISO), "months") / pd.maintenance_count), "months")
//                   .format("DD/MM/YYYY")
//               )
//             : null;

//         updatedProductArray.push({
//           _id: pd.product_id,
//           product_quantity: parseInt(pd.product_quantity, 10),
//           remaining_quantity: parseInt(pd.product_quantity, 10),
//           product_min_quantity: parseInt(pd.product_min_quantity, 10),
//           maintenance_date: maintenance_dates,
//           already_maintenance: pd.already_maintenance || [],
//           maintenance_alert: "No", // Or set accordingly
//           deleted_at: false,
//         });
//       }
//     }

//     site.product = updatedProductArray;
//     await site.save();

//     return res.status(200).json({
//       message: "Product data updated successfully.",
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error updating site product data:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

// edit by Atest 24/04/25

// exports.EditSiteProductData = async (req, res) => {
//   const { productdata, site_id } = req.body;

//   // Validate input
//   if (!productdata || !Array.isArray(productdata) || productdata.length === 0) {
//     return res.status(400).json({
//       message: "Please provide valid product data.",
//       status: false,
//     });
//   }

//   try {
//     // Fetch site
//     const site = await Site.findOne({ _id: site_id });
//     if (!site) {
//       return res.status(404).json({
//         message: "Site not found",
//         status: false,
//       });
//     }

//     // Fetch products
//     const productIds = productdata.map((p) => p.product_id.trim());
//     const products = await Product.find({ _id: { $in: productIds } });
//     const productMap = new Map(products.map((p) => [p._id.toString(), p]));

//     // Validate product IDs and quantities
//     const errors = [];
//     for (const pd of productdata) {
//       const product = productMap.get(pd.product_id);
//       if (!product) {
//         errors.push(`Product ID ${pd.product_id} not found.`);
//         continue;
//       }
//       const quantity = parseInt(pd.product_quantity, 10);
//       if (isNaN(quantity) || quantity <= 0) {
//         errors.push(`Invalid quantity for product ${pd.product_id}: ${pd.product_quantity}`);
//         continue;
//       }
//       // Check if product_quantity is a string in the database
//       if (typeof product.product_quantity === "string") {
//         console.warn(
//           `Warning: Product ${pd.product_id} has string product_quantity: ${product.product_quantity}`
//         );
//       }
//     }
//     if (errors.length > 0) {
//       return res.status(400).json({
//         message: "Validation errors",
//         errors,
//         status: false,
//       });
//     }

//     // Check quantity availability and calculate differences
//     const quantityUpdates = [];
//     for (const pd of productdata) {
//       const product = productMap.get(pd.product_id);
//       const newQuantity = parseInt(pd.product_quantity, 10);
//       const existingProduct = site.product.find((p) => p._id.toString() === pd.product_id);

//       if (existingProduct) {
//         // Existing product: calculate difference
//         const oldQuantity = parseInt(existingProduct.product_quantity, 10) || 0;
//         if (isNaN(oldQuantity)) {
//           errors.push(`Invalid existing quantity for product ${pd.product_id} in site data`);
//           continue;
//         }
//         const quantityDiff = newQuantity - oldQuantity; // Positive: need more; Negative: return some
//         if (quantityDiff > 0) {
//           // Need additional quantity
//           const availableQuantity = parseInt(product.product_quantity, 10) || 0;
//           if (isNaN(availableQuantity)) {
//             errors.push(`Invalid product quantity for product ${pd.product_id} in product data`);
//             continue;
//           }
//           if (availableQuantity < quantityDiff) {
//             errors.push(
//               `Insufficient quantity for product ${pd.product_id}. Available: ${availableQuantity}, Requested: ${quantityDiff}`
//             );
//           } else {
//             quantityUpdates.push({
//               productId: pd.product_id,
//               change: -quantityDiff, // Subtract additional quantity
//             });
//           }
//         } else if (quantityDiff < 0) {
//           // Return excess quantity
//           quantityUpdates.push({
//             productId: pd.product_id,
//             change: -quantityDiff, // Add back the difference
//           });
//         }
//         // No change if quantityDiff === 0
//       } else {
//         // New product: check full quantity
//         const availableQuantity = parseInt(product.product_quantity, 10) || 0;
//         if (isNaN(availableQuantity)) {
//           errors.push(`Invalid product quantity for product ${pd.product_id} in product data`);
//           continue;
//         }
//         if (availableQuantity < newQuantity) {
//           errors.push(
//             `Insufficient quantity for product ${pd.product_id}. Available: ${availableQuantity}, Requested: ${newQuantity}`
//           );
//         } else {
//           quantityUpdates.push({
//             productId: pd.product_id,
//             change: -newQuantity, // Subtract full quantity
//           });
//         }
//       }
//     }

//     if (errors.length > 0) {
//       return res.status(400).json({
//         message: "Insufficient product quantities or invalid data",
//         errors,
//         status: false,
//       });
//     }

//     // Update Product quantities
//     for (const update of quantityUpdates) {
//       const change = Number(update.change); // Ensure numeric value
//       if (isNaN(change)) {
//         return res.status(500).json({
//           message: `Invalid quantity change for product ${update.productId}`,
//           status: false,
//         });
//       }
//       // Ensure product_quantity is numeric before incrementing
//       await Product.updateOne(
//         { _id: update.productId, product_quantity: { $type: ["int", "long", "double"] } },
//         { $inc: { product_quantity: change } }
//       );
//       // If product_quantity is a string, convert it first
//       await Product.updateOne(
//         { _id: update.productId, product_quantity: { $type: "string" } },
//         [
//           { $set: { product_quantity: { $toInt: "$product_quantity" } } },
//           { $inc: { product_quantity: change } },
//         ]
//       );
//     }

//     // Prepare updated product array
// const updatedProductArray = [];
// const startDate = moment(site.start_date);
// const endDate = moment(site.end_date);
// if (!startDate.isValid() || !endDate.isValid()) {
//   return res.status(400).json({
//     message: "Invalid site start or end date.",
//     status: false,
//   });
// }

//     // Update existing products
//     site.product.forEach((p) => {
//       const productData = productdata.find((pd) => pd.product_id === p._id.toString());
//       if (productData) {
//         const productQuantity = parseInt(productData.product_quantity, 10);
//         const productMinQuantity = parseInt(productData.product_min_quantity, 10);
//         const maintenanceCount = parseInt(productData.maintenance_count, 10) || 0;

//         let maintenanceDates = p.maintenance_date || [];
//         if (maintenanceCount > 0) {
//           maintenanceDates = Array.from({ length: maintenanceCount }, (_, i) =>
//             moment(startDate)
//               .add((i * endDate.diff(startDate, "days")) / maintenanceCount, "days")
//               .format("DD/MM/YYYY")
//           );
//         }

//         updatedProductArray.push({
//           ...p,
//           product_quantity: productQuantity,
//           remaining_quantity: productQuantity,
//           product_min_quantity: productMinQuantity,
//           maintenance_date: maintenanceDates,
//           deleted_at: false,
//         });
//       } else {
//         updatedProductArray.push(p);
//       }
//     });

//     // Add new products
//     for (const pd of productdata) {
//       if (!site.product.some((p) => p._id.toString() === pd.product_id)) {
//         const productQuantity = parseInt(pd.product_quantity, 10);
//         const productMinQuantity = parseInt(pd.product_min_quantity, 10);
//         const maintenanceCount = parseInt(pd.maintenance_count, 10) || 0;

//         let maintenanceDates = null;
//         if (maintenanceCount > 0) {
//           maintenanceDates = Array.from({ length: maintenanceCount }, (_, i) =>
//             moment(startDate)
//               .add((i * endDate.diff(startDate, "days")) / maintenanceCount, "days")
//               .format("DD/MM/YYYY")
//           );
//         }

//         updatedProductArray.push({
//           _id: pd.product_id,
//           product_quantity: productQuantity,
//           remaining_quantity: productQuantity,
//           product_min_quantity: productMinQuantity,
//           maintenance_date: maintenanceDates,
//           already_maintenance: pd.already_maintenance || [],
//           maintenance_alert: "No",
//           deleted_at: false,
//         });
//       }
//     }

//     // Update site
//     site.product = updatedProductArray;
//     await site.save();

//     return res.status(200).json({
//       message: "Product data updated successfully.",
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error updating site product data:", error);
//     return res.status(500).json({
//       message: `Internal Server Error: ${error.message}`,
//       status: false,
//     });
//   }
// };

exports.EditSiteProductData = async (req, res) => {
  const { productdata, site_id } = req.body;

  if (!productdata || !Array.isArray(productdata) || productdata.length === 0) {
    return res.status(400).json({
      message: "Please provide valid product data.",
      status: false,
    });
  }

  try {
    const site = await Site.findOne({ _id: site_id });
    if (!site) {
      return res.status(404).json({
        message: "Site not found",
        status: false,
      });
    }

    const productIds = productdata.map((p) => p.product_id.trim());
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const errors = [];
    for (const pd of productdata) {
      const product = productMap.get(pd.product_id);
      if (!product) {
        errors.push(`Product ID ${pd.product_id} not found.`);
        continue;
      }
      const quantity = parseInt(pd.product_quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        errors.push(`Invalid quantity for product ${pd.product_id}: ${pd.product_quantity}`);
        continue;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation errors",
        errors,
        status: false,
      });
    }

    const quantityUpdates = [];
    const productUpdatePromises = [];
    for (const pd of productdata) {
      const product = productMap.get(pd.product_id);
      const newQuantity = parseInt(pd.product_quantity, 10);
      const existingProduct = site.product.find((p) => p._id.toString() === pd.product_id);

      if (existingProduct) {
        const oldQuantity = parseInt(existingProduct.product_quantity, 10) || 0;
        const quantityDiff = newQuantity - oldQuantity;
        const availableQuantity = parseInt(product.product_quantity, 10) || 0;
        const productName = product.product_name;
        if (quantityDiff > 0) {
          if (availableQuantity < quantityDiff) {
            errors.push(`Insufficient quantity for product ${productName}. Available: ${availableQuantity}, Requested: ${quantityDiff}`);
          } else {
            quantityUpdates.push({ productId: pd.product_id, newQuantity: availableQuantity - quantityDiff });
            // Update the Product's quantity directly in the Product model
            productUpdatePromises.push(Product.updateOne({ _id: pd.product_id }, { $set: { product_quantity: availableQuantity - quantityDiff } }));
          }
        } else if (quantityDiff < 0) {
          quantityUpdates.push({ productId: pd.product_id, newQuantity: availableQuantity + Math.abs(quantityDiff) });
          // Update the Product's quantity directly in the Product model
          productUpdatePromises.push(Product.updateOne({ _id: pd.product_id }, { $set: { product_quantity: availableQuantity + Math.abs(quantityDiff) } }));
        }
      } else {
        const availableQuantity = parseInt(product.product_quantity, 10) || 0;
        if (availableQuantity < newQuantity) {
          errors.push(`Insufficient quantity for product ${pd.product_id}. Available: ${availableQuantity}, Requested: ${newQuantity}`);
        } else {
          quantityUpdates.push({ productId: pd.product_id, newQuantity: availableQuantity - newQuantity });
          // Update the Product's quantity directly in the Product model
          productUpdatePromises.push(Product.updateOne({ _id: pd.product_id }, { $set: { product_quantity: availableQuantity - newQuantity } }));
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Insufficient product quantities or invalid data",
        errors,
        status: false,
      });
    }

    // Execute all product updates in parallel
    await Promise.all(productUpdatePromises);

    const startDate = site.start_date ? moment(site.start_date, "D/M/YYYY") : null;
    const endDate = site.end_date ? moment(site.end_date, "D/M/YYYY") : null;

    if (!startDate?.isValid() || !endDate?.isValid()) {
      return res.status(400).json({
        message: "Invalid site start or end date.",
        status: false,
      });
    }

    const updatedProductArray = [];

    site.product.forEach((p) => {
      const productData = productdata.find((pd) => pd.product_id === p._id.toString());
      if (productData) {
        const productQuantity = parseInt(productData.product_quantity, 10);
        const productMinQuantity = parseInt(productData.product_min_quantity, 10);
        const maintenanceCount = parseInt(productData.maintenance_count, 10) || 0;

        let maintenanceDates = [];
        if (maintenanceCount > 0) {
          maintenanceDates = Array.from({ length: maintenanceCount }, (_, i) =>
            moment(startDate)
              .add((i * endDate.diff(startDate, "days")) / maintenanceCount, "days")
              .format("DD/MM/YYYY")
          );
        }

        updatedProductArray.push({
          _id: p._id, // Preserve the existing product ID to ensure it gets updated
          product_quantity: productQuantity,
          remaining_quantity: productQuantity,
          product_min_quantity: productMinQuantity,
          maintenance_date: maintenanceDates,
          deleted_at: p.deleted_at || false,
        });
      } else {
        updatedProductArray.push(p);
      }
    });

    for (const pd of productdata) {
      if (!site.product.some((p) => p._id.toString() === pd.product_id)) {
        const productQuantity = parseInt(pd.product_quantity, 10);
        const productMinQuantity = parseInt(pd.product_min_quantity, 10);
        const maintenanceCount = parseInt(pd.maintenance_count, 10) || 0;

        let maintenanceDates = null;
        if (maintenanceCount > 0) {
          maintenanceDates = Array.from({ length: maintenanceCount }, (_, i) =>
            moment(startDate)
              .add((i * endDate.diff(startDate, "days")) / maintenanceCount, "days")
              .format("DD/MM/YYYY")
          );
        }

        updatedProductArray.push({
          _id: pd.product_id,
          product_quantity: productQuantity,
          remaining_quantity: productQuantity,
          product_min_quantity: productMinQuantity,
          maintenance_date: maintenanceDates,
          already_maintenance: pd.already_maintenance || [],
          maintenance_alert: "No",
          deleted_at: false,
        });
      }
    }

    // Update the site.product array with the updated products
    site.product = updatedProductArray;

    // Save the updated site document
    await site.save();

    return res.status(200).json({
      message: "Product data updated successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Error updating site product data:", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      status: false,
    });
  }
};

exports.DeleteSiteImage = async (req, res) => {
  const { site_id, index } = req.body;
  try {
    const site = await Site.findById(site_id);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }
    if (!site.contractfile || site.contractfile.length <= index) {
      return res.status(400).json({ error: "Invalid index" });
    }
    console.log(site.contractfile);

    const filePath = path.join(__dirname, "..", site.contractfile[index]);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ error: "Error deleting file" });
      }

      // Remove the file path from the contractfile array
      site.contractfile.splice(index, 1);
      site
        .save()
        .then(() => res.json({ message: "File deleted and site updated" }))
        .catch((error) => res.status(500).json({ error: "Error updating site" }));
    });
  } catch (error) {
    console.error("DeleteSiteImage API error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllSite = async (req, res) => {
  const { page = 1, search = "", Short = "" } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  // Build the query based on search and Short
  const query = search
    ? {
        $or: [{ site_name: { $regex: search, $options: "i" } }],
      }
    : {};

  sortCriteria = { _id: -1 };

  try {
    const users = await Site.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "client_id",
        select: "clientName",
      })
      .populate({
        path: "product._id",
        select: "product_name",
      });

    let i = 0;
    // Add baseURL to pic property of each user
    const updatedUsers = users.map((user) => {
      i++;
      return {
        ...user.toObject(),
        orderId: i,
      };
    });

    const totalCount = await Site.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      first_page_url: `${baseURL}api/users?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${baseURL}api/users?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${baseURL}api/users?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: null,
      path: `${baseURL}api/users`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Sites: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getAllSiteName = async (req, res) => {
  try {
    const users = await Site.find({}).select("_id site_name").sort({ site_name: 1 }); // Sort clientName in ascending order

    const totalCount = await Site.countDocuments({});

    res.json({
      totalCount: totalCount,
      site_name: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.UpdateSite = async (req, res) => {
  const { site_id, new_client_id, new_product_id, new_product_quantity, new_location_name, new_start_date, new_end_date } = req.body;

  const _id = site_id;
  try {
    if (!site_id || !new_client_id || !new_product_id || !new_product_quantity || !new_location_name || !new_start_date || !new_end_date) {
      return res.status(400).json({
        message: "Please provide all filed.",
        status: false,
      });
    }

    const formattedStartDate = new Date(new_start_date).toLocaleDateString("en-IN");
    const formattedEndDate = new Date(new_end_date).toLocaleDateString("en-IN");
    console.log(new_product_quantity);
    // Find the site by ID and update its name
    const site = await Site.findByIdAndUpdate(
      _id,
      {
        client_id: new_client_id,
        location_name: new_location_name,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        product_id: new_product_id,
        product_quantity: new_product_quantity,
      },
      { new: true } // To return the updated site
    );

    if (!site) {
      return res.status(404).json({
        message: "Site not found.",
        status: false,
      });
    }

    // Return the updated site
    res.status(200).json({
      site,
      message: "Site updated successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Error updating site:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.GetSiteHistory = async (req, res) => {
  const { date } = req.body;
  const userId = req.headers.userID;

  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }
  if (!userId) {
    return res.status(400).json({ error: "userID is required" });
  }

  try {
    // Find the user by userId
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming site_id is stored as an array and we need the first element
    const site_id = user.site_id[0];

    // Convert date to MongoDB compatible format
    const formattedDate = moment(date, "MM/DD/YYYY").format("DD-MM-YYYY");

    // Find records in Report by formattedDate and site_id
    const products = await Report.find({
      date: formattedDate,
      site_id: site_id, // Ensure site_id is an ObjectId
    })
      .populate({
        path: "userId",
        select: "full_name pic",
      })
      .populate({
        path: "product._id",
        populate: {
          path: "problem_id",
          model: "Problem", // Specify the model to populate from
          select: "problem _id", // Select fields from Problem model
        },
      })
      .populate({
        path: "site_id",
      });

    // Modify response to prepend baseURL to image URLs and handle problem_id
    const responseProducts = await Promise.all(
      products.map(async (product) => {
        if (product.userId.pic) {
          product.userId.pic = `${baseURL}${product.userId.pic}`;
        }

        if (product.product && product.product.length > 0) {
          await Promise.all(
            product.product.map(async (prod) => {
              if (prod.problem_id) {
                // Fetch additional details from Problem model
                const problem = await Problem.findById(prod.problem_id._id).select("_id problem").exec(); // Ensure to access _id of problem_id and execute the query
                if (problem) {
                  prod.problem_id = problem; // Assign the entire problem object
                  console.log(prod.problem_id); // Debugging to check if problem_id is now the entire Problem object
                }
              }
              if (prod.images) {
                prod.images = prod.images.map((imageUrl) => `${baseURL}${imageUrl}`);
              }
            })
          );
        }

        return product;
      })
    );

    if (responseProducts.length > 0) {
      return res.status(200).json({
        responseProducts,
        message: "Site History Found.",
        status: true,
      });
    } else {
      return res.status(404).json({
        message: "No Data Found.",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

async function SiteMailSend(siteId) {
  const sitesdata = await Site.findById(siteId)
    .populate({
      path: "client_id",
      select: "clientName",
    })
    .populate({
      path: "product._id",
      select: "product_name price image tax warrenty",
    });

  // Process the product images and contract files to include the baseURL
  const processedSitesdata = {
    ...sitesdata._doc,
    product: sitesdata.product.map((productItem) => ({
      ...productItem._id._doc,
      image: baseURL + productItem._id.image,
      product_quantity: productItem.product_quantity,
      product_min_quantity: productItem.product_min_quantity,
    })),
    contractfile: sitesdata.contractfile.map((file) => baseURL + file),
  };

  // Calculate subtotal and item count
  const subtotal = processedSitesdata.product.reduce((sum, productItem) => sum + productItem.price, 0);
  const itemCount = processedSitesdata.product.length;

  // Fetch users whose site_id matches the sitesdata _id
  const users = await UserModel.find({ site_id: sitesdata._id });

  // Process users data to include baseURL for identity_card and medical_card
  const processedUsers = users.map((user) => ({
    full_name: user.full_name,
    email: user.email,
    mobile: user.mobile,
    PF_number: user.PF_number,
    ESIC: user.ESIC,
    medical_card: baseURL + user.medical_card,
    identity_card: baseURL + user.identity_card,
  }));

  const sitedata = {
    ...processedSitesdata,
    users: processedUsers,
    subtotal,
    itemCount,
  };

  return sitedata;
}
