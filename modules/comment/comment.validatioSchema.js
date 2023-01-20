const Joi = require("joi")

const newCommentValidationSchema = {
    body: Joi.object().required().keys({
        text: Joi.string().required().messages({
            "any.required": "You must enter Comment",
            "string.empty": "You must enter Comment",
        })
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        })
    })
}

const editCommentValidationSchema = {
    body: Joi.object().required().keys({
        text: Joi.string().required().messages({
            "any.required": "You must enter Comment",
            "string.empty": "You must enter Comment",
        })
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
        commentId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
    })
}
const likeCommentValidationSchema = {
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
        commentId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
    })
}

const newReplyValidationSchema = {
    body: Joi.object().required().keys({
        text: Joi.string().required().messages({
            "any.required": "You must enter reply text",
            "string.empty": "You must enter reply text",
        })
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
        commentId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        })
    })
}


const editReplyValidationSchema = {
    body: Joi.object().required().keys({
        text: Joi.string().required().messages({
            "any.required": "You must enter reply text",
            "string.empty": "You must enter reply text",
        })
    }),
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
        commentId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
        replyId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
    })
}


const likeReplyValidationSchema = {
    params: Joi.object().required().keys({
        productId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
        commentId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
        replyId: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required().messages({
            "any.required": "Invalid Link",
            "string.empty": "Invalid Link",
            "string.pattern.base": "Invalid Link"
        }),
    })
}



module.exports = {
    newCommentValidationSchema,
    editCommentValidationSchema,
    likeCommentValidationSchema,
    newReplyValidationSchema,
    editReplyValidationSchema,
    likeReplyValidationSchema
}