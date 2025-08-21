const ObjectId = require("mongoose").Types.ObjectId;
const multiparty = require("multiparty");
const fs = require("fs");
const path = require("path");
const Site = require("../Models/Site.model");
const Client = require("../Models/Client.model");
const Product = require("../Models/Product.model");
const Problem = require("../Models/Problem.model");
const { Admin_Model } = require("../Models/Admin.model");
const User = require("../Models/User.model");
const MaintenanceReport = require("../Models/MaintenanceReport.model");
const Report_Uplaod_Dir = "./uploads/Maintenance_Report";
const baseURL = process.env.BASE_URL;
const { WrokingReportTemplate } = require("../Config/Template/workingproductmail");
const { NotWrokingReportTemplate } = require("../Config/Template/notworkingproductmail");
const SendMail = require("../Config/mail");
const formidable = require("formidable");
const moment = require("moment");

function formatDate(date) {
  const options = {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

exports.MaintenanceReportSubmit = async (req, res) => {
  const form = new multiparty.Form({ uploadDir: Report_Uplaod_Dir });
  const userId = req.headers.userID;
  const timestampInSeconds = Math.floor(Date.now() / 1000);
  let newFilePaths = [];

  form.on("file", async (name, file) => {
    try {
      if (!file.originalFilename) {
        throw new Error("Please select at least 1 image.");
      }

      const fileExtension = file.originalFilename.split(".").pop();
      const newFilename = `${timestampInSeconds}-${newFilePaths.length}.${fileExtension}`;
      const newFilePath = path.join(Report_Uplaod_Dir, newFilename).replace(/\\/g, "/");
      await fs.promises.rename(file.path, newFilePath); // Ensure await here for async operation
      newFilePaths.push(newFilePath);

      // Introduce a 1-second delay
    } catch (err) {
      cleanupAndRespond(err);
    }
  });

  form.parse(req, async (err, fields) => {
    if (err) {
      return cleanupAndRespond(err);
    }

    try {
      // Check if all required fields are present
      const requiredFields = ["site_id", "product_id", "current_value", "working_status", "submit_user"];
      for (let field of requiredFields) {
        if (!fields[field] || !Array.isArray(fields[field]) || fields[field].length === 0) {
          throw new Error(`Missing or invalid ${field} field in form data.`);
        }
      }

      const siteIdFromFields = fields.site_id[0];
      if (!ObjectId.isValid(siteIdFromFields)) {
        throw new Error("Invalid site_id.");
      }
      const siteId = new ObjectId(siteIdFromFields);

      const site = await Site.findById(siteId);
      if (!site) {
        throw new Error("Site not found.");
      }

      const productIds = fields.product_id.map((id) => {
        if (!ObjectId.isValid(id)) {
          throw new Error("Invalid product_id.");
        }
        return new ObjectId(id);
      });

      const currentProducts = await Product.find({ _id: { $in: productIds } });
      const invalidProducts = productIds.filter((id) => !currentProducts.some((p) => p._id.equals(id)));
      if (invalidProducts.length > 0) {
        throw new Error("One or more products not found.");
      }

      if (newFilePaths.length <= 0) {
        newFilePaths = null;
      }

      const productData = currentProducts.map((product, index) => ({
        _id: product._id,
        images: newFilePaths ? newFilePaths : null,
        problem_id: fields.problem_id && ObjectId.isValid(fields.problem_id[index]) ? new ObjectId(fields.problem_id[index]) : null,
        solution: fields.solution ? fields.solution[index] : null,
        problem_covered: fields.problem_covered ? fields.problem_covered[index] : null,
        current_value: fields.current_value ? fields.current_value[index] : null,
        working_status: fields.working_status[index],
      }));

      const updatedProducts = site.product.map((product) => ({
        ...product,
        working_status: fields.working_status[0],
      }));

      site.product = updatedProducts;
      await site.save();

      const submit_type = fields.submit_user[0] === "Admin" ? "adminId" : "userId";
      const verified_type = fields.submit_user[0] === "Admin" ? "verified_adminId" : "verified_userId";

      const reportData = {
        product: productData,
        [submit_type]: new ObjectId(userId),
        site_id: site._id,
        verified_status: true,
        [verified_type]: new ObjectId(userId),
        mail_send: true,
        datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
      };

      const report = new MaintenanceReport(reportData);
      await report.save();

      // console.log(report);

      site.report_submit = userId;
      await site.save();

      // mail send
      if (fields.working_status[0] == "working_ok") {
        const clientMail = await Client.findById(site.client_id);
        const additionalRecipient = "service@evergreenion.com";
        // const additionalRecipient = "php4.dbvertex@gmail.com";
        currentProducts[0].image = baseURL + currentProducts[0].image;
        const productdata = currentProducts[0];
        const current_value = fields.current_value ? fields.current_value[0] : null;
        const sendmail = SendMail({
          recipientEmail: [clientMail.clientEmail, additionalRecipient],
          subject: "Maintenance Product Report Update",
          html: WrokingReportTemplate(productdata, current_value),
        });
      } else if (fields.working_status[0] != "working_ok") {
        const clientMail = await Client.findById(site.client_id);
        const additionalRecipient = "service@evergreenion.com";
        // const additionalRecipient = "php4.dbvertex@gmail.com";
        const sitesdata = await MaintenanceReportMailSend(report._id);
        const sendmail = SendMail({
          recipientEmail: [clientMail.clientEmail, additionalRecipient],
          subject: "Maintenance Product Report Update",
          html: NotWrokingReportTemplate(sitesdata),
        });
      }

      const siteToUpdate = site; // Assuming `site` is your site object
      const productIdToUpdate = currentProducts[0]._id.toString(); // Convert ObjectId to string

      // Step 2: Product Find by _id in Products Array
      const productToUpdate = siteToUpdate.product.find((p) => p._id.toString() === productIdToUpdate);

      if (productToUpdate) {
        // Step 3: Update Product Data
        productToUpdate.maintenance_alert = "No";
        // Remove the first date from maintenance_date and update already_maintenance
        if (productToUpdate.maintenance_date && productToUpdate.maintenance_date.length > 0) {
          const removedDate = productToUpdate.maintenance_date.shift(); // Remove the first date
          productToUpdate.already_maintenance = removedDate; // Update already_maintenance with the removed date
        }

        // Optionally, update working_status if fields.working_status[0] is defined
        if (fields.working_status && fields.working_status.length > 0) {
          productToUpdate.working_status = fields.working_status[0];
        }

        // Save the updated product back to the database
        await siteToUpdate.save(); // Assuming siteToUpdate is a Mongoose model instance

        console.log("Product updated successfully:");
      } else {
        console.log("Product not found in site.");
      }

      cleanupAndRespond(null, {
        _id: report._id,
        product: report.product,
        userId: report.userId,
        site_id: report.site_id,
        current_value: report.current_value,
        working_status: report.working_status,
        status: true,
      });
    } catch (error) {
      cleanupAndRespond(error);
    }
  });

  function cleanupAndRespond(error, responseData) {
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      return res.status(201).json(responseData);
    }
  }

  async function cleanupFiles(filePaths) {
    // Delete uploaded files asynchronously
    console.log(filePaths);
    if (filePaths) {
      return Promise.all(filePaths.map((filePath) => fs.promises.unlink(filePath)));
    }
    return;
  }
};

// edit by Atest

// exports.MaintenanceReportSubmit = async (req, res) => {
//   const form = new multiparty.Form({ uploadDir: Report_Uplaod_Dir });

//   const userId = req.headers.userID;

//   if (!userId) {
//     console.error("Error: Missing userId in headers");
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   console.log("User ID from Headers:", userId);

//   const timestampInSeconds = Math.floor(Date.now() / 1000);
//   let newFilePaths = [];

//   form.on("file", async (name, file) => {
//     try {
//       if (!file.originalFilename) {
//         throw new Error("Please select at least 1 image.");
//       }

//       const fileExtension = file.originalFilename.split(".").pop();
//       const newFilename = `${timestampInSeconds}-${newFilePaths.length}.${fileExtension}`;
//       const newFilePath = path.join(Report_Uplaod_Dir, newFilename).replace(/\\/g, "/");
//       await fs.promises.rename(file.path, newFilePath);
//       newFilePaths.push(newFilePath);
//     } catch (err) {
//       cleanupAndRespond(err);
//     }
//   });

//   form.parse(req, async (err, fields) => {
//     if (err) {
//       return cleanupAndRespond(err);
//     }

//     try {
//       // Validate required fields
//       const requiredFields = ["site_id", "product_id", "current_value", "working_status", "submit_user"];
//       for (let field of requiredFields) {
//         if (!fields[field] || !Array.isArray(fields[field]) || fields[field].length === 0) {
//           throw new Error(`Missing or invalid ${field} field in form data.`);
//         }
//       }

//       const siteIdFromFields = fields.site_id[0];
//       if (!ObjectId.isValid(siteIdFromFields)) {
//         throw new Error("Invalid site_id.");
//       }
//       const siteId = new ObjectId(siteIdFromFields);

//       const site = await Site.findById(siteId);
//       if (!site) {
//         throw new Error("Site not found.");
//       }

//       const productIds = fields.product_id.map((id) => {
//         if (!ObjectId.isValid(id)) {
//           throw new Error("Invalid product_id.");
//         }
//         return new ObjectId(id);
//       });

//       const currentProducts = await Product.find({ _id: { $in: productIds } });
//       if (currentProducts.length !== productIds.length) {
//         throw new Error("One or more products not found.");
//       }

//       if (newFilePaths.length <= 0) {
//         newFilePaths = null;
//       }

//       const productData = currentProducts.map((product, index) => ({
//         _id: product._id,
//         images: newFilePaths ? newFilePaths : null,
//         problem_id: fields.problem_id && ObjectId.isValid(fields.problem_id[index]) ? new ObjectId(fields.problem_id[index]) : null,
//         solution: fields.solution ? fields.solution[index] : null,
//         problem_covered: fields.problem_covered ? fields.problem_covered[index] : null,
//         current_value: fields.current_value ? fields.current_value[index] : null,
//         working_status: fields.working_status[index],
//       }));

//       // Update site product status
//       site.product = site.product.map((product) => ({
//         ...product,
//         working_status: fields.working_status[0],
//       }));

//       await site.save();

//       const submit_type = fields.submit_user[0] === "Admin" ? "adminId" : "userId";
//       const verified_type = fields.submit_user[0] === "Admin" ? "verified_adminId" : "verified_userId";

//       // Convert `userId` to ObjectId explicitly
//       const userIdObject = new ObjectId(userId);

//       const reportData = {
//         product: productData,
//         [submit_type]: userIdObject,
//         site_id: site._id,
//         verified_status: true,
//         [verified_type]: userIdObject,
//         mail_send: true,
//       };

//       console.log("Report Data Before Save:", reportData);

//       const report = new MaintenanceReport(reportData);
//       await report.save();

//       console.log("Saved Report:", report);

//       site.report_submit = userIdObject;
//       await site.save();

//       // Send email notifications
//       const clientMail = await Client.findById(site.client_id);
//       if (fields.working_status[0] === "working_ok") {
//         const productdata = currentProducts[0];
//         const current_value = fields.current_value ? fields.current_value[0] : null;
//         await SendMail({
//           recipientEmail: clientMail.clientEmail,
//           subject: "Maintenance Product Report Update",
//           html: WrokingReportTemplate(productdata, current_value),
//         });
//       } else {
//         const sitesdata = await MaintenanceReportMailSend(report._id);
//         await SendMail({
//           recipientEmail: clientMail.clientEmail,
//           subject: "Maintenance Product Report Update",
//           html: NotWrokingReportTemplate(sitesdata),
//         });
//       }

//       // Update maintenance status in site product list
//       const productToUpdate = site.product.find((p) => p._id.toString() === currentProducts[0]._id.toString());
//       if (productToUpdate) {
//         productToUpdate.maintenance_alert = "No";
//         if (productToUpdate.maintenance_date && productToUpdate.maintenance_date.length > 0) {
//           productToUpdate.already_maintenance = productToUpdate.maintenance_date.shift();
//         }
//         if (fields.working_status && fields.working_status.length > 0) {
//           productToUpdate.working_status = fields.working_status[0];
//         }
//         await site.save();
//         console.log("Product updated successfully");
//       } else {
//         console.log("Product not found in site.");
//       }

//       cleanupAndRespond(null, {
//         _id: report._id,
//         product: report.product,
//         userId: report[submit_type], // Ensuring userId is correctly assigned
//         site_id: report.site_id,
//         verified_status: report.verified_status,
//         status: true,
//       });
//     } catch (error) {
//       cleanupAndRespond(error);
//     }
//   });

//   function cleanupAndRespond(error, responseData) {
//     if (error) {
//       console.error("Error:", error);
//       return res.status(500).json({ error: "Internal Server Error", message: error.message });
//     } else {
//       return res.status(201).json(responseData);
//     }
//   }

//   async function cleanupFiles(filePaths) {
//     if (filePaths) {
//       return Promise.all(filePaths.map((filePath) => fs.promises.unlink(filePath)));
//     }
//   }
// };

// exports.getAll_MaintenanceReport = async (req, res) => {
//   const { page = 1, search = "", date = null } = req.body;
//   const perPage = 10; // You can adjust this according to your requirements

//   // Sorting based on _id field
//   const sortCriteria = { _id: -1 };

//   try {
//     let query = {};
//     // Add date filter if date is not null
//     if (date !== null) {
//       query.date = date;
//     }
//     const users = await MaintenanceReport.find(query)
//       .sort(sortCriteria)
//       .skip((page - 1) * perPage)
//       .limit(perPage)
//       .populate({
//         path: "site_id",
//         select: "site_name _id",
//       })
//       .populate({
//         path: "adminId",
//         model: "User",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "adminId",
//         model: "Admin",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "verified_userId",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "verified_adminId",
//         select: "full_name _id",
//       });

//     // Prepend baseURL to images in each product of each report
//     users.forEach((report) => {
//       if (report.product && Array.isArray(report.product)) {
//         report.product.forEach((product) => {
//           if (product.images && Array.isArray(product.images)) {
//             product.images = product.images.map((image) => baseURL + image);
//           }
//         });
//       }
//     });

//     let i = 0;
//     // Add baseURL to pic property of each user
//     const updatedUsers = users.map((user) => {
//       i++;
//       return {
//         ...user.toObject(),
//         orderId: i,
//       };
//     });

//     const totalCount = await MaintenanceReport.countDocuments();
//     const totalPages = Math.ceil(totalCount / perPage);

//     const paginationDetails = {
//       current_page: parseInt(page),
//       data: updatedUsers,
//       first_page_url: `${process.env.BASE_URL}api/admin?page=1`,
//       from: (page - 1) * perPage + 1,
//       last_page: totalPages,
//       last_page_url: `${process.env.BASE_URL}api/admin?page=${totalPages}`,
//       links: [
//         {
//           url: null,
//           label: "&laquo; Previous",
//           active: false,
//         },
//         {
//           url: `${process.env.BASE_URL}api/admin?page=${page}`,
//           label: page.toString(),
//           active: true,
//         },
//         {
//           url: null,
//           label: "Next &raquo;",
//           active: false,
//         },
//       ],
//       next_page_url: null,
//       path: `${process.env.BASE_URL}api/admin`,
//       per_page: perPage,
//       prev_page_url: null,
//       to: (page - 1) * perPage + updatedUsers.length,
//       total: totalCount,
//     };

//     res.json({
//       Report: paginationDetails,
//       page: page.toString(),
//       total_rows: totalCount,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

exports.getAll_MaintenanceReport = async (req, res) => {
  const { page = 1, search = "", date = null } = req.body;
  const perPage = 10; // Adjust as needed

  const sortCriteria = { _id: -1 };

  try {
    let query = {};
    if (date !== null) {
      query.date = date;
    }

    const users = await MaintenanceReport.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "site_id",
        select: "site_name _id",
      })
      .populate({
        path: "adminId",
        select: "full_name _id",
      })
      .populate({
        path: "verified_userId",
        select: "full_name _id",
      })
      .populate({
        path: "verified_adminId",
        select: "name _id",
      });

    // Attach admin details manually if needed
    for (const report of users) {
      if (report.adminId) {
        const adminDetails = await Admin_Model.findById(report.adminId).select("full_name");
        report.adminDetails = adminDetails ? { _id: adminDetails._id, name: adminDetails.full_name } : null;
      }
    }

    // Append baseURL to product images
    users.forEach((report) => {
      if (report.product && Array.isArray(report.product)) {
        report.product.forEach((product) => {
          if (product.images && Array.isArray(product.images)) {
            product.images = product.images.map((image) => baseURL + image);
          }
        });
      }
    });

    let i = 0;
    const updatedUsers = users.map((user) => ({
      ...user.toObject(),
      orderId: ++i,
    }));

    const totalCount = await MaintenanceReport.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      first_page_url: `${baseURL}api/admin?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${baseURL}api/admin?page=${totalPages}`,
      links: [
        { url: null, label: "&laquo; Previous", active: false },
        { url: `${baseURL}api/admin?page=${page}`, label: page.toString(), active: true },
        { url: null, label: "Next &raquo;", active: false },
      ],
      next_page_url: page < totalPages ? `${baseURL}api/admin?page=${parseInt(page) + 1}` : null,
      prev_page_url: page > 1 ? `${baseURL}api/admin?page=${parseInt(page) - 1}` : null,
      path: `${baseURL}api/admin`,
      per_page: perPage,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Report: paginationDetails,
      page: page.toString(),
      total_rows: totalCount,
    });
  } catch (error) {
    console.error("Error fetching maintenance reports:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.MaintenanceReportGet = async (req, res) => {
  try {
    const { reportId } = req.body;

    // Find reports with the specified site_id
    const userData = await MaintenanceReport.find({ _id: reportId });

    // Transform the data, populate product details based on _id
    const transformedData = await Promise.all(
      userData.map(async (report) => {
        const populatedProducts = await Promise.all(
          report.product.map(async (product) => {
            // Fetch the product details based on the _id
            const populatedProduct = await Product.findById(product._id);
            const problem = await Problem.findById(product.problem_id);

            // Format the product data as needed
            return {
              _id: populatedProduct._id.toString(), // Convert ObjectId to string if needed
              parameter_min: populatedProduct.parameter_min || 0, // Default to 0 if parameter_min is ""
              parameter_max: populatedProduct.parameter_max || 0, // Default to 0 if parameter_max is ""
              product_name: populatedProduct.product_name,
              images: product.images ? product.images.map((image) => baseURL + image) : null,
              problem_id: product.problem_id ? product.problem_id._id.toString() : null,
              solution: product.solution ? product.solution : null,
              working_status: product.working_status,
              problem_covered: product.problem_covered ? product.problem_covered : null,
              current_value: product.current_value,
            };
          })
        );

        // Return transformed report with populated products
        return {
          _id: report._id.toString(), // Convert ObjectId to string if needed
          product: populatedProducts,
          userId: report.userId ? report.userId.toString() : report.adminId.toString(), // Convert userId ObjectId to string if needed
          site_id: report.site_id.toString(), // Convert site_id ObjectId to string if needed
          datetime: report.datetime,
          verified_status: report.verified_status,
          verified_user: report.verified_user ? report.verified_user.toString() : null,
          __v: report.__v,
        };
      })
    );

    return res.status(200).json({ userData: transformedData, message: "Report get successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.MaintenanceEditReport = async (req, res) => {
  const form = new multiparty.Form({ uploadDir: Report_Uplaod_Dir });
  const newFilePaths = [];
  const timestampInSeconds = Math.floor(Date.now() / 1000);

  form.on("file", async (name, file) => {
    try {
      if (!file.originalFilename) {
        throw new Error("Please select at least 1 image.");
      }

      const fileExtension = file.originalFilename.split(".").pop();
      const newFilename = `${timestampInSeconds}-${newFilePaths.length}.${fileExtension}`;
      const newFilePath = path.join(Report_Uplaod_Dir, newFilename).replace(/\\/g, "/");
      await fs.promises.rename(file.path, newFilePath); // Ensure await here for async operation
      newFilePaths.push(newFilePath);

      // Introduce a 1-second delay
    } catch (err) {
      cleanupAndRespond(err);
    }
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the form data:", err);
      return res.status(500).json({ message: "Error parsing the form data" });
    }

    const { reportId, products, verified_status, verified_user, problem_covered } = fields;
    const userId = req.headers.userID;

    // Adjustments to handle arrays properly
    const parsedVerifiedStatus = Array.isArray(verified_status) ? verified_status[0] === "true" : verified_status;
    const parsedVerifiedUser = Array.isArray(verified_user) ? verified_user[0] : verified_user;

    try {
      const updatedReport = await MaintenanceReport.findOne({ _id: reportId });

      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      const parsedProducts = JSON.parse(products);
      // Update products in the updatedReport
      parsedProducts.forEach((product, index) => {
        // Ensure productId is converted to string and defined
        const productIdToUpdate = product.productId && product.productId.toString();

        // Find the corresponding product in updatedReport.product
        const productToUpdate = productIdToUpdate && updatedReport.product.find((p) => p._id.toString() === productIdToUpdate);

        if (productToUpdate) {
          // Update product details
          productToUpdate.current_value = product.current_value;
          productToUpdate.solution = product.solution;
          productToUpdate.problem_id = product.problemId;
          productToUpdate.working_status = product.working_status;
          productToUpdate.problem_covered = product.problem_covered;

          // Check if newFilePaths[index] is defined before updating images
          if (newFilePaths[index]) {
            productToUpdate.images = newFilePaths; // Update images with the corresponding file path
          }
        } else {
          // console.warn(`Product with productId ${productIdToUpdate} not found in updatedReport`);
        }
      });

      updatedReport.verified_status = parsedVerifiedStatus;
      updatedReport.verified_user = parsedVerifiedUser;
      updatedReport.verified_userId = userId;

      // Save the updated report
      const savedReport = await updatedReport.save();

      // Find the corresponding Site using site_id from updatedReport
      const site = await Site.findById(updatedReport.site_id);

      if (!site) {
        return res.status(404).json({ message: "Site not found for the updated report" });
      }

      // Save the updated Site
      await site.save();

      return res.status(200).json({ updatedReport: savedReport, message: "Report and Site updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

async function MaintenanceReportMailSend(ReportId) {
  const sitesdata = await MaintenanceReport.findById(ReportId).populate({
    path: "site_id",
  });

  // Populate Product details and update images URLs
  const updatedProducts = await Promise.all(
    sitesdata.product.map(async (product) => {
      // Populate Product details
      const productName = await Product.findById(product._id).select("product_name parameter_min parameter_max");

      // Populate Problem details
      const problemName = await Problem.findById(product.problem_id).select("problem");

      // Modify images array to include baseURL
      const updatedImages = product.images.map((image) => baseURL + image);

      // Return updated product object
      return {
        ...product.toObject(),
        product_name: productName ? productName.product_name : "",
        parameter_min: productName ? productName.parameter_min : "",
        parameter_max: productName ? productName.parameter_max : "",
        images: updatedImages,
        problem_name: problemName ? problemName.problem : "",
      };
    })
  );

  const workingProducts = await Promise.all(
    sitesdata.site_id.product
      .filter((product) => product.working_status === "working_ok")
      .map(async (product) => {
        const productName = await Product.findById(product._id).select("product_name parameter_min parameter_max");
        return {
          ...product.toObject(),
          product_name: productName ? productName.product_name : "",
          parameter_min: productName ? productName.parameter_min : "",
          parameter_max: productName ? productName.parameter_max : "",
        };
      })
  );

  const sitedata = {
    ...sitesdata.toObject(),
    notWorkingProducts: updatedProducts,
    workingProducts: workingProducts,
  };
  return sitedata;
}
