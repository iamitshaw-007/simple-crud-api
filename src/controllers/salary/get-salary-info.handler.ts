import { Request, Response, NextFunction } from "express";
import { winstonLoggerUtil } from "../../utils/winston-logger.util.js";
import { errorHttpResponseObjectUtil } from "../../utils/error-http-response.util.js";
import { QueryResult } from "pg";
import pool from "../../configs/database.config.js";
import { successHttpResponseObjectUtil } from "../../utils/success-http-response.util.js";

export async function getSalaryInfoHandler(
    request: Request,
    response: Response,
    nextFunction: NextFunction
) {
    try {
        const { id } = request.params;
        const result: QueryResult = await pool.query(
            "SELECT * FROM SALARY WHERE id = $1",
            [id]
        );
        if (result.rows.length > 0) {
            winstonLoggerUtil.info("Calling Success Response Handler");
            successHttpResponseObjectUtil(request, response, 200, result.rows);
        } else {
            winstonLoggerUtil.info("Calling Error Response Handler");
            errorHttpResponseObjectUtil(
                new Error(`No salary information found`),
                request,
                response,
                nextFunction,
                404,
                { id }
            );
        }
    } catch (error) {
        winstonLoggerUtil.error("Calling Error Response Generator");
        errorHttpResponseObjectUtil(
            error,
            request,
            response,
            nextFunction,
            500
        );
    }
}
