// @ts-nocheck
const mongoose = require("mongoose");
const replyOfCommentSchema = require("./ReplyOfComment");
const DBschema = mongoose.Schema;

const commentSchema = new DBschema({
    text: {
        type: DBschema.Types.String,
        required: true
    },
    createdBy: {
        type: DBschema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        _id: false, 
        type: DBschema.Types.ObjectId,
        ref: "User"
    }],
    replies:[replyOfCommentSchema]
}, {
    timestamps: true
})


module.exports=commentSchema;