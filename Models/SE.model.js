const mongoose = require("mongoose");
const moment = require("moment-timezone");

const seattendanceSchema = mongoose.Schema({
  date: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timeIn: { type: String },
  timeOut: { type: String },
  site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  picIn: { type: String },
  picOut: { type: String },
  entry: { type: String }, // Single field for entry type (in or out)
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
});

const SE_Attendance = mongoose.model("SE_Attendance", seattendanceSchema);

module.exports = SE_Attendance;
