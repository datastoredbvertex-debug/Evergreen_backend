const Product = require("../Models/Product.model");
const Site = require("../Models/Site.model");
const Not_Work_Product = require("../Models/Not_Work_Product.model");
const baseURL = process.env.BASE_URL;
const { uploadImagesProduct } = require("../Config/imageuplaode");
const multer = require("multer");
var multiparty = require("multiparty");
const Attendance_Uplaod_Dir = "./uploads/Not_Work_Product";
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const upload = multer({ storage: uploadImagesProduct });

// exports.Createproduct = async (req, res) => {
//   try {
//     const { product_name, parameter_min, parameter_max, show_SE, unite, product_quantity, min_product_quantity, preventive_maintenance, price, descriptions, category_id, HSN_code, warrenty, imageFileName } = req.body;
//     // Check if all required fields are present
//     console.log(req.body);
//     if (!product_name || !show_SE || !unite || !product_quantity || !min_product_quantity || !preventive_maintenance || !price || !descriptions || !category_id || !HSN_code || !warrenty || !imageFileName) {
//       return res.status(404).json({
//         message: "Please enter all the required fields.",
//         status: false,
//       });
//     }

//     // Generate unique product ID
//     const productId = await getNextProductId();

//     // Get the uploaded image file

//     // Create product in the database
//     const productData = {
//       productId,
//       product_name,
//       parameter_min,
//       parameter_max,
//       show_SE,
//       unite,
//       product_quantity,
//       total_quantity: product_quantity,
//       min_product_quantity,
//       preventive_maintenance,
//       price,
//       descriptions,
//       category_id,
//       HSN_code,
//       warrenty,
//       image: imageFileName,
//     };

//     // Check if parameter_min is greater than parameter_max
//     if (Number(parameter_min) > Number(parameter_max)) {
//       return res.status(404).json({
//         message: "The minimum parameter cannot be greater than the maximum",
//         status: false,
//       });
//     }

//     const product = await Product.create(productData);

//     // Check if product is created successfully
//     if (product) {
//       return res.status(201).json({
//         product: product,
//         status: true,
//       });
//     } else {
//       return res.status(500).json({
//         message: "Product creation failed.",
//         status: false,
//       });
//     }
//   } catch (error) {
//     console.error("Error while creating product:", error);
//     return res.status(500).json({
//       message: "Internal server error.",
//       status: false,
//     });
//   }
// };


// edit by Atest 22/04/2025

exports.Createproduct = async (req, res) => {
  try {
    const {
      product_name,
      parameter_min,
      parameter_max,
      show_SE,
      unite,
      product_quantity,
      min_product_quantity,
      preventive_maintenance,
      price,
      descriptions,
      category_id,
      HSN_code,
      warrenty,
      imageFileName,
    } = req.body;

    // Check for required fields
    if (
      !product_name ||
      !show_SE ||
      !unite ||
      !product_quantity ||
      !min_product_quantity ||
      !preventive_maintenance ||
      !price ||
      !descriptions ||
      !category_id ||
      !HSN_code ||
      !warrenty ||
      !imageFileName
    ) {
      return res.status(400).json({
        message: "Please enter all the required fields.",
        status: false,
      });
    }

    // Check if product with the same name (case-insensitive) already exists
    const existingProduct = await Product.findOne({
      product_name: { $regex: new RegExp(`^${product_name}$`, "i") },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product name already exists.",
        status: false,
      });
    }

    // Validate parameter_min and parameter_max
    if (Number(parameter_min) > Number(parameter_max)) {
      return res.status(400).json({
        message: "The minimum parameter cannot be greater than the maximum.",
        status: false,
      });
    }

    // Generate product ID
    const productId = await getNextProductId();

    // Build the product data
    const productData = {
      productId,
      product_name,
      parameter_min,
      parameter_max,
      show_SE,
      unite,
      product_quantity,
      total_quantity: product_quantity,
      min_product_quantity,
      preventive_maintenance,
      price,
      descriptions,
      category_id,
      HSN_code,
      warrenty,
      image: imageFileName,
    };

    // Create the product
    const product = await Product.create(productData);

    return res.status(201).json({
      product,
      status: true,
    });
  } catch (error) {
    console.error("Error while creating product:", error);
    return res.status(500).json({
      message: "Internal server error.",
      status: false,
    });
  }
};


exports.Createproductimage = (req, res) => {
  upload.single("imageFile")(req, res, function (err) {
    if (err) {
      // Handle error if any
      return res.status(404).json({ error: "Error uploading image" });
    }
    console.log(req.file);
    // Return image name and path
    return res.json({ filename: "uploads/Product/" + req.file.filename });
  });
};

const getNextProductId = async () => {
  const lastProduct = await Product.findOne().sort({ _id: -1 }).limit(1);
  if (lastProduct) {
    const lastProductId = parseInt(lastProduct.productId.slice(1)); // Remove '#' and convert to number
    return `#${(lastProductId + 1).toString().padStart(5, "0")}`; // Pad with zeros to ensure 5-digit format
  } else {
    return "#00001"; // If no previous entry, start with '#00001'
  }
};

exports.getAllProduct = async (req, res) => {
  const { page = 1, search = "", Short = "" } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  // Build the query based on search and Short
  const query = search
    ? {
        $or: [{ product_name: { $regex: search, $options: "i" } }],
      }
    : {};

  sortCriteria = { _id: -1 };
  try {
    let users = await Product.find(query)
      .populate({
        path: "category_id",
        select: "category",
      })
      .populate({
        path: "unite", // Populating unite field
        select: "unit", // Select only necessary fields
      })
      .sort(sortCriteria)
      .skip((page - 1) * perPage)
      .limit(perPage);

    // Iterate through each product and add base URL to image field
    users = users.map((user) => ({
      ...user._doc,
      image: `${baseURL}${user.image}`, // Assuming baseURL is already defined
    }));

    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const paginationDetails = {
      current_page: parseInt(page),
      data: users,
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
      to: (page - 1) * perPage + users.length,
      total: totalCount,
    };

    res.json({
      Products: paginationDetails,
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

// exports.UpdateProduct = async (req, res) => {
//   const { product_id, new_product_name, new_parameter_min, new_parameter_max, new_show_SE, new_preventive_maintenance, new_price, new_descriptions, new_product_quantity, new_min_product_quantity new_category_id, new_unit_id, new_HSN_code, new_tax, new_warrenty } = req.body;
//   const _id = product_id;
//   console.log(req.body);
//   try {
//     if (
//       !product_id ||
//       !new_product_name ||
//       !new_show_SE ||
//       !new_preventive_maintenance ||
//       !new_price ||
//       !new_descriptions ||
//       !new_category_id ||
//       !new_unit_id ||
//       !new_HSN_code ||
//       !new_product_quantity ||
//     !new_min_product_quantity ||
//       // !new_ppm ||
//       !new_warrenty
//     ) {
//       return res.status(404).json({
//         message: "Please provide all filed.",
//         status: false,
//       });
//     }

//     // Find the product by ID and update its name
//     const product = await Product.findByIdAndUpdate(
//       _id,
//       {
//         product_name: new_product_name,
//         parameter_min: new_parameter_min,
//         parameter_max: new_parameter_max,
//         show_SE: new_show_SE,
//         preventive_maintenance: new_preventive_maintenance,
//         price: new_price,
//         descriptions: new_descriptions,
//         category_id: new_category_id,
//         unite: new_unit_id,
//         HSN_code: new_HSN_code,
//         tax: new_tax,
//         // ppm: new_ppm,
//         warrenty: new_warrenty,
//       },
//       { new: true } // To return the updated product
//     );

//     if (!product) {
//       return res.status(404).json({
//         message: "Product not found.",
//         status: false,
//       });
//     }

//     // Return the updated product
//     res.status(200).json({
//       product,
//       message: "Product updated successfully.",
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

exports.UpdateProduct = async (req, res) => {
  const {
    product_id,
    new_product_name,
    new_parameter_min,
    new_parameter_max,
    new_show_SE,
    new_preventive_maintenance,
    new_price,
    new_descriptions,
    new_product_quantity,
    new_min_product_quantity,
    new_category_id,
    new_unit_id,
    new_HSN_code,
    new_tax,
    new_warranty,
  } = req.body;

  const _id = product_id;
  console.log(req.body);

  try {
    // Validation: Check for missing fields
    if (
      !product_id ||
      !new_product_name ||
      !new_show_SE ||
      !new_preventive_maintenance ||
      !new_descriptions ||
      !new_category_id ||
      !new_unit_id ||
      !new_HSN_code ||
      !new_product_quantity ||
      !new_min_product_quantity ||
      !new_warranty
    ) {
      return res.status(400).json({
        message: "Please provide all required fields.",
        status: false,
      });
    }

    // Additional validation: min quantity < quantity
    if (parseInt(new_min_product_quantity) >= parseInt(new_product_quantity)) {
      return res.status(400).json({
        message: "Min Product Quantity must be smaller than Product Quantity.",
        status: false,
      });
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      _id,
      {
        product_name: new_product_name,
        parameter_min: new_parameter_min,
        parameter_max: new_parameter_max,
        show_SE: new_show_SE,
        preventive_maintenance: new_preventive_maintenance,
        price: new_price,
        descriptions: new_descriptions,
        category_id: new_category_id,
        unit: new_unit_id,
        HSN_code: new_HSN_code,
        tax: new_tax,
        warrenty: new_warranty,
        product_quantity: new_product_quantity,
        min_product_quantity: new_min_product_quantity,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        status: false,
      });
    }

    return res.status(200).json({
      product,
      message: "Product updated successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};




exports.getAllProductName = async (req, res) => {
  try {
    const users = await Product.aggregate([
      {
        $project: {
          _id: 1,
          product_name: {
            $trim: { input: "$product_name" }, // Trim leading and trailing whitespace
          },
          preventive_maintenance: {
            $trim: { input: "$preventive_maintenance" }, // Trim leading and trailing whitespace
          },
        },
      },
      {
        $sort: {
          product_name: 1,
        },
      },
    ]).collation({ locale: "en" }); // Use a case-insensitive collation with the "en" locale

    const totalCount = await Product.countDocuments({});

    res.json({
      totalCount: totalCount,
      products: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.ProductSubmit = async (req, res) => {
  let form = new multiparty.Form({ uploadDir: Attendance_Uplaod_Dir });
  const userId = req.headers.userID;
  const timestamp = new Date();
  const formattedDate = formatDate(timestamp); // Assuming you have a formatDate function
  const dateString = formattedDate.toLocaleString();
  const date = new Date(dateString);
  const timestampInSeconds = Math.floor(date.getTime() / 1000);
  let newFilePaths = []; // Initialize an array to store file paths

  form.on("file", function (name, file) {
    const fileExtension = file.originalFilename.split(".").pop();
    const newFilename = `${timestampInSeconds}-${Date.now()}.${fileExtension}`; // Use Date.now() to ensure unique filenames
    const newFilePath = path.join(Attendance_Uplaod_Dir, newFilename).replace(/\\/g, "/");
    newFilePaths.push(newFilePath); // Add the new file path to the array

    fs.rename(file.path, newFilePath, (err) => {
      if (err) {
        console.error("File renaming error:", err);
        return res.status(500).send({ error: "File renaming error" });
      }
    });
  });

  form.parse(req, async function (err, fields, files) {
    if (err) return res.send({ error: err.message });

    try {
      const attendance = await Not_Work_Product.create({
        problem_id: fields.problem_id[0],
        image: newFilePaths, // Store the array of file paths
        current_value: fields.current_value[0],
        site_id: fields.site_id[0],
        userId: userId,
        date: fields.date[0],
        time: fields.time[0],
        location_lat: fields.location_lat[0],
        location_long: fields.location_long[0],
      });

      return res.status(201).json({
        _id: attendance._id,
        problem_id: attendance.problem_id,
        image: attendance.image, // Return the array of file paths
        current_value: attendance.current_value,
        site_id: attendance.site_id,
        userId: attendance.userId,
        date: attendance.date,
        time: attendance.time,
        location_lat: attendance.location_lat,
        location_long: attendance.location_long,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

exports.ProductCheckCurrentValue = async (req, res) => {
  const { product_id, current_value } = req.body;

  if (!product_id) {
    return res.status(404).json({ error: "product_id is required" });
  }
  if (current_value === undefined) {
    return res.status(404).json({ error: "current_value is required" });
  }

  try {
    // Find the product by product_id
    const product = await Product.findById(product_id); // Changed findById to findByPk

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if current_value is within the range
    let status = false;
    let message = "";

    if (current_value < product.parameter_min) {
      message = "current_value is below the acceptable range";
    } else if (current_value > product.parameter_max) {
      message = "current_value is above the acceptable range";
    } else {
      status = true;
      message = "current_value is within the acceptable range";
    }

    return res.status(200).json({ status, message });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

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

// exports.UpdateChemicallist = async (req, res) => {
//   try {
//     const { site_id, product_id, used_qty } = req.body;

//     // Find the site by ID
//     const site = await Site.findById(site_id);
//     if (!site) {
//       return res.status(404).json({ error: "Site not found" });
//     }

//     // Find the product within the site's products array
//     const product = site.product.find((p) => p._id.toString() === product_id);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Update the used_quantity and remaining_quantity
//     product.used_quantity += used_qty;
//     product.remaining_quantity -= used_qty;

//     // Save the updated site document
//     await site.save();

//     return res.status(200).json({ message: "Product updated successfully", site });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.UpdateChemicallist = async (req, res) => {
  try {
    const { site_id, product_id, used_qty } = req.body;

    // Ensure used_qty is a valid number
    const usedQuantity = Number(used_qty);
    if (isNaN(usedQuantity) || usedQuantity <= 0) {
      return res.status(400).json({ error: "Invalid used quantity" });
    }

    // Find the site by ID
    const site = await Site.findById(site_id);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    // Find the product within the site's products array
    const product = site.product.find((p) => p._id.toString() === product_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if there is remaining quantity left
    if (product.remaining_quantity === 0) {
      return res.status(400).json({ error: "No remaining quantity left" });
    }

    // Ensure that used quantity doesn't exceed the available remaining quantity
    if (usedQuantity > product.remaining_quantity) {
      return res.status(400).json({ error: "Used quantity exceeds available quantity" });
    }

    // Update the used_quantity and remaining_quantity
    product.used_quantity += usedQuantity;
    product.remaining_quantity -= usedQuantity;

    // Save the updated site document
    await site.save();

    return res.status(200).json({ message: "Product updated successfully", site });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.GetChemicallist = async (req, res) => {
  try {
    const { site_id } = req.body;

    const site = await Site.findById(site_id);

    // Filter products to include only those with deleted_at: false
    site.product = site.product.filter((product) => !product.deleted_at);

    // Populate filtered products
    await Site.populate(site, {
      path: "product._id",
      select: "product_name maintenance_date maintenance_alert",
      model: "Product",
    });

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    // Process each product to calculate maintenance_alert and update within the site document
    site.product.forEach((p) => {
      let firstMaintenanceDate = null;

      // Find the first future maintenance date
      if (p.maintenance_date && p.maintenance_date.length > 0) {
        const currentDate = moment();
        let maintenanceAlert = "No"; // Default to "No" if no alert status is found

        for (let date of p.maintenance_date) {
          const maintenanceDate = moment(date, "DD/MM/YYYY");
          if (!firstMaintenanceDate) firstMaintenanceDate = date;

          const daysDifference = maintenanceDate.diff(currentDate, "days");

          if (daysDifference <= 8 && daysDifference >= 0) {
            // Maintenance date is within 8 days from the current date
            maintenanceAlert = "Alert";
            break;
          } else if (daysDifference < 0) {
            // Maintenance date has passed
            maintenanceAlert = "Missed";
            break;
          }
        }

        // Update maintenance_alert for the current product within the site document
        p.maintenance_alert = maintenanceAlert;
      }
    });

    // Save the updated site document back to the database
    await site.save();

    // Prepare the response with formatted product data
    const productData = site.product.map((p) => {
      // Handle case where maintenance_date is null or empty
      const firstMaintenanceDate = p.maintenance_date && p.maintenance_date.length > 0 ? p.maintenance_date[0] : null;

      return {
        _id: p._id._id,
        product_name: p._id.product_name,
        used_quantity: p.used_quantity,
        remaining_quantity: p.remaining_quantity,
        product_quantity: p.product_quantity,
        maintenance_date: firstMaintenanceDate,
        maintenance_alert: p.maintenance_alert,
      };
    });

    // Include site_name in the response
    return res.status(200).json({
      site_id: site._id,
      site_name: site.site_name,
      products: productData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSiteProduct = async (req, res) => {
  const { site_id, product_id } = req.body;

  try {
    // Find the site by ID
    const site = await Site.findById(site_id);
    if (!site) {
      return res.status(404).json({
        message: "Site Not Found",
        status: false,
      });
    }

    // Find the product in the site's product array and populate it
    const product = await Product.findById(product_id).populate({
      path: "_id",
    });

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
        status: false,
      });
    }

    res.json({
      product: product,
      status: true,
    });
  } catch (error) {
    console.error("GetProduct API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getProductdetails = async (req, res) => {
  const { product_id } = req.body;

  try {
    // Find the product by ID
    let product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
        status: false,
      });
    }

    // Add parameter_min field
    product = {
      ...product._doc,
      parameter_min: product.parameter_min ? product.parameter_min : null,
      parameter_max: product.parameter_max ? product.parameter_max : null,
    };

    res.json({
      product: product,
      status: true,
    });
  } catch (error) {
    console.error("GetProduct API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};


//comment by Atest 10/05/25

// exports.getNotEmptyVaule = async (req, res) => {
//   const { site_id } = req.body; // Assuming site_id is passed in the request body

//   try {
//     // Step 1: Find the Site by site_id
//     const site = await Site.findById(site_id);

//     if (!site) {
//       return res.status(404).json({ message: "Site not found" });
//     }

//     // Step 2: Fetch products from Product model with non-empty parameter_min and parameter_max
//     const products = await Product.find({
//       _id: { $in: site.product }, // Assuming site.products contains IDs of products associated with the site
//       parameter_min: { $ne: "", $ne: 0 },
//       parameter_max: { $ne: "", $ne: 0 },
//     }).select("_id product_name parameter_min parameter_max unit");

//     res.status(200).json({
//       message: "Products with non-empty parameter_min and parameter_max retrieved successfully",
//       products: products,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// edit by Atest


exports.getNotEmptyVaule = async (req, res) => {
  const { site_id } = req.body; // Assuming site_id is passed in the request body

  try {
    // Step 1: Find the Site by site_id
    const site = await Site.findById(site_id);

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Step 2: Fetch products from Product model with non-empty parameter_min and parameter_max
    const products = await Product.find({
      _id: { $in: site.product }, // Assuming site.products contains IDs of products associated with the site
      parameter_min: { $nin: ["", 0] },
      parameter_max: { $nin: ["", 0] },
    }).select("_id product_name parameter_min parameter_max unit");

    res.status(200).json({
      message: "Products with non-empty parameter_min and parameter_max retrieved successfully",
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};