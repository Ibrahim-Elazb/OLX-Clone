// @ts-nocheck
const router=require("express").Router();

const emailConfirm = require("./controller/emailConfirm");
const registeration = require("./controller/registeration");
const login = require("./controller/login");
const validation=require("../../Middleware/validation");
const { signUpValidationSchema, loginValidationSchema, forgetPasswordValidationSchema, resetPasswordValidationSchema } = require("./auth.validationSchema");
const {multerUpload,multerValidFileTypes}=require("../../Services/multerUpload");
const forgetPassword = require("./controller/forgetPassword");
const resetPassword = require("./controller/resetPassword");

const storeProfileImage=multerUpload(multerValidFileTypes.image,"upload/profileImages/").single("profileImage");

router.post("/signup/",storeProfileImage,validation(signUpValidationSchema),registeration)
router.post("/login/",validation(loginValidationSchema),login)
router.get("/confirmEmail/:token",emailConfirm)
router.patch("/forget-password",validation(forgetPasswordValidationSchema),forgetPassword)
router.patch("/reset-password",validation(resetPasswordValidationSchema),resetPassword)

module.exports=router;