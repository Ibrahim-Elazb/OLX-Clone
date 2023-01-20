const productModel = require("../../../Database/model/Product");
const HttpError = require("../../../util/HttpError");

const likeComment = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const userId = request.userInfo.id;
        const likedcomment=await productModel.findOneAndUpdate({ _id: productId, "comments._id": commentId }, { $addToSet: { "comments.$.likes": userId } }, { new: true })
        if(!likedcomment){
            throw new HttpError(400,"invalid Product ID or comment ID")
        }
        response.status(201).json({ message: "like is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const unLikeComment = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const userId = request.userInfo.id;
        const unlikedcomment=await productModel.findOneAndUpdate({ _id: productId, "comments._id": commentId }, { $pull: { "comments.$.likes": userId } }, { new: true })
        if(!unlikedcomment){
            throw new HttpError(400,"invalid Product ID or comment ID")
        }
        response.status(201).json({ message: "like is Removed Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const likeReply = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const userId = request.userInfo.id;
        const likedReply = await productModel.findOneAndUpdate({ _id: productId, "comments._id": commentId },
            { $addToSet: { "comments.$[comment].replies.$[reply].likes": userId } },
            { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })

        if (!likedReply) {
            throw new HttpError(400, "invalid Product,comment or reply ID")
        }
        response.status(201).json({ message: "reply is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const unLikeReply=async (request,response,next)=>{
    try {
        const productId = request.params.productId;
        const commentId = request.params.commentId;
        const replyId = request.params.replyId;
        const userId = request.userInfo.id;
        const unlikedReply = await productModel.findOneAndUpdate({ _id: productId, "comments._id": commentId },
            { $pull: { "comments.$[comment].replies.$[reply].likes": userId } },
            { arrayFilters: [{ "comment._id": commentId }, { "reply._id": replyId }] })

        if (!unlikedReply) {
            throw new HttpError(400, "invalid product,comment or reply ID")
        }
        response.status(201).json({ message: "reply is updated Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}


module.exports = { likeComment, unLikeComment, likeReply, unLikeReply }