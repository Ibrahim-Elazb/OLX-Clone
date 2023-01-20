// @ts-nocheck
const fs=require("fs")
const path = require("path");
const jwt=require("jsonwebtoken");

const userModel=require("../../../Database/model/User");
const HttpError = require("../../../util/HttpError");
const { roles } = require("../../../Middleware/authentication");

const deleteUserPermenantly=async(request,response,next)=>{
    try {
        const userId = request.userInfo.id;
        const id = request.params.id;
        if (userId.toString()!== id.toString() && request.userInfo.role!==roles.admin)
            throw new HttpError(401, "You don't have authority to delete this account");
        const deletedUser = await userModel.findByIdAndDelete(id)
        if (!deletedUser) throw new HttpError(400, "This user is not exist");
        fs.unlink(path.join(__dirname, "../../../upload/profileImages/" + deletedUser.profilePicture), (error) => {
            if (error) {
                console.log("Error occurred during file delete: " + error)
            } else {
                console.log("profile image of deleted account is deleted")
            }
        })
        response.status(201).json({ message: "successfully deleted the user" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }

}

const deleteUserTemporarly=async(request,response,next)=>{
    try {
        const id = request.params.id;
        if (request.userInfo.role!==roles.admin)
            throw new HttpError(401, "You don't have authority to delete this account");
        const deletedUser = await userModel.findByIdAndUpdate(id,{isDeleted:true})
        if (!deletedUser) throw new HttpError(400, "This user is not exist");
        response.status(201).json({ message: "successfully deleted the user" })
    } catch (error) {
        console.log("Error Occured: ")
        console.log(error)
        next(new HttpError(error.statusCode || 500, error.message || "An Error Occured On server"))
    }

}

module.exports={deleteUserPermenantly,deleteUserTemporarly};