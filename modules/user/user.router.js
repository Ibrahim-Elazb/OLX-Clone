const router = require("express").Router();

const validation = require("../../Middleware/validation");
const updateUserInfo = require("./controller/updateUserInfo");
const { authentication, roles } = require("../../Middleware/authentication");
const { editProfileValidationSchema, 
        displayProfileValidationSchema, 
        updatePasswordSchema,
        deleteUserValidationSchema,
        displayAllUsersValidationSchema } = require("./user.validationSchema");
const displayUserProfile = require("./controller/displayUserProfile");
const updateProfileImage = require("./controller/updateProfileImage");
const updateCoverImages = require("./controller/updateCoverImages");
const updatePassword = require("./controller/updatePAssword");
const {deleteUserPermenantly,deleteUserTemporarly}=require("./controller/deleteUser")
const { multerUpload, multerValidFileTypes } = require("../../Services/multerUpload");

const editUserRoles = [roles.admin, roles.hr, roles.user];
const deleteUserRoles = [roles.admin, roles.user];
const deleteUserTemporarlyRoles = [roles.admin];
const displayAllUsersRoles = [roles.admin];
const displayUserRoles = [roles.admin, roles.hr, roles.user];

const storeProfileImage = multerUpload(multerValidFileTypes.image, "upload/profileImages/").single("profileImage");
const storecoverImages=multerUpload(multerValidFileTypes.image,"upload/coverImages/").array("coverImages",5);

router.patch("/edit-my-information/:id", authentication(editUserRoles), storeProfileImage, validation(editProfileValidationSchema), updateUserInfo);
router.patch("/change-profile-picture/:id", authentication(editUserRoles),storeProfileImage, updateProfileImage);
router.patch("/change-cover-pictures/:id", authentication(editUserRoles), storecoverImages, updateCoverImages);
router.patch("/change-password/:id", authentication(editUserRoles), validation(updatePasswordSchema), updatePassword);

router.delete("/delete-user/:id", authentication(deleteUserRoles), validation(deleteUserValidationSchema), deleteUserPermenantly);
router.delete("/delete-user-temporarly/:id", authentication(deleteUserTemporarlyRoles), validation(deleteUserValidationSchema), deleteUserTemporarly);

router.get("/show-profile/:id", authentication(displayUserRoles), validation(displayProfileValidationSchema), displayUserProfile);

module.exports = router;