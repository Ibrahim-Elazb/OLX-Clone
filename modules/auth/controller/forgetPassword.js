const user = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");
const sendEmail = require("../../../Services/SendEmail");

const forgetPassword = async (request, response, next) => {
    const { email } = request.body;
    try {
        const foundUser = await user.findOne({ email:email.toLowerCase() });
        if (foundUser) {
            const resetCode = Math.floor(100000 + Math.random() * 900000);
            await sendEmail("ibrahimElazb2010@gmail.com", "Reset Password Code", `<h2>This is the reset password code: ${resetCode}</h2>`)
            // foundUser.resetPasswordCode=resetCode;
            // const updatedUser=await foundUser.save();
            const updatedUser=await user.findOneAndUpdate({ email },{resetPasswordCode:resetCode})
            response.status(200).json({ message: "Reset Code is sent to Your email" })
        } else {
            next(new HttpError(400, "This Email isn't exist"))
        }
    } catch (error) {
        console.log(error)
        next(new HttpError(500, "An Error Occured On server"))
    }
}

module.exports = forgetPassword;