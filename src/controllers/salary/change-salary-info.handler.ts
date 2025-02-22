import { Request, Response, NextFunction } from "express";
import { winstonLoggerUtil } from "../../utils/winston-logger.util.js";
import { errorHttpResponseObjectUtil } from "../../utils/error-http-response.util.js";
import { QueryResult } from "pg";
import pool from "../../configs/database.config.js";
import { successHttpResponseObjectUtil } from "../../utils/success-http-response.util.js";
import salaryUpdateSchemaObject from "./joi-data-validator/salary-update-schema-object.joi.js";

export async function changeSalaryInfoHandler(
    request: Request,
    response: Response,
    nextFunction: NextFunction
) {
    try {
        /* validate request body */
        const { error, value } = salaryUpdateSchemaObject.validate(
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
            const updateFieldList = [];
            for (const [fieldKey, fieldValue] of Object.entries(value)) {
                if (fieldValue !== undefined) {
                    updateFieldList.push(`${fieldKey} = '${fieldValue}'`);
                }
            }
            if (updateFieldList.length === 0) {
                errorHttpResponseObjectUtil(
                    new Error("No Valid Fields Provided for Update"),
                    request,
                    response,
                    nextFunction,
                    400
                );
            } else {
                const { id } = request.params;
                const selectQueryResult: QueryResult = await pool.query(
                    "SELECT * FROM salary WHERE id = $1",
                    [id]
                );
                if (selectQueryResult.rows.length > 0) {
                    const updateQueryResult: QueryResult = await pool.query(
                        `UPDATE salary SET ${updateFieldList.join(", ")} WHERE id = $1 RETURNING *`,
                        [id]
                    );
                    winstonLoggerUtil.info("Calling Success Response Handler");
                    successHttpResponseObjectUtil(request, response, 200, {
                        salary: updateQueryResult.rows,
                        salaryCount: updateQueryResult.rowCount,
                    });
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
            }
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
