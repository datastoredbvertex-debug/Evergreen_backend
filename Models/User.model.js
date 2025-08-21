const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const baseURL = process.env.BASE_URL;

const userSchema = mongoose.Schema({
  full_name: { type: String, required: true },
  deviceId: { type: String, required: true },
  email: {
    type: String,
    match: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  },
  mobile: {
    type: Number,
    unique: true,
  },
  password: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  otp: { type: String },
  otp_verified: { type: Number, default: 0 },
  pic: {
    type: String,
    required: true,
    default: "uploads/profile/default_pic.jpg",
  },
  deleted_at: { type: String, default: null },
  role: { type: String, default: null },
  firebase_token: { type: String, default: null },
  PF_number: { type: String, default: null },
  ESIC: { type: String, default: null },
  medical_card: { type: String, default: null },
  identity_card: { type: String, default: null },
  site_id: [
    {
      type: String,
      ref: "Site", // Assuming you have a User model, adjust the ref accordingly
      default: null,
    },
  ],
  datetime: {
    type: String,
    default: moment().tz("Asia/Kolkata").format("DD-MM-YYYY HH:mm:ss"),
  },
  deactive_status: {
    type: Boolean,
    default: false,
  },
  termination: {
    type: Boolean,
    default: false,
  },
  firebase_token: { type: String, default: null },
});

// Post middleware to append baseURL to pic field
userSchema.post("findOne", function (doc) {
  if (doc) {
    doc.pic = baseURL + doc.pic;
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
  },
});
const User_Model = mongoose.model("User", userSchema);

module.exports = User_Model;
