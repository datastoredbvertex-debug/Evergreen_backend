const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  product_name: { type: String, required: true },
  parameter_min: { type: String, default: 0 },
  parameter_max: { type: String, default: 0 },
  unite: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
  product_quantity: { type: String, default: null },
  total_quantity: { type: String, required: null },
  min_product_quantity: { type: String, default: null },
  show_SE: { type: String, required: true },
  preventive_maintenance: { type: String, required: true },
  price: { type: Number, required: true },
  descriptions: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  HSN_code: { type: String, required: true },
  image: { type: String, required: true },
  tax: { type: Number, default: 0 },
  warrenty: { type: String, required: true },
  working_status: { type: String, default: "working_ok" },
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
});

// Define Model for Client
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
