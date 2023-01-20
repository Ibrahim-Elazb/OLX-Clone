const productModel = require("../../../Database/model/Product");
const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const likeProduct = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const userId = request.userInfo.id;
        const likedProduct = await productModel.findByIdAndUpdate(productId, { $addToSet: { likes: userId } })
        if(!likedProduct){
            throw new HttpError(400,"invalid Product ID")
        }
        response.status(201).json({ message: "like is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const unlikeProduct = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const userId = request.userInfo.id;
        const unlikedProduct = await productModel.findByIdAndUpdate(productId, { $pull: { likes: userId } })
        if(!unlikedProduct){
            throw new HttpError(400,"invalid Product ID")
        }
        response.status(201).json({ message: "like is Removed Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const addToWishList = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const userId = request.userInfo.id;
        const WishListProduct = await productModel.findByIdAndUpdate(productId, { $addToSet: { Wishlist: userId } })
        if(!WishListProduct){
            throw new HttpError(400,"invalid Product ID")
        }
        await userModel.findByIdAndUpdate(userId, { $push: { Wishlist: productId } })
        response.status(201).json({ message: "product is added to your wishlist Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const removeFromWishList = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const userId = request.userInfo.id;
        const WishListProduct = await productModel.findByIdAndUpdate(productId, { $pull: { Wishlist: userId } })
        if(!WishListProduct){
            throw new HttpError(400,"invalid Product ID")
        }
        await userModel.findByIdAndUpdate(userId, { $pull: { Wishlist: productId } })
        response.status(201).json({ message: "product is removed to your wishlist Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}


module.exports = { likeProduct, unlikeProduct, addToWishList, removeFromWishList };