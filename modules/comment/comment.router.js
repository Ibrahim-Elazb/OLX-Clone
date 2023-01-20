const router = require("express").Router();
const { roles, authentication } = require("../../Middleware/authentication");
const validation = require("../../Middleware/validation");
const { newCommentValidationSchema,
    likeCommentValidationSchema,
    editCommentValidationSchema,
    newReplyValidationSchema,
    editReplyValidationSchema,
    likeReplyValidationSchema } = require("./comment.validatioSchema");
const { addComment, deleteComment, updateComment } = require("./controller/comments");
const { likeComment, unLikeComment, likeReply, unLikeReply } = require("./controller/likes");
const { addReply, updateReply, deleteReply } = require("./controller/replies");

const comment_reply_Roles = [roles.user, roles.admin];

router.post("/:productId/add-comment", authentication(comment_reply_Roles), validation(newCommentValidationSchema), addComment)
router.delete("/:productId/delete-comment/:commentId", authentication(comment_reply_Roles), validation(likeCommentValidationSchema), deleteComment)
router.patch("/:productId/edit-comment/:commentId", authentication(comment_reply_Roles), validation(editCommentValidationSchema), updateComment)
router.patch("/:productId/:commentId/add-like", authentication(comment_reply_Roles), validation(likeCommentValidationSchema), likeComment)
router.patch("/:productId/:commentId/remove-like", authentication(comment_reply_Roles), validation(likeCommentValidationSchema), unLikeComment)

router.post("/:productId/:commentId/add-reply", authentication(comment_reply_Roles), validation(newReplyValidationSchema), addReply)
router.patch("/:productId/:commentId/edit-reply/:replyId", authentication(comment_reply_Roles), validation(editReplyValidationSchema), updateReply)
router.delete("/:productId/:commentId/delete-reply/:replyId", authentication(comment_reply_Roles), validation(likeReplyValidationSchema), deleteReply)
router.patch("/:productId/:commentId/:replyId/add-like", authentication(comment_reply_Roles), validation(likeReplyValidationSchema), likeReply)
router.patch("/:productId/:commentId/:replyId/remove-like", authentication(comment_reply_Roles), validation(likeReplyValidationSchema), unLikeReply)

module.exports = router
