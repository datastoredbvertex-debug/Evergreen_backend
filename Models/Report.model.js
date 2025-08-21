const mongoose = require("mongoose");
const moment = require("moment-timezone");

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  product_report_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product_Report", // Assuming you have a User model, adjust the ref accordingly
      default: null,
    },
  ],
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
    ref: "User", // यहां रोल के आधार पर रेफरेंस को रेफर किया गया है
    default: null,
  },
  verified_adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // यहां रोल के आधार पर रेफरेंस को रेफर किया गया है
    default: null,
  },
  verified_user: {
    type: String,
    default: null,
  },
  mail_send: {
    type: Boolean,
    default: false,
  },
  all_data_submit: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Report", reportSchema);
