import { Router } from "express";
import { getSalaryInfoListHandler } from "../controllers/salary/get-salary-info-list.handler.js";
import { getSalaryInfoHandler } from "../controllers/salary/get-salary-info.handler.js";
import { changeSalaryInfoHandler } from "../controllers/salary/change-salary-info.handler.js";
import { createSalaryInfoHandler } from "../controllers/salary/create-salary-info.handler.js";
import { deleteSalaryInfoHandler } from "../controllers/salary/delete-salary-info.handler.js";

const salaryRouter = Router();

salaryRouter
    .route("/")
    .get(getSalaryInfoListHandler)
    .post(createSalaryInfoHandler);

salaryRouter
    .route("/:id")
    .get(getSalaryInfoHandler)
    .put(changeSalaryInfoHandler)
    .delete(deleteSalaryInfoHandler);

export default salaryRouter;
