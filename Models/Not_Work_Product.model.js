const mongoose = require('mongoose');
const moment = require('moment-timezone');

const not_work_productSchema = new mongoose.Schema({
  problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  image: [{ type: String, required: true }],
  current_value: { type: Number, required: true },
  site_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location_lat: { type: String, default: null },
  location_long: { type: String, default: null },
  datetime: {
    type: String,
    default: moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss')
  }
});

// Define Model for Client
const Not_Work_Product = mongoose.model('Not_Work_Product', not_work_productSchema);

module.exports = Not_Work_Product;
