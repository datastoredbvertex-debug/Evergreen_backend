const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
  full_name: String,
  password: String,
  role: String,
  email: String,
  firebase_token: { type: String, default: null },
  mobile: Number
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
  }
});
const Admin_Model = mongoose.model('Admin', adminSchema);

const Admin_Dashboards = new mongoose.Schema({
  All_SE_count: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  All_SV_count: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  Active_SE_count: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Define Model for Client
const Admin_Dashboard = mongoose.model('Admin_Dashboard', Admin_Dashboards);

module.exports = { Admin_Model, Admin_Dashboard };


// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// const adminSchema = new mongoose.Schema({
//   full_name: String,
//   password: String,
//   role: String,
//   firebase_token: { type: String, default: null },
//   mobile: Number
// });

// // Hash password before saving
// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Password comparison method
// adminSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Remove password from JSON output
// adminSchema.set("toJSON", {
//   transform: (doc, ret) => {
//     delete ret.password;
//   },
// });

// // ✅ Fix OverwriteModelError
// const Admin_Model = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// const Admin_Dashboards = new mongoose.Schema({
//   All_SE_count: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   All_SV_count: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   Active_SE_count: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
// });

// const Admin_Dashboard = mongoose.models.Admin_Dashboard || mongoose.model("Admin_Dashboard", Admin_Dashboards);

// module.exports = { Admin_Model, Admin_Dashboard };
