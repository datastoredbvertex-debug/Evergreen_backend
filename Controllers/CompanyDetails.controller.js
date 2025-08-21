const companyDetailsModel = require("../Models/CompanyDetails.model.js");
const baseURL = process.env.BASE_URL;
const moment = require("moment-timezone");

exports.addAboutUs = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(404).json({
      message: "Please provide content for About Us.",
      status: false,
    });
  }

  try {
    // Check if an "About Us" document already exists
    let aboutUs = await companyDetailsModel.AboutUs.findOne();

    if (aboutUs) {
      // If it exists, update the content
      aboutUs.content = content;
      await aboutUs.save();
    } else {
      // If it doesn't exist, create a new one
      aboutUs = await companyDetailsModel.AboutUs.create({
        content,
      });
    }

    res.status(201).json({ content: aboutUs.content, status: true });
  } catch (error) {
    console.error("Error adding/updating About Us:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.addTermsConditions = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(404).json({
      message: "Please provide content for Terms & Conditions.",
      status: false,
    });
  }

  try {
    // Check if a "Terms & Conditions" document already exists
    let termsConditions = await companyDetailsModel.TermsConditions.findOne();

    if (termsConditions) {
      // If it exists, update the content
      termsConditions.content = content;
      await termsConditions.save();
    } else {
      // If it doesn't exist, create a new one
      termsConditions = await companyDetailsModel.TermsConditions.create({
        content,
      });
    }

    res.status(201).json({ content: termsConditions.content, status: true });
  } catch (error) {
    console.error("Error adding/updating Terms & Conditions:", error.message);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

exports.addPrivacyPolicy = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(404).json({
      message: "Please provide content for Privacy Policy.",
      status: false,
    });
  }

  try {
    // Check if a Privacy Policy document already exists
    let privacyPolicy = await companyDetailsModel.PrivacyPolicy.findOne();

    if (privacyPolicy) {
      // If it exists, update the content
      privacyPolicy.content = content;
      await privacyPolicy.save();
    } else {
      // If it doesn't exist, create a new one
      privacyPolicy = await companyDetailsModel.PrivacyPolicy.create({
        content,
      });
    }

    res.status(201).json({
      content: privacyPolicy.content,
      status: true,
    });
  } catch (error) {
    console.error("Error adding/updating Privacy Policy:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getAboutUs = async (req, res) => {
  try {
    const aboutUs = await companyDetailsModel.AboutUs.findOne();
    if (!aboutUs) {
      return res.status(404).json({ message: "About Us not found", status: false });
    }
    res.json({ content: aboutUs.content, status: true });
  } catch (error) {
    console.error("Error getting About Us:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getTermsConditions = async (req, res) => {
  try {
    const termsConditions = await companyDetailsModel.TermsConditions.findOne();
    if (!termsConditions) {
      return res.status(404).json({
        message: "Terms & Conditions not found",
        status: false,
      });
    }
    res.json({ content: termsConditions.content, status: true });
  } catch (error) {
    console.error("Error getting Terms & Conditions:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getPrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicy = await companyDetailsModel.PrivacyPolicy.findOne();
    if (!privacyPolicy) {
      return res.status(404).json({
        message: "Privacy Policy not found",
        status: false,
      });
    }
    res.json({ content: privacyPolicy.content, status: true });
  } catch (error) {
    console.error("Error getting Privacy Policy:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.contactUs = async (req, res) => {
  try {
    // Extract parameters from the request body
    const { name, email_id, mobile_number, message } = req.body;

    // Validate parameters (you may add more validation as needed)
    if (!name || !email_id || !mobile_number || !message) {
      return res.status(404).json({ error: "Missing required parameters" });
    }

    // Create a new ContactUs document
    contactUsEntry = await companyDetailsModel.ContactUs.create({
      name,
      email_id,
      mobile_number,
      message,
      datetime:moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
    });

    // Send a success response
    return res.json({
      status: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllContact = async (req, res) => {
  const { page = 1, search = "" } = req.body;
  const perPage = 10; // You can adjust this according to your requirements

  // Build the query based on search
  const query = search
    ? {
        $or: [{ message: { $regex: search, $options: "i" } }, { name: { $regex: search, $options: "i" } }, { email_id: { $regex: search, $options: "i" } }, { mobile_number: { $regex: search, $options: "i" } }],
      }
    : {};

  try {
    const reels = await companyDetailsModel.ContactUs.find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalCount = await companyDetailsModel.ContactUs.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);

    const transformedReels = reels.map((reel) => {
      let transformedReel = { ...reel.toObject() }; // Convert Mongoose document to plain JavaScript object

      return { user: transformedReel };
    });

    const paginationDetails = {
      current_page: parseInt(page),
      data: transformedReels,
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
      to: (page - 1) * perPage + transformedReels.length,
      total: totalCount,
    };

    res.json({
      Users: paginationDetails,
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
