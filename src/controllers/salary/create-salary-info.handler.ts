import { Request, Response, NextFunction } from "express";
import { winstonLoggerUtil } from "../../utils/winston-logger.util.js";
import { errorHttpResponseObjectUtil } from "../../utils/error-http-response.util.js";
import { QueryResult } from "pg";
import pool from "../../configs/database.config.js";
import { successHttpResponseObjectUtil } from "../../utils/success-http-response.util.js";
import salaryCreateSchemaObject from "./joi-data-validator/salary-create-schema-object.joi.js";

export async function createSalaryInfoHandler(
    request: Request,
    response: Response,
    nextFunction: NextFunction
) {
    try {
        /* validate request body */
        const { error, value } = salaryCreateSchemaObject.validate(
            request.body,
            {
                abortEarly: false,
            }
        );
        if (error) {
            errorHttpResponseObjectUtil(
                new Error("Validation Error"),
                request,
                response,
                nextFunction,
                400,
                {
                    errorDetails: error.details.map(
                        (errorDetail) => errorDetail.message
                    ),
                }
            );
        } else {
            const result: QueryResult = await pool.query(
                `INSERT INTO SALARY (salary_amount, month) VALUES ($1, $2) RETURNING *`,
                [value.salary_amount, value.month]
            );
            winstonLoggerUtil.info("Calling Success Response Handler");
            successHttpResponseObjectUtil(request, response, 201, {
                salary: result.rows,
                salaryCount: result.rowCount,
            });
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
