// @ts-nocheck
const QRCode = require('qrcode')

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const displayUserProfile = async (request, response, next) => {
    const id = request.params.id;
    try {
        const user = await userModel.findById(id).select("-_id -password -role -confirmEmail -createdAt -updatedAt -__v");
        if (!user) throw new HttpError(400, "Not found user");
        if (user.profilePicture) {
            user.profilePicture = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/profile-img/${user.profilePicture}`
        }
        if (user.coverPictures.length > 0) {
            for (let index = 0; index < user.coverPictures.length; index++) {
                user.coverPictures[index] = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/cover-img/${user.coverPictures[index]}`
            }
        }

        const url = await QRCode
            .toDataURL(`${request.protocol}://${request.hostname}:${process.env.PORT}/api/users/show-profile/${id}`)
        user.qrcodeUrl = url;
        response.status(200).json({ user })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = displayUserProfile;