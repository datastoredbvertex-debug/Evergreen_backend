const mongoose = require("mongoose");
const moment = require("moment-timezone");

const unitSchema = mongoose.Schema({
  unit: { type: String, required: true },
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
});

unitSchema.pre("save", function (next) {
  // Capitalize the first letter of description
  if (this.isModified("unit")) {
    this.unit = this.unit.charAt(0).toUpperCase() + this.unit.slice(1);
  }
  next();
});

const Unit = mongoose.model("Unit", unitSchema); // Changed model name to 'Unit'

module.exports = Unit;
