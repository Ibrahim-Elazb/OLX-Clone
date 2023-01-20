// @ts-nocheck
const jwt = require("jsonwebtoken");
const userModel = require("../../../Database/model/User");
const sendEmail = require("../../../Services/SendEmail");
const HttpError = require("../../../util/HttpError");
const emailConfirm = (request, response, next) => {
    const token = request.params.token;
    // console.log(token)
    try {
        const tokenPayload = jwt.verify(token, process.env.CONFIRM_EMAIL_TOKEN_SECRET);
        // console.log(tokenPayload)
        userModel.findByIdAndUpdate(tokenPayload.id, { confirmEmail: true }, { new: true })
            .then(result => {
                if (result) {
                    // console.log(result)
                    response.status(201).json({ message: "Email Confirmed" })
                } else {
                    next(new HttpError(400, "invalid email confirmation link"))
                }

            }).catch(error => {
                console.log("Error Occured: ")
                console.log(error)
                next(new HttpError(500, "An Error Occured On server"))
            })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const tokenPayload = jwt.verify(token, process.env.CONFIRM_EMAIL_TOKEN_SECRET, { ignoreExpiration: true });
            userModel.findById(tokenPayload.id).select("confirmEmail").then(user => {
                if (user.confirmEmail) {
                    next(new HttpError(400, "You account email is already confirmed"));
                } else {
                    const newToken = jwt.sign({ id: tokenPayload.id, userName: tokenPayload.userName, email: tokenPayload.email },
                        process.env.CONFIRM_EMAIL_TOKEN_SECRET, { expiresIn: "1h" })
                    const confirmationURL = `${request.protocol}://${request.host}:${process.env.PORT}/api/auth/confirmEmail/${newToken}`
                    const message = `<div>
                        <p>This is New confirmation from ${request.host}</p>
                        <p>This is link is valid for only one hour</p>
                        <a href=${confirmationURL}>Confirmation Link</a>
                        </div>`
                    sendEmail("ibrahimElazb2010@gmail.com", `Confirmation Email from ${request.host}`, message)
                    response.status(200).json({ message: "this email confirmation link is expired, another confirmation link will be sent to your email" })
                }
            }).catch(error => {
                next(new HttpError(500, "An Error Occured On server"))
            })
        } else {
            next(new HttpError(400, "Invalid Email Confirmation Link"))
        }
    }
}

module.exports = emailConfirm;