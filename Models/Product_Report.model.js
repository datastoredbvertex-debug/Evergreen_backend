const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productreportSchema = new mongoose.Schema({
  image_0: { type: String, default: null },
  image_1: { type: String, default: null },
  image_2: { type: String, default: null },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  site_id: { type: mongoose.Schema.Types.ObjectId, ref: "Site", default: null },
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  solution: { type: String, default: null },
  working_status: { type: String, default: null },
  current_value: { type: Number, default: null },
  problem_covered: { type: String, default: null },
  date: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY"),
  },  
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
});

module.exports = mongoose.model("Product_Report", productreportSchema);
