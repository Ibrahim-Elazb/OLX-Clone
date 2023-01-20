// @ts-nocheck
const jwt = require("jsonwebtoken");
const HttpError = require("../util/HttpError");
const roles = { admin: "admin", hr: "hr", user: "user" }

const authentication = (authorizedRoles) => {
    return (request, response, next) => {
        const authenticationToken = request.headers['authorization'];
        const token = authenticationToken?.split(" ")[1];
        if (authenticationToken?.startsWith("Bearer ") && token) {
            jwt.verify(token, process.env.LOGIN_TOKEN_SECRET, (error, userInfo) => {
                if (!error) {
                    // console.log({userInfo})
                    request.userInfo = userInfo;
                    if(authorizedRoles.includes(userInfo.role)){
                        next()
                    }else{
                        console.log(authorizedRoles)
                        console.log(userInfo.role)
                        next(new HttpError(403, "You don't have authority to do this action"));
                    }
                } else {
                    next(new HttpError(401, "invalid token"));
                }
            })
        } else {
            next(new HttpError(401, "Please, Login !!"));
        }
    }
}

module.exports = { authentication, roles };