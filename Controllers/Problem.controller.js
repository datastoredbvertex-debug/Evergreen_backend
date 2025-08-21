const Problem = require("../Models/Problem.model");
const mongoose = require("mongoose");
const moment = require('moment-timezone');
const baseURL = process.env.BASE_URL;

exports.Createproblem = async (req, res) => {
  const { problem_name, solution } = req.body;
  if (!problem_name || !solution) {
    res.status(404).json({
      message: "Please enter all the required fields.",
      status: false,
    });
    return;
  }

  const problem = problem_name;
  const problems = await Problem.create({
    problem,
    datetime: moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss'),
    solution,
  });

  if (problems) {
    res.status(200).json({
      _id: problems._id,
      problem: problems.problem,
      status: true,
    });
  } else {
    res.status(404).json({
      message: "Problem Not Create.",
      status: false,
    });
    return;
  }
};

//comment by Atest 15/04/25

// exports.getAllProblemName = async (req, res) => {
//   try {
//     const users = await Problem.find({}).select("_id problem").sort({ problem: 1 }); // Sort clientName in ascending order

//     const totalCount = await Problem.countDocuments({});

//     res.json({
//       totalCount: totalCount,
//       Problems: users,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };



// edit by Atest 15/04/25


exports.getAllMobileProblemName = async (req, res) => {
  try {
    // Fetch all Problems from the database
    const Problems = await Problem.aggregate([
      {
        $project: {
          problem: 1,
          createdAt: 1,
          updatedAt: 1,
          datetime: {
            $dateFromString: {
              dateString: "$datetime",
              format: "%d-%m-%Y %H:%M:%S",
            },
          },
          solution: 1,
          isOther: {
            $cond: [{ $eq: ["$problem", "Other"] }, 1, 0],
          },
        },
      },
      { $sort: { datetime: -1 } },
    ]);

    if (!Problems || Problems.length === 0) {
      return res.status(404).json({
        message: "No Problems found.",
        status: false,
      });
    }

    // Remove isOther field and add orderId
    const finalData = Problems.map((problem, index) => {
      const { isOther, ...rest } = problem;
      return {
        ...rest,
        orderId: index + 1,
      };
    });

    res.status(200).json({
      message: "Problems fetched successfully.",
      status: true,
      Problems: finalData,
    });
  } catch (error) {
    console.error("Error fetching Problems:", error);
    res.status(500).json({
      message: "Internal Server Error.",
      status: false,
    });
  }
};


exports.getAllProblemName = async (req, res) => {
  try {
    // Fetch all Problems from the database
    const Problems = await Problem.aggregate([
      {
        $project: {
          problem: 1,
          createdAt: 1,
          updatedAt: 1,
          datetime: {
            $dateFromString: {
              dateString: "$datetime",
              format: "%d-%m-%Y %H:%M:%S",
            },
          },
          solution: 1,
          isOther: {
            $cond: [{ $eq: ["$problem", "Other"] }, 1, 0],
          },
        },
      },
      { $sort: { datetime: -1 } },
    ]);

    if (!Problems || Problems.length === 0) {
      return res.status(404).json({
        message: "No Problems found.",
        status: false,
      });
    }

    // Remove isOther field and add orderId
    const finalData = Problems.map((problem, index) => {
      const { isOther, ...rest } = problem;
      return {
        ...rest,
        orderId: index + 1,
      };
    });

    res.status(200).json({
      message: "Problems fetched successfully.",
      status: true,
      Problems: finalData,
    });
  } catch (error) {
    console.error("Error fetching Problems:", error);
    res.status(500).json({
      message: "Internal Server Error.",
      status: false,
    });
  }
};


exports.GetAllProblemsAdmin = async (req, res) => {
  const { page = 1 } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  try {
    // Fetch all Problems from the database
    const Problems = await Problem.aggregate([
      {
        $project: {
          problem: 1,
          createdAt: 1,
          updatedAt: 1,
          datetime: {
            $dateFromString: {
              dateString: "$datetime",
              format: "%d-%m-%Y %H:%M:%S", // Convert to date format
            },
          },
          solution: 1,
          isOther: {
            $cond: [{ $eq: ["$problem", "Other"] }, 1, 0],
          },
        },
      },
      // { $sort: { isOther: 1, problem: 1 } },
      { $sort: { datetime: -1 } },
    ]);

    if (!Problems || Problems.length === 0) {
      return res.status(404).json({
        message: "No Problems found.",
        status: false,
      });
    }

    // Map Problems to remove the 'isOther' property
    const sanitizedProblems = Problems.map((problem) => {
      const { isOther, ...rest } = problem;
      return rest;
    });

    let i = 0;
    // Add baseURL to pic property of each user
    const updatedProblems = sanitizedProblems.map((user) => {
      i++;
      return {
        ...user,
        orderId: i,
      };
    });

    // Pagination
    const totalCount = updatedProblems.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const paginatedProblems = updatedProblems.slice(startIndex, endIndex);

    const paginationDetails = {
      current_page: parseInt(page),
      data: paginatedProblems,
      first_page_url: `${baseURL}api/problems?page=1`,
      from: (page - 1) * perPage + 1,
      last_page: totalPages,
      last_page_url: `${baseURL}api/problems?page=${totalPages}`,
      links: [
        {
          url: null,
          label: "&laquo; Previous",
          active: false,
        },
        {
          url: `${baseURL}api/problems?page=${page}`,
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
      path: `${baseURL}api/problems`,
      per_page: perPage,
      prev_page_url: null,
      to: (page - 1) * perPage + Problems.length,
      total: totalCount,
    };

    res.status(200).json({
      Problems: paginationDetails,
    });
  } catch (error) {
    console.error("Error fetching Problems:", error);
    res.status(500).json({
      message: "Internal Server Error.",
      status: false,
    });
  }
};

// exports.UpdateProblem = async (req, res) => {
//   const { problem_id, new_problem_name } = req.body;
//   const _id = problem_id;
//   try {
//     if (!problem_id || !new_problem_name) {
//       return res.status(404).json({
//         message: "Please provide problem ID and new problem name.",
//         status: false,
//       });
//     }

//     // Find the problem by ID and update its name
//     const problem = await Problem.findByIdAndUpdate(
//       _id,
//       { problem: new_problem_name },
//       { new: true } // To return the updated problem
//     );

//     if (!problem) {
//       return res.status(404).json({
//         message: "Problem not found.",
//         status: false,
//       });
//     }

//     // Return the updated problem
//     res.status(200).json({
//       problem,
//       message: "Problem updated successfully.",
//       status: true,
//     });
//   } catch (error) {
//     console.error("Error updating problem:", error);
//     res.status(500).json({
//       message: "Internal Server Error",
//       status: false,
//     });
//   }
// };


// edit by Atest

exports.UpdateProblem = async (req, res) => {
  try {
    const { problem_id, data } = req.body; // Extract problem_id and data
    const { problem, solution } = data; // Extract problem name and solution array from data

    if (!mongoose.Types.ObjectId.isValid(problem_id)) {
      return res.status(400).json({
        message: "Invalid problem ID.",
        status: false,
      });
    }

    if (!problem || !Array.isArray(solution)) {
      return res.status(400).json({
        message: "Invalid input. Provide a problem name and solution as an array.",
        status: false,
      });
    }

    // Find and update the problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      problem_id,
      { problem, solution }, // Update problem and solution fields
      { new: true, runValidators: true } // Return the updated document & apply schema validation
    );

    if (!updatedProblem) {
      return res.status(404).json({
        message: "Problem not found.",
        status: false,
      });
    }

    res.status(200).json({
      message: "Problem updated successfully.",
      status: true,
      data: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};


exports.getProblem = async (req, res) => {
  const Id = req.body._id;
  try {
    const problem = await Problem.findById(Id);

    if (!problem) {
      return res.status(200).json({
        message: "Problem Not Found",
        status: false,
      });
    }
    res.json({
      problem: problem,
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

exports.getSolutionById = async (req, res) => {
  try {
    const { problem_Id } = req.body;
    // Assuming you have a Problem model
    const solution = await Problem.findById(problem_Id).select("solution");
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }
    res.status(200).json({ solution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
