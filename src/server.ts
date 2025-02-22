import app from "./app.js";
import instanceVariable from "./configs/system-variables.config.js";
import { winstonLoggerUtil } from "./utils/winston-logger.util.js";
import pool from "./configs/database.config.js";
import { QueryResult } from "pg";

(async function () {
    try {
        /* Database Connection */
        let result: QueryResult = await pool.query("SELECT NOW()");

        winstonLoggerUtil.info("Get Current Time", {
            meta: {
                databasePort: instanceVariable.DATABASE_PORT,
                environment: instanceVariable.SYSTEM_ENVIRONMENT,
                currentDate: result.rows,
            },
        });
        result = await pool.query("SELECT * FROM SALARY");

        winstonLoggerUtil.info("Fetch Salary Informatin", {
            meta: {
                databasePort: instanceVariable.DATABASE_PORT,
                environment: instanceVariable.SYSTEM_ENVIRONMENT,
                salaryInfoList: result.rows,
            },
        });
    } catch (error) {
        winstonLoggerUtil.error("Application Error", { meta: error });
    }
})();
app.listen(instanceVariable.PORT, function () {
    winstonLoggerUtil.info(`Server started on PORT: ${instanceVariable.PORT}`);
});
