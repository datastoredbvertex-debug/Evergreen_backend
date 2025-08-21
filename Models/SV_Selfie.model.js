const mongoose = require("mongoose");
const moment = require("moment-timezone");

const seselfieSchema = mongoose.Schema({
  date: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  pic: { type: String },
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
});
const SV_Selfie = mongoose.model("SV_Selfie", seselfieSchema);

module.exports = SV_Selfie;
