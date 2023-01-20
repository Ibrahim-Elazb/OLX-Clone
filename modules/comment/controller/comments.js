// @ts-nocheck
const productModel = require("../../../Database/model/Product");
const HttpError = require("../../../util/HttpError");

const { roles } = require("../../../Middleware/authentication");

const addComment = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const { text } = request.body;
        const createdBy = request.userInfo.id;
        console.log(productId +" "+text)
        const updatedProduct = await productModel.findByIdAndUpdate(productId, { $push: { comments: { text, createdBy } } })
        if (!updatedProduct) {
            throw new HttpError(400, "Inavlid Product ID")
        }
        response.status(201).json({ message: "Comment is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const updateComment = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const { text } = request.body;
        const userId = request.userInfo.id;
        const foundProduct = await productModel.findById(productId).select("comments");
        if (!foundProduct) {
            throw new HttpError(400, "invalid Post Id")
        }
        const foundComment = foundProduct.comments.find(comment => comment._id.toString() === commentId.toString())
        if (!foundComment) {
            throw new HttpError(400, "Invalid Comment To delete")
        }
        if (foundComment.createdBy.toString() !== userId.toString()) {
            throw new HttpError(400, "You don't have authority to delete this comment")
        }
        const newProduct = await productModel.findOneAndUpdate({ _id: productId, "comments._id": commentId },
            { $set: { "comments.$.text": text } },
            { new: true })
        response.status(201).json({ message: "Comment is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const deleteComment = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const userId = request.userInfo.id;
        const foundProduct = await productModel.findById(productId).select("comments");
        if (!foundProduct) {
            throw new HttpError(400, "invalid Post Id")
        }
        if (request.userInfo.role !== roles.admin) {
            const foundComment = foundProduct.comments.find(comment => comment._id.toString() === commentId.toString())
            if (!foundComment) {
                throw new HttpError(400, "Invalid Comment To delete")
            }
            if (foundComment.createdBy.toString() !== userId.toString()) {
                throw new HttpError(400, "You don't have authority to delete this comment")
            }
        }
        await productModel.findByIdAndUpdate(productId,{$pull:{comments:{_id:commentId}}},{new:true})
        response.status(201).json({ message: "Comment is deleted Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = { addComment, updateComment, deleteComment };