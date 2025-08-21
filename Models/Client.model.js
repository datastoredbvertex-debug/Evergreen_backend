const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientName: String,
  clientEmail: String,
  address: String,
  pincode: Number,
  clientmobile: Number,
  state: String,
  city: String,
  gst: String,
  otp: { type: String },
  emailData: [
    {
      name: String,
      designation: String,
      email: String,
      mobile: String,
    },
  ],
});

// Define Model for Client
const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
