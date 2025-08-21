const UserModel = require("../Models/User.model");
const ReportModel = require("../Models/Report.model");
const MaintenanceReport = require("../Models/MaintenanceReport.model");
const Product = require("../Models/Product.model");
const { ReportTemplate } = require("../Config/Template/reportmail");
const { MaintenanceReportTemplate } = require("../Config/Template/maintenancemail");
const SendMail = require("../Config/mail");
const { createNotification, AdmincreateNotification } = require("./NotificationControllers");
// const { Admin_Model } = require("../Models/Admin.model");
const { Admin_Model } = require("../Models/Admin.model");
const Problem = require("../Models/Problem.model");
var multiparty = require("multiparty");
const Report_Uplaod_Dir = "./uploads/Report";
const path = require("path");
const fs = require("fs");
const Site = require("../Models/Site.model");
const baseURL = process.env.BASE_URL;
const { ObjectId } = require("mongoose").Types;

exports.ReportSend = async (req, res) => {
  const { ReportId, email, type } = req.body;
  let sendmail;

  if (type == "Daily") {
    const report = await ReportModel.findByIdAndUpdate(ReportId, { mail_send: true }, { new: true });
    if (!report) {
      return res.status(404).json({ message: "Report not found", status: false });
    }
    const sitesdata = await ReportMailSend(ReportId);
    sendmail = SendMail({
      recipientEmail: email,
      subject: "Daily Product Report Update",
      html: ReportTemplate(sitesdata),
    });
  } else if (type == "Maintenance") {
    const report = await MaintenanceReport.findByIdAndUpdate(ReportId, { mail_send: true }, { new: true });
    if (!report) {
      return res.status(404).json({ message: "Maintenance Report not found", status: false });
    }
    const sitesdata = await MaintenanceReportMailSend(ReportId);
    sendmail = SendMail({
      recipientEmail: email,
      subject: "Maintenance Product Report Update",
      html: MaintenanceReportTemplate(sitesdata),
    });
  }

  return res.status(200).json({ message: sendmail, status: true });
};

//comment by Atest 06/05/25

// async function ReportMailSend(ReportId) {
//   const sitesdata = await ReportModel.findById(ReportId)
//     .populate({
//       path: "site_id",
//     })
//     .populate({
//       path: "product_report_id",
//       populate: [
//         { path: "user_id", select: "full_name" },
//         { path: "problem_id", select: "problem" },
//         { path: "product_id", select: "product_name parameter_min parameter_max" },
//       ],
//     });

//   // Populate Product details and update images URLs
//   const updatedProducts = sitesdata.product_report_id.map((product) => {
//     // Modify images array to include baseURL
//     const updatedImages = [product.image_0, product.image_1, product.image_2].map((image) => baseURL + image);

//     // Return updated product object
//     return {
//       ...product.toObject(),
//       images: updatedImages,
//       product_name: product.product_id ? product.product_id.product_name : "",
//       parameter_min: product.product_id ? product.product_id.parameter_min : "",
//       parameter_max: product.product_id ? product.product_id.parameter_max : "",
//       problem_name: product.problem_id ? product.problem_id.problem : "",
//       user_name: product.user_id ? product.user_id.full_name : "Not Verified",
//     };
//   });

//   const notWorkingProducts = updatedProducts
//     .filter((product) => product.working_status === "not_working")
//     .map((product) => {
//       const { image_0, image_1, image_2, ...rest } = product;
//       return rest;
//     });

//   const workingProducts = updatedProducts.filter((product) => product.working_status === "working_ok");

//   const sitedata = {
//     ...sitesdata.toObject(),
//     notWorkingProducts,
//     workingProducts,
//   };

//   // Remove `product_report_id` and `product` array from `site_id`
//   delete sitedata.product_report_id;
//   delete sitedata.site_id.product;

//   return sitedata;
// }

// edit by Atest 06/05/25

async function ReportMailSend(ReportId) {
  const sitesdata = await ReportModel.findById(ReportId)
    .populate({
      path: "site_id",
      populate: [
        { path: "product._id", select: "product_quantity used_quantity" }
      ]
    })
    .populate({
      path: "product_report_id",
      populate: [
        { path: "user_id", select: "full_name" },
        { path: "problem_id", select: "problem" },
        { path: "product_id", select: "product_name parameter_min parameter_max" },
      ],
    });

  const siteProducts = sitesdata.site_id?.product || [];

  const updatedProducts = sitesdata.product_report_id.map((product) => {
    const matchedProduct = siteProducts.find(
      (siteProduct) =>
        siteProduct._id && product.product_id &&
        siteProduct._id._id.toString() === product.product_id._id.toString()
    );

    const updatedImages = [product.image_0, product.image_1, product.image_2].map((image) => baseURL + image);

    return {
      ...product.toObject(),
      images: updatedImages,
      product_name: product.product_id?.product_name || "",
      parameter_min: product.product_id?.parameter_min || "",
      parameter_max: product.product_id?.parameter_max || "",
      problem_name: product.problem_id?.problem || "",
      user_name: product.user_id?.full_name || "Not Verified",
      product_quantity: matchedProduct?.product_quantity || 0,
      used_quantity: matchedProduct?.used_quantity || 0,
    };
  });

  const notWorkingProducts = updatedProducts
    .filter((product) => product.working_status === "not_working")
    .map(({ image_0, image_1, image_2, ...rest }) => rest);

  const workingProducts = updatedProducts.filter((product) => product.working_status === "working_ok");

  const sitedata = {
    ...sitesdata.toObject(),
    notWorkingProducts,
    workingProducts,
  };

  delete sitedata.product_report_id;
  delete sitedata.site_id.product;

  return sitedata;
}


//comment by Atest


// async function MaintenanceReportMailSend(ReportId) {
//   const sitesdata = await MaintenanceReport.findById(ReportId).populate({
//     path: "site_id",
//   });

//   // Populate Product details and update images URLs
//   const updatedProducts = await Promise.all(
//     sitesdata.product.map(async (product) => {
//       // Populate Product details
//       const productName = await Product.findById(product._id).select("product_name parameter_min parameter_max");

//       // Populate Problem details
//       const problemName = await Problem.findById(product.problem_id).select("problem");

//       // Modify images array to include baseURL
//       // const updatedImages = product.images.map((image) => baseURL + image);
//       const updatedImages = product?.images?.length
//   ? product.images.map((image) => baseURL + image)
//   : [];

//       // Return updated product object
//       return {
//         ...product.toObject(),
//         product_name: productName ? productName.product_name : "",
//         parameter_min: productName ? productName.parameter_min : "",
//         parameter_max: productName ? productName.parameter_max : "",
//         images: updatedImages,
//         problem_name: problemName ? problemName.problem : "",
//       };
//     })
//   );

//   const workingProducts = await Promise.all(
//     sitesdata.site_id.product
//       .filter((product) => product.working_status === "working_ok")
//       .map(async (product) => {
//         const productName = await Product.findById(product._id).select("product_name parameter_min parameter_max");
//         return {
//           ...product.toObject(),
//           product_name: productName ? productName.product_name : "",
//           parameter_min: productName ? productName.parameter_min : "",
//           parameter_max: productName ? productName.parameter_max : "",
//         };
//       })
//   );

//   const sitedata = {
//     ...sitesdata.toObject(),
//     notWorkingProducts: updatedProducts,
//     workingProducts: workingProducts,
//   };
//   return sitedata;
// }



// async function MaintenanceReportMailSend(ReportId) {
//   const sitesdata = await MaintenanceReport.findById(ReportId).populate({
//     path: "site_id",
//   });

//   // Populate Product details and update images URLs
//   const updatedProducts = await Promise.all(
//     sitesdata.product.map(async (product) => {
//       // Populate Product details
//       const productName = await Product.findById(product._id).select("product_name parameter_min parameter_max");

//       // Populate Problem details
//       const problemName = await Problem.findById(product.problem_id).select("problem");

//       // Modify images array to include baseURL
//       // const updatedImages = product.images.map((image) => baseURL + image);
//       const updatedImages = product?.images?.length
//   ? product.images.map((image) => baseURL + image)
//   : [];

//       // Return updated product object
//       return {
//         ...product.toObject(),
//         product_name: productName ? productName.product_name : "",
//         parameter_min: productName ? productName.parameter_min : "",
//         parameter_max: productName ? productName.parameter_max : "",
//         images: updatedImages,
//         problem_name: problemName ? problemName.problem : "",
//       };
//     })
//   );

//   const workingProducts = await Promise.all(
//     sitesdata.site_id.product
//       .filter((product) => product.working_status === "working_ok")
//       .map(async (product) => {
//         const productName = await Product.findById(product._id).select("product_name parameter_min parameter_max");
//         return {
//           ...product.toObject(),
//           product_name: productName ? productName.product_name : "",
//           parameter_min: productName ? productName.parameter_min : "",
//           parameter_max: productName ? productName.parameter_max : "",
//         };
//       })
//   );

//   const sitedata = {
//     ...sitesdata.toObject(),
//     notWorkingProducts: updatedProducts,
//     workingProducts: workingProducts,
//   };
//   return sitedata;
// }


// edit by Atest

async function MaintenanceReportMailSend(ReportId) {
  try {
    const sitesdata = await MaintenanceReport.findById(ReportId).populate({
      path: "site_id",
    });

    if (!sitesdata) {
      throw new Error("Maintenance report not found");
    }

    // ✅ Process the Not Working Products
    const updatedProducts = await Promise.all(
      (Array.isArray(sitesdata.product) ? sitesdata.product : []).map(
        async (product) => {
          if (!product) return null;

          // Fetch latest product details
          const productData = await Product.findById(product._id).select(
            "product_name parameter_min parameter_max working_status"
          );

          // Fetch problem details (handle null problem_id)
          const problemData = product.problem_id
            ? await Problem.findById(product.problem_id).select("problem")
            : null;

          // Update image paths
          const updatedImages = Array.isArray(product.images)
            ? product.images.map((image) => baseURL + image)
            : [];

          return {
            ...product.toObject(),
            product_name: productData ? productData.product_name : "",
            parameter_min: productData ? productData.parameter_min : "",
            parameter_max: productData ? productData.parameter_max : "",
            working_status: productData ? productData.working_status : "",
            images: updatedImages,
            problem_name: problemData ? problemData.problem : "",
          };
        }
      )
    );

    // ✅ Fetch the Working Products by Cross-Checking `working_status`
    const workingProducts =
      sitesdata.site_id && Array.isArray(sitesdata.site_id.product)
        ? await Promise.all(
            sitesdata.site_id.product.map(async (product) => {
              // Fetch latest product details
              const productData = await Product.findById(product._id).select(
                "product_name parameter_min parameter_max working_status"
              );

              // Ensure product exists and is marked as "working_ok"
              if (!productData || productData.working_status !== "working_ok") {
                return null; // Skip if not working
              }

              return {
                ...product.toObject(),
                product_name: productData.product_name || "",
                parameter_min: productData.parameter_min || "",
                parameter_max: productData.parameter_max || "",
                working_status: productData.working_status,
              };
            })
          )
        : [];

    const filteredWorkingProducts = workingProducts.filter(Boolean); // Remove null entries

    // ✅ Ensure Site Product Working Status is Up-to-Date
    await Promise.all(
      sitesdata.site_id.product.map(async (product) => {
        const productData = await Product.findById(product._id).select("working_status");
        if (productData) {
          product.working_status = productData.working_status; // Sync working status
        }
      })
    );

    // ✅ Constructing Final Response
    const sitedata = {
      ...sitesdata.toObject(),
      notWorkingProducts: updatedProducts.filter(
        (product) => product && product.working_status !== "working_ok"
      ),
      workingProducts: filteredWorkingProducts, // Remove null entries
    };

    return sitedata;
  } catch (error) {
    console.error("Error in MaintenanceReportMailSend:", error.message);
    return { error: error.message };
  }
}



// comment by Atest 31/03/25

exports.getAll_Report = async (req, res) => {
  const { page = 1, search = "" } = req.body;
  const perPage = 10; // You can adjust this according to your requirements
  // const perPage = await ReportModel.countDocuments({});

  // Sorting based on _id field
  const sortCriteria = { _id: -1 };

  try {
    const users = await ReportModel.find({ all_data_submit: true })
      .sort(sortCriteria)
      .populate({
        path: "userId",
        select: "full_name _id",
      })
      .populate({
        path: "verified_userId",
        select: "full_name _id",
      })
      .populate({
        path: "site_id",
        select: "site_name _id",
      });

    // Prepend baseURL to images in each product of each report
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
    // Add baseURL to pic property of each user
    const updatedUsers = users.map((user) => {
      i++;
      return {
        ...user.toObject(),
        orderId: i,
      };
    });

    const totalCount = await ReportModel.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const paginationDetails = {
      current_page: parseInt(page),
      data: updatedUsers,
      first_page_url: `${process.env.BASE_URL}api/admin?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${process.env.BASE_URL}api/admin?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${process.env.BASE_URL}api/admin?page=${page}`,
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
      path: `${process.env.BASE_URL}api/admin`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + updatedUsers.length,
      total: totalCount,
    };

    res.json({
      Report: paginationDetails,
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



// edit by Atest

// exports.getAll_Report = async (req, res) => {
//   const { page = 1, search = "" } = req.body;
//   const perPage = 10; // You can adjust this according to your requirements
//   // const perPage = await ReportModel.countDocuments({});

//   // Sorting based on _id field
//   const sortCriteria = { _id: -1 };

//   try {
//     const users = await ReportModel.find({ all_data_submit: true })
//       .sort(sortCriteria)
//       .skip((page - 1) * perPage)
//       .limit(perPage)
//       .populate({
//         path: "userId",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "verified_userId",
//         select: "full_name _id",
//       })
//       .populate({
//         path: "site_id",
//         select: "site_name _id",
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

//     const totalCount = await ReportModel.countDocuments();
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




exports.ReportGet = async (req, res) => {
  try {
    const { reportId } = req.body;

    // Find reports with the specified site_id
    const userData = await ReportModel.find({ _id: reportId }).populate({
      path: "product_report_id",
      populate: [
        { path: "product_id", select: "product_name parameter_min parameter_max _id" },
        { path: "site_id", select: "site_name _id" },
        { path: "problem_id", select: "problem _id" },
        { path: "user_id", select: "full_name _id" },
      ],
    });
    // Append base URL to images if they are not null
    userData.forEach((report) => {
      report.product_report_id.forEach((productReport) => {
        if (productReport.image_0) {
          productReport.image_0 = baseURL + productReport.image_0;
        }
        if (productReport.image_1) {
          productReport.image_1 = baseURL + productReport.image_1;
        }
        if (productReport.image_2) {
          productReport.image_2 = baseURL + productReport.image_2;
        }
      });
    });

    return res.status(200).json({ userData: userData, message: "Report get successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
