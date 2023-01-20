// @ts-nocheck
const productModel = require("../../../Database/model/Product");
const HttpError = require("../../../util/HttpError");

const { roles } = require("../../../Middleware/authentication");

const addReply = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const { text } = request.body;
        const createdBy = request.userInfo.id;
        const updatedProduct = await productModel.findOneAndUpdate({ _id: productId, "comments._id": commentId },
            { $push: { "comments.$.replies": { text, createdBy } } },
            { new: true })
        if (!updatedProduct) {
            throw new HttpError(400, "invalid product ID")
        }
        response.status(201).json({ message: "reply is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const updateReply = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const { text } = request.body;
        const userId = request.userInfo.id;
        const foundProduct = await productModel.findOne({
            _id: productId,
            "comments._id": commentId,
            "comments.replies._id": replyId
        })
            .select("comments");
        if (!foundProduct) {
            throw new HttpError(400, "invalid Product,comment or reply ID")
        }
        const foundComment = foundProduct.comments.find(comment => comment._id.toString() === commentId.toString())
        const foundReply = foundComment.replies.find(reply => reply._id.toString() === replyId.toString())
        if (foundReply.createdBy.toString() !== userId.toString()) {
            throw new HttpError(401, "you don't have authority to edit this reply")
        }
        
        await productModel.findOneAndUpdate({ _id: productId },
            { $set: { "comments.$[comment].replies.$[reply].text": text } },
            { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })
        response.status(201).json({ message: "reply is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const deleteReply = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const userId = request.userInfo.id;
        if (request.userInfo.role !== roles.admin) {
            const foundProduct = await productModel.findOne({
                _id: productId,
                "comments._id": commentId,
                "comments.replies._id": replyId
            })
                .select("comments");
            if (!foundProduct) {
                throw new HttpError(400, "invalid post,comment or reply ID")
            }
            const foundComment = foundProduct.comments.find(comment => comment._id.toString() === commentId.toString())
            const foundReply = foundComment.replies.find(reply => reply._id.toString() === replyId.toString())
            if (foundReply.createdBy.toString() !== userId.toString()) {
                throw new HttpError(401, "you don't have authority to delete this reply")
            }
        }

        //permenant delete from Database
        await productModel.findByIdAndUpdate(productId,
            {$pull:{"comments.$[comment].replies":{_id:replyId}}},
            { arrayFilters: [{ "comment._id": commentId }] })

        //soft delete
        // await productModel.findOneAndUpdate({
        //     _id: productId,
        //     "comments._id": commentId,
        //     "comments.replies._id": replyId
        // },
        //     {
        //         $set: {
        //             "comments.$[comment].replies.$[reply].isDeleted": true,
        //             "comments.$[comment].replies.$[reply].deletedBy": userId
        //         }
        //     },
        //     { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })

        response.status(201).json({ message: "Reply is deleted Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = { addReply, updateReply, deleteReply };