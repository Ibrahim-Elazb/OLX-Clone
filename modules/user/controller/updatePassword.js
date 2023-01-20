const fs = require("fs")
const path = require("path")
const bcrypt = require("bcrypt");

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const updatePassword = async (request, response, next) => {

    const userId = request.userInfo.id;
    const { newPassword, oldPassword } = request.body;
    try {
        if (oldPassword === newPassword) {
            throw new HttpError(409, "New Password is the same as Old Password");
        }
        const foundUser = await userModel.findById(userId);
        if (foundUser) {
            const isMatched = await bcrypt.compare(oldPassword, foundUser.password);
            if (isMatched) {
                foundUser.password = newPassword;
                const updatedPassword = await foundUser.save()
                response.status(201).json("password is updated successfully")
            } else {
                next(new HttpError(400, "Old Password is wrong"))
            }
        } else {
            next(new HttpError(400, "Not Found User"))
        }
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}
module.exports = updatePassword;