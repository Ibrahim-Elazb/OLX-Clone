// @ts-nocheck
const bcrypt=require("bcrypt");

const user = require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");

const resetPassword = async(request, response, next) => {
    const { email,password,resetCode } = request.body;
    try{
        const foundUser=await user.findOne({email:email.toLowerCase()});
        if(!foundUser){
            throw new HttpError(400,"This email isn't exist")
        }
        if (foundUser.resetPasswordCode===resetCode) {
            const hashedPassword=await bcrypt.hash(password,+process.env.HASH_SALT);
            const updatedUser=await user.findOneAndUpdate({email},{password:hashedPassword,resetPasswordCode:""})
            // console.log(updatedUser)
            response.status(201).json({message:"password updated successfully"})
        } else {
            next(new HttpError(400, "Invalid Password Reset Code"))
        }
    }catch(error){
        next(new HttpError(error.statusCode||500,error.message||"An Error Occured On server"))
    }
}

module.exports = resetPassword;