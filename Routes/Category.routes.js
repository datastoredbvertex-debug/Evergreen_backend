const { Createcategory, GetAllCategorysAdmin, UpdateCategory, getAllCategoryName } = require('../Controllers/Category.controller');
const Authentication = require('../Middlewares/Authentication.middleware');
const Authorization = require('../Middlewares/Authorization.middleware');
const express = require('express');

const CategorysRouter = express.Router();

CategorysRouter.post('/get_all_Category', Authentication, Authorization(['Admin', "Sub_Admin"]), GetAllCategorysAdmin);
CategorysRouter.post('/UpdateCategory', Authentication, Authorization(['Admin', "Sub_Admin"]), UpdateCategory);
CategorysRouter.post('/add_Category', Authentication, Authorization(['Admin', "Sub_Admin"]), Createcategory);
CategorysRouter.get('/getAllCategoryName', Authentication, Authorization(['Admin', "Sub_Admin"]), getAllCategoryName);

module.exports = CategorysRouter;
