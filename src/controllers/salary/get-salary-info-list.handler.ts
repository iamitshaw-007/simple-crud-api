import { QueryResult } from "pg";
import { NextFunction, Request, Response } from "express";
import { successHttpResponseObjectUtil } from "../../utils/success-http-response.util.js";
import { errorHttpResponseObjectUtil } from "../../utils/error-http-response.util.js";
import { winstonLoggerUtil } from "../../utils/winston-logger.util.js";
import pool from "../../configs/database.config.js";

export async function getSalaryInfoListHandler(
    request: Request,
    response: Response,
    nextFunction: NextFunction
) {
    try {
        const result: QueryResult = await pool.query("SELECT * FROM SALARY");
        winstonLoggerUtil.info("Calling Success Response Handler");
        successHttpResponseObjectUtil(request, response, 200, result.rows);
    } catch (error) {
        winstonLoggerUtil.info("Calling Error Response Generator");
        errorHttpResponseObjectUtil(error, request, response, nextFunction);
    }
}
