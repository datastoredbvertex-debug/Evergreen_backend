const express = require('express');
const {
  addAboutUs,
  addTermsConditions,
  addPrivacyPolicy,
  getAboutUs,
  getTermsConditions,
  getPrivacyPolicy,
  contactUs,
  getAllContact
} = require('../Controllers/CompanyDetails.controller');
const Authentication = require('../Middlewares/Authentication.middleware');
const Authorization = require('../Middlewares/Authorization.middleware');

const CompanyDetails = express.Router();

CompanyDetails.post('/addAboutUs', Authentication, Authorization(['Admin', "Sub_Admin"]), addAboutUs);
CompanyDetails.post('/addTermsConditions', Authentication, Authorization(['Admin', "Sub_Admin"]), addTermsConditions);
CompanyDetails.post('/addPrivacyPolicy', Authentication, Authorization(['Admin', "Sub_Admin"]), addPrivacyPolicy);
CompanyDetails.post('/getAllContact', Authentication, Authorization(['Admin', "Sub_Admin"]), getAllContact);

CompanyDetails.route('/contactUs').post(contactUs);
CompanyDetails.route('/getAboutUs').get(getAboutUs);
CompanyDetails.route('/getTermsConditions').get(getTermsConditions);
CompanyDetails.route('/getPrivacyPolicy').get(getPrivacyPolicy);

module.exports = { CompanyDetails };
