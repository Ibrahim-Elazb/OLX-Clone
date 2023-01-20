const Joi = require("joi");

const displayAllUsersValidationSchema = {
    query: Joi.object().required().keys({
        page: Joi.number().messages({
            "number.base": "Page Number is only number"
        })
    })
}

const changeRoleValidationSchema = {
    body:Joi.object().required().keys({
        role:Joi.string().required().pattern(new RegExp(/^[uU][sS][eE][rR]|[aA][dD][mM][iI][nN]|[hH][rR]$/)).messages({
            "any.required": "Enter new role",
            "string.empty": "Enter new role",
            "string.pattern.base":"Enter valid role (admin,hr,user)"
        })
    }),
    params: Joi.object().required().keys({
        userId: Joi.string().pattern(new RegExp(/^[a-f0-9]{24}$/i)).required().messages({
            "any.required": "Invalid URL",
            "string.pattern.base": "Invalid URL"
        })
    })
}

const blockingUserValidationSchema = {
    body:Joi.object().required().keys({
        isBlocked:Joi.boolean().required().messages({
            "any.required": "Enter blocking state",
            "boolean.base":"blocking true or false"
        })
    }),
    params: Joi.object().required().keys({
        userId: Joi.string().pattern(new RegExp(/^[a-f0-9]{24}$/i)).required().messages({
            "any.required": "Invalid URL",
            "string.pattern.base": "Invalid URL"
        })
    })
}


module.exports={changeRoleValidationSchema,blockingUserValidationSchema}