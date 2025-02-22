import Joi from "joi";

const salaryCreateSchemaObject = Joi.object({
    salary_amount: Joi.number().required(),
    month: Joi.string()
        .valid(
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        )
        .required(),
});

export default salaryCreateSchemaObject;
