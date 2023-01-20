// @ts-nocheck
const fs = require("fs")
const path = require("path");
const jwt = require("jsonwebtoken");

const userModel = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");
const sendEmail= require("../../../Services/SendEmail");

const updateUserInfo = async (request, response, next) => {
    try {
        const userId = request.userInfo.id;
        const id = request.params.id;
        if (userId.toString() !== id.toString())
            throw new HttpError(401, "You don't have authority to update this account");
        const { firstName, lastName, email } = request.body;
        const profilePicture = request.file?.filename;
        const preUpdatedUser = await userModel.findByIdAndUpdate(userId, { firstName, lastName, email, profilePicture })
        if (!preUpdatedUser)
            throw new HttpError(400, "This user is not exist");
        if (preUpdatedUser.email.toLowerCase() !== email?.toLowerCase()) {
            const token = jwt.sign({
                id: preUpdatedUser._id,
                firstName: firstName ? firstName : preUpdatedUser.firstName,
                lastName: lastName ? lastName : preUpdatedUser.lastName,
                email
            },
                process.env.CONFIRM_EMAIL_TOKEN_SECRET, { expiresIn: "1h" })
            const confirmationURL = `${request.protocol}://${request.hostname}:${process.env.PORT}/api/auth/confirmEmail/${token}`
            const message = `<div>
                        <p>This is confirmation from ${request.hostname}</p>
                        <p>This is link is valid for only one hour</p>
                        <a href=${confirmationURL}>Confirmation Link</a>
                        </div>`
            sendEmail("ibrahimElazb2010@gmail.com", `Confirmation Email from ${request.hostname}`, message)
            await userModel.findByIdAndUpdate(userId, { confirmEmail: false });
        }
        if (profilePicture) {
            fs.unlink(path.join(__dirname, "../../../upload/profileImages/" + preUpdatedUser.profilePicture), (error) => {
                if (error) {
                    console.log("Error occurred during file delete: " + error)
                } else {
                    console.log("old profile image was deleted")
                }
            })
        }
        response.status(201).json({ message: "successful updateUserInfo" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }

}

module.exports = updateUserInfo;