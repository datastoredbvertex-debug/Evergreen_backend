const { Createproblem, GetAllProblemsAdmin, UpdateProblem, getProblem, getSolutionById, getAllProblemName, getAllMobileProblemName } = require("../Controllers/Problem.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");
const express = require("express");

const ProblemsRouter = express.Router();
// edit
ProblemsRouter.post("/get_all_Problem", Authentication, Authorization(["Admin", "super_engineer", "supervisor", "Sub_Admin"]), GetAllProblemsAdmin);
ProblemsRouter.post("/getAllMobileProblemName", Authentication, Authorization(["Admin", "super_engineer", "supervisor", "Sub_Admin"]), getAllMobileProblemName);
ProblemsRouter.get("/getAllProblemName", Authentication, Authorization(["Admin", "super_engineer", "supervisor", "Sub_Admin"]), getAllProblemName);
ProblemsRouter.post("/getProblem", Authentication, Authorization(["Admin", "super_engineer", "supervisor", "Sub_Admin"]), getProblem);
ProblemsRouter.post("/UpdateProblem", Authentication, Authorization(["Admin", "Sub_Admin"]), UpdateProblem);
ProblemsRouter.post("/add_Problem", Authentication, Authorization(["Admin", "Sub_Admin"]), Createproblem);
ProblemsRouter.post("/getSolutionById", Authentication, Authorization(["Admin", "super_engineer", "supervisor", "Sub_Admin"]), getSolutionById);

module.exports = ProblemsRouter;
