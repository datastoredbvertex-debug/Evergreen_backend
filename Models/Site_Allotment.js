const mongoose = require('mongoose');
const moment = require('moment-timezone');

const site_allomentSchema = new mongoose.Schema({
  date: {
    type: String,
    default: moment().tz('Asia/Kolkata').format('DD/MM/YYYY')
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  site_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site', // Assuming you have a User model, adjust the ref accordingly
      default: null
    }
  ]
});

// Define Model for Client
const SV_Site_Alloment = mongoose.model('SV_Site_Alloment', site_allomentSchema);

module.exports = SV_Site_Alloment;
