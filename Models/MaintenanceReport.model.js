const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  images: [{ type: String, default: null }],
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  solution: String,
  working_status: { type: String, default: "not_working" },
  current_value: { type: String },
  problem_covered: { type: String, default: null },
});

const reportSchema = new mongoose.Schema({
  product: [productSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
  date: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY"),
  },
  verified_status: {
    type: Boolean,
    default: false,
  },
  verified_userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference path based on verified_user field
    default: null,
  },
  verified_adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference path based on verified_user field
    default: null,
  },
  verified_user: {
    type: String,
    default: null,
    enum: ["User", "Admin"], // Allowed roles
  },
  mail_send: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Maintenance_Report", reportSchema);
