const mongoose = require("mongoose");
const moment = require("moment-timezone");

const leaveapplicationSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model, adjust the ref accordingly
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
});

const ResignationapplicationSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model, adjust the ref accordingly
    required: true,
  },
  last_date_working: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
});

const leaveApplicationModel = mongoose.model("leaveApplication", leaveapplicationSchema);
const ResignationApplicationModel = mongoose.model("ResignationApplication", ResignationapplicationSchema);

module.exports = { leaveApplicationModel, ResignationApplicationModel };
