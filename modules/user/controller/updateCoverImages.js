// @ts-nocheck

const fs = require("fs")
const path = require("path")

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const updateCoverImages = async (request, response, next) => {
    try {
        const userId = request.userInfo.id;
        const id = request.params.id;
        if (userId.toString() !== id.toString())
            throw new HttpError(401, "You don't have authority to update this account");
        if (request.files?.length === 0)
            throw new HttpError(400, "No Cover Pictures is added");
        const coverPictures = request.files.map(file => file.filename);
        const preUpdatedUser = await userModel.findByIdAndUpdate(userId, { coverPictures })
        if (!preUpdatedUser) throw new HttpError(400, "This user is not exist");
        for (let index = 0; index < preUpdatedUser.coverPictures?.length; index++) {
            fs.unlink(path.join(__dirname, "../../../upload/coverImages/" + preUpdatedUser.coverPictures[index]), (error) => {
                if (error) {
                    console.log("Error occurred during file delete: " + error)
                } else {
                    console.log("old profile image was deleted")
                }
            })
        }
        response.status(201).json({ message: "successful changed cover images" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }
}

module.exports = updateCoverImages;