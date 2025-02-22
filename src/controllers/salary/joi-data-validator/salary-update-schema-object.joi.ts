import Joi from "joi";

const salaryUpdateSchemaObject = Joi.object({
    salary_amount: Joi.number().required(),
});

export default salaryUpdateSchemaObject;
