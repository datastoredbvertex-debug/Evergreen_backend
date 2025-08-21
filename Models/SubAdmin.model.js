const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
  full_name: String,
  password: String,
  role: String,
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
// Define Model for Client
const Admin_Model = mongoose.model('SubAdmin', adminSchema);

module.exports = Admin_Model;
