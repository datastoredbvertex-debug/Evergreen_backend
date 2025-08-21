const { getAllClientName } = require('../Controllers/Client.controller');
const Authentication = require('../Middlewares/Authentication.middleware');
const Authorization = require('../Middlewares/Authorization.middleware');
const express = require('express');

const ClientRouter = express.Router();

ClientRouter.get('/getAllClientName', Authentication, Authorization(['Admin', "Sub_Admin"]), getAllClientName);
module.exports = ClientRouter;
