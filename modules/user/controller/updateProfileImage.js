const fs = require("fs")
const path = require("path")

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const updateProfileImage = async (request, response, next) => {
    try {
        const userId = request.userInfo.id;
        const id = request.params.id;
        if (userId.toString() !== id.toString())
            throw new HttpError(401, "You don't have authority to update this account");
        if (!request.file)
            throw new HttpError(400, "No Profile Picture is added");
        const profilePicture = request.file?.filename;
        const preUpdatedUser = await userModel.findByIdAndUpdate(userId, { profilePicture })
        if (!preUpdatedUser) throw new HttpError(400, "This user is not exist");
        fs.unlink(path.join(__dirname, "../../../upload/profileImages/" + preUpdatedUser.profilePicture), (error) => {
            if (error) {
                console.log("Error occurred during file delete: " + error)
            } else {
                console.log("old profile image was deleted")
            }
        })
        response.status(201).json({ message: "successful changed profile image" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = updateProfileImage;