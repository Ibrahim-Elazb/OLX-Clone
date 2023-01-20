const Joi = require("joi");

const newProductValidationSchema = {
    body: Joi.object().required().keys({
        title: Joi.string().pattern(new RegExp(/^[a-zA-Z]([._-\s]|[a-zA-Z0-9]){3,98}[a-zA-Z0-9]$/)).required().messages({
            "any.required": "You must enter product title",
            "string.empty": "You must enter product title",
            "string.pattern.base": `product title must start with letter, contains letters, numbers and(. , - , _ , space) only. Title should be at least 5 characters, at maximum 100 characters`,
        }),
        description: Joi.string().required().messages({
            "any.required": "You must enter Product Description",
            "string.empty": "You must enter Product Description"
        }),
        price: Joi.number().min(0).required().messages({
            "any.required": "You must enter Product Price",
            "number.base": "Price is only number",
            "number.min": "Invalid Price"
        }),
    })
}

const editProductValidationSchema = {
    body: Joi.object().required().keys({
        title: Joi.string().pattern(new RegExp(/^[a-zA-Z]([._-\s]|[a-zA-Z0-9]){3,98}[a-zA-Z0-9]$/)).messages({
            "string.empty": "You must enter product title",
            "string.pattern.base": `product title must start with letter, contains letters, numbers and(. , - , _ , space) only. Name should be at least 5 characters, at maximum 100 characters`,
        }),
        description: Joi.string().messages({
            "string.empty": "You must enter Product Description"
        }),
        price: Joi.number().min(0).messages({
            "number.base": "Price is only number",
            "number.min": "can't add price less than 0"
        }),
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        })
    })
}

const findProductValidationSchema = {
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        })
    })
}

const findAllProductsValidationSchema = {
    query: Joi.object().required().keys({
        page: Joi.number().messages({
            "number.base": "Page Number is only number"
        })
    })
}


module.exports = { 
     newProductValidationSchema,
     editProductValidationSchema,
     findProductValidationSchema,
     findAllProductsValidationSchema  };