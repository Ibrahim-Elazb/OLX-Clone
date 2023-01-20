const { authentication, roles } = require("../../Middleware/authentication");
const validation = require("../../Middleware/validation");
const { multerUpload, multerValidFileTypes } = require("../../Services/multerUpload");
const { likeProduct, addToWishList, unlikeProduct, removeFromWishList } = require("./controller/likes_wishList");
const {  addProduct, updateProduct, deleteProduct, displayProductByID, displayAllProducts, deleteProduct_soft, hideProduct } = require("./controller/Products");
const { newProductValidationSchema, editProductValidationSchema, findProductValidationSchema, findAllProductsValidationSchema  } = require("./product.validatioSchema");

const router = require("express").Router();
const addProductRoles = [roles.user];
const updateProductRoles = [roles.user];
const deleteProductRoles = [roles.user, roles.admin];
const hideProductRoles = [roles.user, roles.admin];
const likeProductRoles = [roles.user];
const wishlistProductRoles = [roles.user];
const displayUserRoles = [roles.admin, roles.hr, roles.user];

const productImages = multerUpload(multerValidFileTypes.image, "upload/productImages/").array("images", 10);

router.post("/add-product", authentication(addProductRoles), productImages, validation(newProductValidationSchema), addProduct);

router.patch("/edit-product/:productId", authentication(updateProductRoles), 
                validation(editProductValidationSchema), updateProduct);

router.delete("/remove-product/:productId", authentication(deleteProductRoles),
                 validation(findProductValidationSchema), deleteProduct);
router.delete("/remove-product-temp/:productId", authentication(deleteProductRoles),
                 validation(findProductValidationSchema), deleteProduct_soft);
router.patch("/hide-product/:productId", authentication(hideProductRoles),
                 validation(findProductValidationSchema), hideProduct);

router.patch("/:productId/add-like", authentication(likeProductRoles),
                 validation(findProductValidationSchema), likeProduct)
router.patch("/:productId/remove-like", authentication(likeProductRoles),
                 validation(findProductValidationSchema), unlikeProduct)
router.patch("/:productId/add-wishlist", authentication(wishlistProductRoles),
                 validation(findProductValidationSchema), addToWishList)
router.patch("/:productId/remove-wishlist", authentication(wishlistProductRoles), validation(findProductValidationSchema), removeFromWishList)

router.get("/:productId", authentication(displayUserRoles),
                 validation(findProductValidationSchema), displayProductByID);
router.get("/", authentication(displayUserRoles), validation(findAllProductsValidationSchema),  displayAllProducts)


module.exports = router;