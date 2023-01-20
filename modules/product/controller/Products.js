// @ts-nocheck
const jwt = require("jsonwebtoken");
const path=require("path");

const productModel = require("../../../Database/model/Product");
const { roles } = require("../../../Middleware/authentication");
const createPDFReport = require("../../../Services/createPDF_file");
const HttpError = require("../../../util/HttpError");

const addProduct = async (request, response, next) => {
    try {
        const { title, description, price } = request.body;
        const createdBy = request.userInfo.id;
        if (request.files?.length === 0) {
            throw new HttpError(400, "You have to add Images in your Product")
        }
        const images = request.files.map(item => item.filename);
        const newProduct = new productModel({ title, description, price: +price, createdBy, images });
        const createdProduct = await newProduct.save();
        response.status(201).json({ message: "Product is added Successfully" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const updateProduct = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const { title, description, price } = request.body;
        const userId = request.userInfo.id;
        const foundProduct = await productModel.findById(productId)
        if (!foundProduct) { throw new HttpError(400, "invalid Product ID") }
        if (foundProduct.createdBy.toString() === userId.toString()) {
            const updatedProduct = await productModel.
                findByIdAndUpdate(productId, { title, description, price: price?+price:foundProduct.price }, { new: true })
            response.status(201).json({ message: "Product is updated Successfully" })
        } else {
            response.status(401).json({ message: "You don't have authority to edit that Product Info" })
        }
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const deleteProduct_soft= async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const userId = request.userInfo.id;
        const foundProduct = await productModel.findById(productId);
        if (!foundProduct) { throw new HttpError(400, "invalid Product ID") }
        if (foundProduct.createdBy.toString() === userId.toString() || request.userInfo.role === roles.admin) {
            foundProduct.isDeleted = true; //soft delete
            const deletedProduct = await foundProduct.save();
            response.status(201).json({ message: "product is deleted Successfully" })
        } else {
            response.status(401).json({ message: "You aren't Authorized to delete that product" })
        }
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const hideProduct= async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const userId = request.userInfo.id;
        const foundProduct = await productModel.findById(productId);
        if (!foundProduct) { throw new HttpError(400, "invalid Product ID") }
        if (foundProduct.createdBy.toString() === userId.toString() || request.userInfo.role === roles.admin) {
            foundProduct.hidden = true;
            const hiddenProduct = await foundProduct.save();
            response.status(201).json({ message: "product is hidden Successfully" })
        } else {
            response.status(401).json({ message: "You aren't Authorized to hide that product" })
        }
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const deleteProduct= async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const userId = request.userInfo.id;
        const foundProduct = await productModel.findById(productId);
        if (!foundProduct) { throw new HttpError(400, "invalid Product ID") }
        if (foundProduct.createdBy.toString() === userId.toString() || request.userInfo.role === roles.admin) {
            const deletedProduct = await productModel.findByIdAndDelete(productId); //To Delete Permenantly
            response.status(201).json({ message: "product is deleted Successfully" })
        } else {
            response.status(401).json({ message: "You aren't Authorized to delete that product" })
        }
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const displayProductByID = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const foundProduct = await productModel.findById(productId)
            .select("_id title,description,price images createdBy comments")
            .populate([
                { path: "createdBy", select: "_id firstName lastName profilePicture" },
                {
                    path: "comments",
                    select: "text createdBy replies",
                    populate: [
                        { path: "createdBy", select: "_id firstName lastName profilePicture" },
                        {
                            path: "replies",
                            select: "text createdBy",
                            populate: {
                                path: "createdBy",
                                select: "_id firstName lastName profilePicture"
                            }
                        }]
                }
            ]);
        if (!foundProduct) throw new HttpError(400, "This Product isn't exist");
        foundProduct.images = foundProduct.images.map(image => `${request.protocol}://${request.hostname}:${process.env.PORT}/api/product-img/${image}`)
        foundProduct.createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${foundProduct.createdBy.profilePicture}`
        for (let commentIndex = 0; commentIndex < foundProduct.comments.length; commentIndex++) {
            foundProduct.comments[commentIndex].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${foundProduct.comments[commentIndex].createdBy.profilePicture}`
            for (let replyIndex = 0; replyIndex < foundProduct.comments[commentIndex].replies.length; replyIndex++) {
                foundProduct.comments[commentIndex].replies[replyIndex].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${foundProduct.comments[commentIndex].replies[replyIndex].createdBy.profilePicture}`

            }
        }
        response.status(200).json({ foundProduct })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

const displayAllProducts = async (request, response, next) => {
    try {
        const page=(request.query.page&&request.query.page>=1)?request.query.page:1;
        const limitSize=10;
        let foundProducts = await productModel.find().skip((page-1)*limitSize).limit(limitSize)
            .select("_id title description price images createdBy comments")
            .populate([
                { path: "createdBy", select: "_id firstName lastName profilePicture" },
                {
                    path: "comments",
                    select: "text createdBy replies",
                    populate: [
                        { path: "createdBy", select: "_id firstName lastName profilePicture" },
                        {
                            path: "replies",
                            select: "text createdBy",
                            populate: {
                                path: "createdBy",
                                select: "_id firstName lastName profilePicture"
                            }
                        }]
                }
            ]);
            foundProducts=foundProducts.map(product=>{
            product.images = product.images.map(image => `${request.protocol}://${request.hostname}:${process.env.PORT}/api/product-img/${image}`)
            product.createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${product.createdBy.profilePicture}`
            for (let commentIndex = 0; commentIndex < product.comments.length; commentIndex++) {
                product.comments[commentIndex].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${product.comments[commentIndex].createdBy.profilePicture}`
                for (let replyIndex = 0; replyIndex < product.comments[commentIndex].replies.length; replyIndex++) {
                    product.comments[commentIndex].replies[replyIndex].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${product.comments[commentIndex].replies[replyIndex].createdBy.profilePicture}`
    
                }
            }
            return product;
        })
        response.status(200).json({ foundProducts })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = { 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    deleteProduct_soft, 
    hideProduct, 
    displayProductByID, 
    displayAllProducts };