const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Product = require("../Models/Product.model");

const siteSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  location_name: { type: String, required: true },
  site_name: { type: String, required: true },

  sv_visit: { type: Number, required: true },
  amc: { type: String, required: true },
  amc_description: { type: String, default: null },
  working_hrs: { type: String, required: true },
  man_power: { type: String, required: true },
  contractfile: [{ type: String, default: null }],
  location_lat: { type: String },
  location_long: { type: String },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  discount: { type: Number, default: null },
  report_submit: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  product: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      product_quantity: { type: Number },
      used_quantity: { type: Number, default: 0 },
      remaining_quantity: { type: Number, required: true },
      product_min_quantity: { type: Number },
      working_status: { type: String, default: "working_ok" },
      maintenance_date: [{ type: String, default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY") }],
      already_maintenance: [{ type: String, default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY") }],
      maintenance_alert: { type: String, default: "No" },
      deleted_at: { type: Boolean, required: false },
    },
  ],
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
//   datetime: {
//   type: Date,
//   default: function () {
//     return moment().tz("Asia/Kolkata").toDate(); // Stores as a proper Date object
//   },
// }
});

// Define Model for Client
const Site = mongoose.model("Site", siteSchema);

module.exports = Site;
