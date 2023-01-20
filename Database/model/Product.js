// @ts-nocheck
const mongoose = require("mongoose");
const DBschema = mongoose.Schema;
const commentSchema = require("./Comment");

const productSchema = new DBschema({
    title: {
        type: DBschema.Types.String,
        required: true
    },
    description: {
        type: DBschema.Types.String,
        required: true
    },
    price: {
        type: DBschema.Types.Number,
        required: true
    },
    images: {
        type: DBschema.Types.Array,
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
    comments: [commentSchema],
    Wishlist: {
        type: [{
            _id: false, 
            type: DBschema.Types.ObjectId,
            ref: "User",
        }],
        default: []
    },
    hidden: {
        type: DBschema.Types.Boolean,
        default: false
    },
    isDeleted: {
        type: DBschema.Types.Boolean,
        default: false
    }
}, {
    timestamps: true
});


const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;