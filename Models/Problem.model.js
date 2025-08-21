const mongoose = require('mongoose');
const moment = require('moment-timezone');

const problemSchema = mongoose.Schema({
  problem: { type: String, required: true },
  solution: [{ type: String, required: true }],
  datetime: {
    type: String,
    default: moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss')
  }
});

problemSchema.pre('save', function (next) {
  // Capitalize the first letter of description
  if (this.isModified('problem')) {
    this.problem = this.problem.charAt(0).toUpperCase() + this.problem.slice(1);
  }
  next();
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
