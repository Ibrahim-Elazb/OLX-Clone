const { ref } = require("joi");
const Joi = require("joi");

const editProfileValidationSchema = {
    body: Joi.object().required().keys({
        firstName:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]([._-]|[a-zA-Z0-9]){1,30}[a-zA-Z0-9]$/)).messages({
            "string.empty":"You must first enter name",
            "string.pattern.base":`first name must start with letter, contains letters, numbers and(. , - , _ ) only. first Name should be at least 3 characters, at maximum 30 characters`,
        }),
        lastName:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]([._-]|[a-zA-Z0-9]){1,30}[a-zA-Z0-9]$/)).messages({
            "string.empty":"You must enter last name",
            "string.pattern.base":`last name must start with letter, contains letters, numbers and(. , - , _ ) only. last Name should be at least 3 characters, at maximum 30 characters`,
        }),
        email:Joi.string().email().messages({
            "string.empty":"You must enter Email",
            "string.email":"Enter valid email"
        })
    })
}

const displayProfileValidationSchema = {
    params: Joi.object().required().keys({
        id: Joi.string().pattern(new RegExp(/^[a-f0-9]{24}$/i)).required().messages({
            "any.required": "Invalid URL",
            "string.pattern.base": "Invalid URL"
        })
    })
}

const displayAllUsersValidationSchema = {
    query: Joi.object().required().keys({
        page: Joi.number().messages({
            "number.base": "Page Number is only number"
        })
    })
}

const deleteUserValidationSchema = {
    params: Joi.object().required().keys({
        id: Joi.string().pattern(new RegExp(/^[a-f0-9]{24}$/i)).required().messages({
            "any.required": "Invalid URL",
            "string.pattern.base": "Invalid URL"
        })
    })
}

const updatePasswordSchema = {
    body: Joi.object().required().keys({
        newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)).required().messages({
            "any.required": "You must enter Password",
            "string.empty": "You must enter password",
            "string.pattern.base": ` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        }),
        confirmNewPassword: Joi.string().valid(ref("newPassword")).required().messages({
            "any.required": "You must enter Confirm Password",
            "string.empty": "You must enter Confirm password",
            "any.only": "password and confirm password should be the same"
        }),
        oldPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)).required().messages({
            "any.required": "You must enter Password",
            "string.empty": "You must enter password",
            "string.pattern.base": ` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        })
    })
}

module.exports = { 
    editProfileValidationSchema, 
    displayProfileValidationSchema, 
    updatePasswordSchema, 
    deleteUserValidationSchema,
    displayAllUsersValidationSchema 
};
