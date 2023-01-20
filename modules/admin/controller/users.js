// @ts-nocheck
const QRCode = require('qrcode');

const userModel = require("../../../Database/model/User");
const productModel = require("../../../Database/model/Product");
const { roles } = require("../../../Middleware/authentication");
const HttpError = require("../../../util/HttpError");
const createPDFReport = require('../../../Services/createPDF_file');


const displayAllUsersWithProducts = async (request, response, next) => {
    try {
        const page = (request.query.page && request.query.page >= 1) ? request.query.page : 1;
        const limitSize = 10;
        const allUsers = await userModel.find().skip((page - 1) * limitSize).limit(limitSize).select("-password -role -confirmEmail -createdAt -updatedAt -__v");
        const allUsersWithProducts = await Promise.all(allUsers.map(async(user) => {
            if (user.profilePicture) {
                user.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${user.profilePicture}`
            }

            if (user.coverPictures.length > 0) {
                for (let index = 0; index < user.coverPictures.length; index++) {
                    user.coverPictures[index] = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/cover-img/${user.coverPictures[index]}`
                }
            }

            let userProducts = await productModel.find({ createdBy: user._id })
                .select("_id title description price images comments")
                .populate([
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
            userProducts = userProducts.map(product => {
                product.images = product.images.map(image => `${request.protocol}://${request.hostname}:${process.env.PORT}/api/product-img/${image}`)
                for (let commentIndex = 0; commentIndex < product.comments.length; commentIndex++) {
                    product.comments[commentIndex].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${product.comments[commentIndex].createdBy.profilePicture}`
                    for (let replyIndex = 0; replyIndex < product.comments[commentIndex].replies.length; replyIndex++) {
                        product.comments[commentIndex].replies[replyIndex].createdBy.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${product.comments[commentIndex].replies[replyIndex].createdBy.profilePicture}`
                    }
                }
                return product;
            })

            const getUserProducts = async () => {
                let userProducts = await productModel.find({ createdBy: user._id })
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
                userProducts = userProducts.map(product => {
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
                return userProducts;
            }
            // user.products = userProducts;
            // console.log(user.products)
            // console.log(user.firstName)
            
            const url = await QRCode
            .toDataURL(`${request.protocol}://${request.hostname}:${process.env.PORT}/api/users/show-profile/${user._id}`)
            user.qrCode = url;
            return {...user._doc,products:userProducts};
        }))

        response.status(200).json(allUsersWithProducts)
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}


const displayAllUsers = async (request, response, next) => {
    try {
        const users = await userModel.find({}).select("-_id -password -confirmEmail -createdAt -updatedAt -__v")
        if (users.length === 0) {
            return response.status(200).json([]);
        }
        users.map(user => {
            if (user.profilePicture) {
                user.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${user.profilePicture}`
            }
            if (user.coverPictures.length > 0) {
                for (let index = 0; index < user.coverPictures.length; index++) {
                    user.coverPictures[index] = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/cover-img/${user.coverPictures[index]}`
                }
            }
        })
        response.status(200).json(users)
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}


const ChangeRole = async (request, response, next) => {
    const updatedId = request.params.userId;
    const { role } = request.body;
    try {
        if (request.userInfo.role !== roles.admin)
            throw new HttpError(401, "You don't have authority to update role of this user");
        const updatedUser = await userModel.findByIdAndUpdate(updatedId, { role }, { new: true });
        if (!updatedUser)
            throw new HttpError(400, "Not Exist User");
        response.status(201).json("user role is updated")
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}

const BlockUser = async (request, response, next) => {
    const updatedId = request.params.userId;
    const { isBlocked } = request.body;
    try {
        if (request.userInfo.role !== roles.admin)
            throw new HttpError(401, "You don't have authority to update role of this user");
        const updatedUser = await userModel.findByIdAndUpdate(updatedId, { isBlocked }, { new: true });
        if (!updatedUser)
            throw new HttpError(400, "Not Exist User");
        response.status(201).json(isBlocked ? `${updatedUser.userName} is Blocked` : `${updatedUser.userName} is UnBlocked`)
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "System Problem, Please try later"))
    }
}

module.exports = { ChangeRole, BlockUser, displayAllUsers, displayAllUsersWithProducts };