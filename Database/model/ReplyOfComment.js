// @ts-nocheck
const mongoose = require("mongoose");
const DBschema = mongoose.Schema;

const replyOfCommentSchema = new DBschema({
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
    }]
}, {
    timestamps: true
})


module.exports=replyOfCommentSchema;