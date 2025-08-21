const Category = require("../Models/Category.model");
const moment = require("moment-timezone");
const baseURL = process.env.BASE_URL;

// exports.Createcategory = async (req, res) => {
//   const { category_name } = req.body;
//   if (!category_name) {
//     res.status(404).json({
//       message: "Please enter all the required fields.",
//       status: false,
//     });
//     return;
//   }

//   const category = category_name;
//   const categorys = await Category.create({
//     category,
//   });

//   if (categorys) {
//     res.status(200).json({
//       _id: categorys._id,
//       category: categorys.category,
//       status: true,
//     });
//   } else {
//     res.status(404).json({
//       message: "Category Not Create.",
//       status: false,
//     });
//     return;
//   }
// };

// edit by Atest

exports.Createcategory = async (req, res) => {
  try {
    const { category_name } = req.body;
console.log(req.body);
    if (!category_name) {
      return res.status(400).json({
        message: "Please enter all the required fields.",
        status: false,
      });
    }
    // const categoryName = category_name.trim()
    const categoryName = category_name.replace(/\s+/g, " ").trim();
    console.log(categoryName);
    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({ category: { $regex: `^${categoryName}$`, $options: "i" } });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists.",
        status: false,
      });
    }

    // Create new category
    const category = new Category({ category: categoryName, datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss") });
    const savedCategory = await category.save();

    res.status(201).json({
      _id: savedCategory._id,
      category: savedCategory.category,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error.",
      status: false,
      error: error.message,
    });
  }
};

// exports.GetAllCategorysAdmin = async (req, res) => {
//   const { page = 1, search = "", Short = "" } = req.body;
//   const perPage = 10; // You can adjust this according to your requirements

//   try {
//     const Categorys = await Category.aggregate([
//       {
//         $project: {
//           category: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           datetime: {
//             $dateFromString: {
//               dateString: "$datetime",
//               format: "%d-%m-%Y %H:%M:%S", // Convert to date format
//             },
//           },
//           isOther: {
//             $cond: [{ $eq: ["$category", "Other"] }, 1, 0],
//           },
//         },
//       },
//       { $sort: { datetime: -1 } },
//       { $sort: { isOther: 1, category: 1 } },
//     ]);

//     if (!Categorys || Categorys.length === 0) {
//       return res.status(404).json({
//         message: "No Categorys found.",
//         status: false,
//       });
//     }

//     // Map Categorys to remove the 'isOther' property
//     const sanitizedCategorys = Categorys.map((category) => {
//       const { isOther, ...rest } = category;
//       return rest;
//     });

//     let i = 0;
//     // Add baseURL to pic property of each user
//     const updatedCategorys = sanitizedCategorys.map((user) => {
//       i++;
//       return {
//         ...user,
//         orderId: i,
//       };
//     });

//     // Pagination
//     const totalCount = updatedCategorys.length;
//     const totalPages = Math.ceil(totalCount / perPage);
//     const startIndex = (page - 1) * perPage;
//     const endIndex = page * perPage;

//     const paginatedCategorys = updatedCategorys.slice(startIndex, endIndex);

//     const paginationDetails = {
//       current_page: parseInt(page),
//       data: paginatedCategorys,
//       first_page_url: `${baseURL}api/categorys?page=1`,
//       from: (page - 1) * perPage + 1,
//       last_page: totalPages,
//       last_page_url: `${baseURL}api/categorys?page=${totalPages}`,
//       links: [
//         {
//           url: null,
//           label: "&laquo; Previous",
//           active: false,
//         },
//         {
//           url: `${baseURL}api/categorys?page=${page}`,
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
//       path: `${baseURL}api/categorys`,
//       per_page: perPage,
//       prev_page_url: null,
//       to: (page - 1) * perPage + Categorys.length,
//       total: totalCount,
//     };

//     res.status(200).json({
//       Categorys: paginationDetails,
//     });
//   } catch (error) {
//     console.error("Error fetching Categorys:", error);
//     res.status(500).json({
//       message: "Internal Server Error.",
//       status: false,
//     });
//   }
// };

// edit by Atest

exports.GetAllCategorysAdmin = async (req, res) => {
  const { page = 1, search = "", Short = "" } = req.body;
  const perPage = 10; // Adjust as needed

  try {
    const Categorys = await Category.aggregate([
      {
        $project: {
          category: 1,
          createdAt: 1,
          updatedAt: 1,
          datetime: {
            $dateFromString: {
              dateString: "$datetime",
              format: "%d-%m-%Y %H:%M:%S", // Convert to date format
            },
          },
          isOther: {
            $cond: [{ $eq: ["$category", "Other"] }, 1, 0],
          },
        },
      },
      // { $sort: { createdAt: -1, isOther: 1, category: 1 } }, // Sort by newest first
      { $sort: { datetime: -1 } },
    ]);

    if (!Categorys || Categorys.length === 0) {
      return res.status(404).json({
        message: "No categories found.",
        status: false,
      });
    }

    // Remove `isOther` property
    const sanitizedCategorys = Categorys.map(({ isOther, ...rest }) => rest);

    let i = 0;
    const updatedCategorys = sanitizedCategorys.map((user) => ({
      ...user,
      orderId: ++i,
    }));

    // Pagination
    const totalCount = updatedCategorys.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const paginatedCategorys = updatedCategorys.slice(startIndex, endIndex);

    const paginationDetails = {
      current_page: parseInt(page),
      data: paginatedCategorys,
      first_page_url: `${baseURL}api/categorys?page=1`,
      from: startIndex + 1,
      last_page: totalPages,
      last_page_url: `${baseURL}api/categorys?page=${totalPages}`,
      links: [
        {
          url: page > 1 ? `${baseURL}api/categorys?page=${page - 1}` : null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${baseURL}api/categorys?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: page < totalPages ? `${baseURL}api/categorys?page=${page + 1}` : null,
          label: "Next &raquo;",
          active: false,
        },
      ],
      next_page_url: page < totalPages ? `${baseURL}api/categorys?page=${page + 1}` : null,
      path: `${baseURL}api/categorys`,
      per_page: perPage,
      prev_page_url: page > 1 ? `${baseURL}api/categorys?page=${page - 1}` : null,
      to: endIndex,
      total: totalCount,
    };

    res.status(200).json({
      Categorys: paginationDetails,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Internal Server Error.",
      status: false,
    });
  }
};

// exports.UpdateCategory = async (req, res) => {
//   const { category_id, new_category_name } = req.body;
//   const _id = category_id;
//   try {
//     if (!category_id || !new_category_name) {
//       return res.status(404).json({
//         message: "Please provide category ID and new category name.",
//         status: false,
//       });
//     }

//     // Find the category by ID and update its name
//     const category = await Category.findByIdAndUpdate(
//       _id,
//       { category: new_category_name },
//       { new: true } // To return the updated category
//     );

//     if (!category) {
//       return res.status(404).json({
//         message: "Category not found.",
//         status: false,
//       });
//     }

//     // Return the updated category
//     res.status(200).json({
//       category,
//       message: "Category updated successfully.",
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error updating category:", error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };

// edit by Atest

exports.UpdateCategory = async (req, res) => {
  const { category_id, new_category_name } = req.body;

  try {
    if (!category_id || !new_category_name) {
      return res.status(400).json({
        message: "Please provide category ID and new category name.",
        status: false,
      });
    }

    // Case-insensitive check for existing category
    const existingCategory = await Category.findOne({
      category: { $regex: `^${new_category_name}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category name already exists. Cannot update.",
        status: false,
      });
    }

    // Find the category by ID and update its name
    const updatedCategory = await Category.findByIdAndUpdate(category_id, { category: new_category_name }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found.",
        status: false,
      });
    }

    res.status(200).json({
      category: updatedCategory,
      message: "Category updated successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getAllCategoryName = async (req, res) => {
  try {
    const users = await Category.find({}).select("_id category").sort({ category: 1 }); // Sort clientName in ascending order

    const totalCount = await Category.countDocuments({});

    res.json({
      totalCount: totalCount,
      categorys: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};
