const Unit = require("../Models/Unit.model");
const baseURL = process.env.BASE_URL;
const moment = require("moment-timezone");
// exports.Createunite = async (req, res) => {
//   const { unit } = req.body;
//   if (!unit) {
//     res.status(404).json({
//       message: "Please enter all the required fields.",
//       status: false,
//     });
//     return;
//   }

//   const Units = await Unit.create({
//     unit, // Use 'unit' directly since it's the property name in the schema
//   });

//   if (Units) {
//     res.status(200).json({
//       _id: Units._id,
//       unit: Units.unit, // Corrected to 'unit'
//       status: true,
//     });
//   } else {
//     res.status(404).json({
//       message: "Unit Not Create.",
//       status: false,
//     });
//     return;
//   }
// };

// edit by Atest

exports.Createunite = async (req, res) => {
  let { unit } = req.body;

  if (!unit || unit.trim() === "") {
    return res.status(400).json({
      message: "Please enter a valid unit.",
      status: false,
    });
  }

  try {
    // ✅ Convert unit to lowercase and trim spaces
    unit = unit.trim();

    // ✅ Case-insensitive check for existing unit
    const existingUnit = await Unit.findOne({
      unit: { $regex: `^${unit}$`, $options: "i" },
    });

    if (existingUnit) {
      return res.status(400).json({
        message: "Unit already exists.",
        status: false,
      });
    }

    // ✅ Create and save the unit
    const newUnit = new Unit({ unit, datetime: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss") });
    await newUnit.save();

    res.status(201).json({
      _id: newUnit._id,
      unit: newUnit.unit,
      status: true,
    });
  } catch (error) {
    console.error("Error creating unit:", error);

    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.GetAllUnit = async (req, res) => {
  const { page = 1, search = "", Short = "" } = req.body;
  // const perPage = 10; // Adjust as needed
  const perPage = await Unit.countDocuments({});
  try {
    const Units = await Unit.aggregate([
      {
        $project: {
          unit: 1, // Ensure 'unit' matches the field name in your schema
          createdAt: 1,
          updatedAt: 1,
          datetime: {
            $dateFromString: {
              dateString: "$datetime",
              format: "%d-%m-%Y %H:%M:%S", // Convert to date format
            },
          },
          isOther: {
            $cond: [{ $eq: ["$unit", "Other"] }, 1, 0], // Ensure 'unit' matches the field name in your schema
          },
        },
      },
      // { $sort: { isOther: 1, unit: 1 } }, // Ensure 'unit' matches the field name in your schema
      { $sort: { datetime: -1 } },
    ]);

    if (!Units || Units.length === 0) {
      return res.status(404).json({
        message: "No Units found.",
        status: false,
      });
    }

    // Map Units to remove the 'isOther' property
    const sanitizedUnits = Units.map((unit) => {
      const { isOther, ...rest } = unit;
      return rest;
    });

    let i = 0;
    // Add baseURL to pic property of each user
    const updatedUnits = sanitizedUnits.map((user) => {
      i++;
      return {
        ...user,
        orderId: i,
      };
    });

    // Pagination
    const totalCount = updatedUnits.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const paginatedUnits = updatedUnits.slice(startIndex, endIndex);

    const paginationDetails = {
      current_page: parseInt(page),
      data: paginatedUnits,
      first_page_url: `${baseURL}api/Units?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${baseURL}api/Units?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: page > 1,
        },
        {
          url: `${baseURL}api/Units?page=${page}`,
          label: page.toString(),
          active: true,
        },
        {
          url: page < totalPages ? `${baseURL}api/Units?page=${page + 1}` : null,
          label: "Next &raquo;",
          active: page < totalPages,
        },
      ],
      next_page_url: page < totalPages ? `${baseURL}api/Units?page=${page + 1}` : null,
      path: `${baseURL}api/Units`,
      per_page: perPage,
      prev_page_url: page > 1 ? `${baseURL}api/Units?page=${page - 1}` : null,
      to: Math.min(endIndex, totalCount),
      total: totalCount,
    };

    res.status(200).json({
      Units: paginationDetails,
    });
  } catch (error) {
    console.error("Error fetching Units:", error);
    res.status(500).json({
      message: "Internal Server Error.",
      status: false,
    });
  }
};

exports.UpdateUnit = async (req, res) => {
  const { unit_id, new_unit_name } = req.body;

  if (!unit_id || !new_unit_name) {
    return res.status(400).json({
      errors: { unit: "Please provide unit ID and new unit name." },
      status: false,
    });
  }
  // const unit_name = new_unit_name.replace(/\s+/g, " ").trim();  it remove space before word and after word
  const unit_name = new_unit_name.replace(/\s+/g, ""); // it remove all spaces

  try {
    // ✅ Check if the new unit name already exists (excluding the current one)
    // const existingUnit = await Unit.findOne({ unit: new_unit_name });
    const existingUnit = await Unit.findOne({ unit: { $regex: `^${unit_name}$`, $options: "i" } });
    if (existingUnit) {
      return res.status(400).json({
        errors: { unit: "This unit name already exists." }, // ✅ Prevent duplicate update
        status: false,
      });
    }
    const dateTime = moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss");
    // ✅ Find the unit by ID and update its name
    const unit = await Unit.findByIdAndUpdate(unit_id, { unit: unit_name }, { datetime: dateTime }, { new: true });

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found.",
        status: false,
      });
    }

    res.status(200).json({
      unit,
      message: "Unit updated successfully.",
      status: true,
    });
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getUnit = async (req, res) => {
  const Id = req.body._id;
  try {
    const unit = await Unit.findById(Id);

    if (!unit) {
      return res.status(200).json({
        message: "Unit Not Found",
        status: false,
      });
    }
    res.json({
      unit: unit,
      status: true,
    });
  } catch (error) {
    console.error("GetUsers API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};
