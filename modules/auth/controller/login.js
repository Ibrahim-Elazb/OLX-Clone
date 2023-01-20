// @ts-nocheck
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require("../../../Database/model/User");
const HttpError = require('../../../util/HttpError');

const login = async (request, response, next) => {
    const { email, password } = request.body;
    try {
        const user = await userModel.findOne({ email:email.toLowerCase() })
        if (!user) throw new HttpError(400, "Email or password is wrong");
        if(user.isDeleted) throw new HttpError(401, "This account is deleted");
        if(user.isBlocked) throw new HttpError(401, "Sorry, Your account is blocked");
        if (!user.confirmEmail) throw new HttpError(400, "Please, Confirm Your Email by the link which we sent to your email")
        const isMatched=await bcrypt.compare(password, user.password)
        if(!isMatched)throw new HttpError(400, "Invalid Token")      
        const token = jwt.sign({
            id: user._id,
            name: user.userName,
            email: user.email,
            role: user.role
        }, process.env.LOGIN_TOKEN_SECRET, { expiresIn: "24h" })
        response.status(200).json({ message: "login successfully", token });                   
    } catch (error) {
        console.log(error)
        next(new HttpError(error.statusCode||500, error.message||"System Problem, Please try later"))
    }
}

module.exports = login;